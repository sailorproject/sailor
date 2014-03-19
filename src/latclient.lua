--[[
Lua@Client 0.1.3
Lua Pages Template Preprocessor Extension and Script Provider
Copyright (c) 2014 Felipe Daragon

License: MIT
]]

local M = {
	js_url = "js",
	js_served = false
}

--M.js_url = "http://127.0.0.1/sailor/pub/thirdparty/latclient/js"

function M.translate(src)
	local get_both = function(s) return '<? '..s..' ?>'..M.get_client_js(s) end
	src = string.gsub(src,'<[?]lua@both%s*(.-)%s*[?]>',get_both) -- must come first
	src = string.gsub(src,'<[?]lua@client%s*(.-)%s*[?]>',M.get_client_js)
	src = string.gsub(src,'<[?]lua@server%s*(.-)%s*[?]>','<? %1 ?>')
	return src
end

function M.get_header(s)
	if M.js_served == false then
		M.js_served = true
		local header = [[
		<script src="{url}/lib/lua5.1.5.min.js"></script>
		<script src="{url}/latclient.js"></script>
		<script src="{url}/js-lua.js"></script>
		]]
		header = string.gsub(header, "{url}", M.js_url)
		s = header..s
	end
	return s
end

function M.get_client_js(s)
	local s = M.js_string_escape(s)
	s = '<script type="text/javascript">LuaCS.runString('..s..')</script>'
	return M.get_header(s)
end

function M.get_provide_script(fn,path,filename)
	local js = [[
	(function(Lua5_1) {
		Lua5_1.provide_file(%s, %s, %s,true, false);
		})(Lua5_1);
		]]
		local file = io.open (fn, "r")
		local src = file:read("*all")
		file:close()
		src = M.js_string_escape(src)
		path = M.js_string_escape(path)
		filename = M.js_string_escape(filename)
		return string.format(js, path, filename, src)
end

-- File provider for mod_lua
function M.handle(r,path,filename)
		r.content_type = "text/javascript"
		if filename == nil then
			filename = r.uri:match( "([^/]+)$")
		end
		if path == nil then
			path = r.uri:match("^@?(.-)/"..filename.."$").."/"
		end
		r:puts(M.get_provide_script(r.filename,path,filename))
		return apache2.OK
end

-- File provider for CGI-Lua
function M.cgilua_exit(path,filename)
		if cgilua ~= nil then
			cgilua.contentheader("text","javascript")
			if filename == nil then
				filename = cgilua.script_path:match( "([^/]+)$")
			end
			if path == nil then
				path = cgilua.servervariable("SCRIPT_NAME"):match("^@?(.-)/"..filename.."$").."/"
			end
			cgilua.put(M.get_provide_script(cgilua.script_path,path,filename))
			os.exit()
		end
end

function M.js_string_escape(s)
		-- This code is a part of lua5.1.js project:
		-- Copyright (c) LogicEditor <info@logiceditor.com>
		-- Copyright (c) lua5.1.js authors
		-- Based on luajson code
		-- https://github.com/harningt/luajson/blob/master/lua/json/encode/strings.lua

		local matches =
		{
			['"'] = '\\"';
			['\\'] = '\\\\';
			['\b'] = '\\b';
			['\f'] = '\\f';
			['\n'] = '\\n';
			['\r'] = '\\r';
			['\t'] = '\\t';
			['\v'] = '\\v'; -- not in official spec, on report, removing
		}

		for i = 0, 255 do
			local c = string.char(i)
			if c:match('[%z\1-\031\128-\255]') and not matches[c] then
				matches[c] = ('\\x%.2X'):format(i)
			end
		end


		return '"' .. s:gsub('[\\"/%z\1-\031\128-\255]', matches) .. '"'

end

return M
