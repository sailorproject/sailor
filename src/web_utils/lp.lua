----------------------------------------------------------------------------
-- Lua Pages Template Preprocessor.
--
-- @release $Id: lp.lua,v 1.15 2008/12/11 17:40:24 mascarenhas Exp $
----------------------------------------------------------------------------

local assert, error, loadstring = assert, error, loadstring
local find, format, gsub, strsub, char = string.find, string.format, string.gsub, string.sub, string.char
local concat, tinsert = table.concat, table.insert
local open = io.open

local M = {}

----------------------------------------------------------------------------
-- function to do output
local outfunc = "io.write"
-- accepts the old expression field: `$| <Lua expression> |$'
local compatmode = true

--
-- Builds a piece of Lua code which outputs the (part of the) given string.
-- @param s String.
-- @param i Number with the initial position in the string.
-- @param f Number with the final position in the string (default == -1).
-- @return String with the correspondent Lua code which outputs the part of the string.
--
local function out (s, i, f)
        s = strsub(s, i, f or -1)
        if s == "" then return s end
        -- we could use `%q' here, but this way we have better control
        s = gsub(s, "([\\\n\'])", "\\%1")
        -- substitute '\r' by '\'+'r' and let `loadstring' reconstruct it
        s = gsub(s, "\r", "\\r")
        return format(" %s('%s'); ", outfunc, s)
end


----------------------------------------------------------------------------
-- Translate the template to Lua code.
-- @param s String to translate.
-- @return String with translated code.
----------------------------------------------------------------------------
function M.translate (s)
        s = gsub(s, "^#![^\n]+\n", "")
        if compatmode then
                s = gsub(s, "$|(.-)|%$", "<?lua = %1 ?>")
                s = gsub(s, "<!%-%-$$(.-)$$%-%->", "<?lua %1 ?>")
        end
        s = gsub(s, "<%%(.-)%%>", "<?lua %1 ?>")
        local res = {}
        local start = 1   -- start of untranslated part in `s'
        while true do
                local ip, fp, target, exp, code = find(s, "<%?(%w*)[ \t]*(=?)(.-)%?>", start)
                if not ip then break end
                tinsert(res, out(s, start, ip-1))
                if target ~= "" and target ~= "lua" then
                        -- not for Lua; pass whole instruction to the output
                        tinsert(res, out(s, ip, fp))
                else
                        if exp == "=" then   -- expression?
                                tinsert(res, format(" %s(%s);", outfunc, code))
                        else  -- command
                                tinsert(res, format(" %s ", code))
                        end
                end
                start = fp + 1
        end
        tinsert(res, out(s, start))
        return concat(res)
end


----------------------------------------------------------------------------
-- Defines the name of the output function.
-- @param f String with the name of the function which produces output.

function M.setoutfunc (f)
        outfunc = f
end

----------------------------------------------------------------------------
-- Turns on or off the compatibility with old CGILua 3.X behavior.
-- @param c Boolean indicating if the compatibility mode should be used.

function M.setcompatmode (c)
        compatmode = c
end

----------------------------------------------------------------------------
-- Internal compilation cache.

local cache = {}

----------------------------------------------------------------------------
-- Translates a template into a Lua function.
-- Does NOT execute the resulting function.
-- Uses a cache of templates.
-- @param string String with the template to be translated.
-- @param chunkname String with the name of the chunk, for debugging purposes.
-- @param env Table with the environment of the resulting function (optional).
-- @return Function with the resulting translation.

function M.compile (string, chunkname, env)
        local s, err = cache[string]
        if not s then
                s = M.translate (string)
                cache[string] = s
        end
        f, err = load (s, chunkname, "bt", env)
        if not f then error (err, 3) end
        return f
end

----------------------------------------------------------------------------
-- Translates and executes a template in a given file.
-- The translation creates a Lua function which will be executed in an
-- optionally given environment.
-- @param filename String with the name of the file containing the template.
-- @param env Table with the environment to run the resulting function.
local BOM = char(239) .. char(187) .. char(191)

function M.include (filename, env)
        -- read the whole contents of the file
        local fh = assert (open (filename))
        local src = fh:read("*a")
        fh:close()

        if src:sub(1,3) == BOM then src = src:sub(4) end
        -- translates the file into a function
        local prog = M.compile (src, '@'..filename, env)
        prog ()
end

return M