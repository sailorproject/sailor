----------------------------------------------------------------------------
-- Serialize tables.
-- It works only for tables without cycles and without functions or
-- userdata inside it.
-- @release $Id: serialize.lua,v 1.7 2007/04/16 14:01:32 tomas Exp $
----------------------------------------------------------------------------

local ipairs, pairs, type = ipairs, pairs, type
local format = string.format
local sort, tinsert = table.sort, table.insert

--
local value = nil

----------------------------------------------------------------------------
-- Serializes a table.
-- @param tab Table representing the session.
-- @param outf Function used to generate the output.
-- @param ind String with indentation pattern (default = "").
-- @param pre String with indentation prefix (default = "").
----------------------------------------------------------------------------
local function tabledump (tab, outf, ind, pre)
	local sep_n, sep, _n = ",\n", ", ", "\n"
	if (not ind) or (ind == "") then ind = ""; sep_n = ", "; _n = "" end
	if not pre then pre = "" end
	outf ("{")
	local p = pre..ind
	-- prepare list of keys
	local keys = { boolean = {}, number = {}, string = {} }
	local total = 0
	for key in pairs (tab) do
		total = total + 1
		local t = type(key)
		if t == "string" then
			tinsert (keys.string, key)
		else
			keys[t][key] = true
		end
	end
	local many = total > 5
	if not many then sep_n = sep; _n = " " end
	outf (_n)
	-- serialize entries with numeric keys
	if many then
		local _f,_s,_v = ipairs(tab)
		if _f(_s,_v) then outf (p) end
	end
	local num = keys.number
	local ok = false
	-- entries with automatic index
	for key, val in ipairs (tab) do
		value (val, outf, ind, p)
		outf (sep)
		num[key] = nil
		ok = true
	end
	if ok and many then outf (_n) end
	-- entries with explicit index
	for key in pairs (num) do
		if many then outf (p) end
		outf ("[")
		outf (key)
		outf ("] = ")
		value (tab[key], outf, ind, p)
		outf (sep_n)
	end
	-- serialize entries with boolean keys
	local tr = keys.boolean[true]
	if tr then
		outf (format ("%s[true] = ", many and p or ''))
		value (tab[true], outf, ind, p)
		outf (sep_n)
	end
	local fa = keys.boolean[false]
	if fa then
		outf (format ("%s[false] = ", many and p or ''))
		value (tab[false], outf, ind, p)
		outf (sep_n)
	end
	-- serialize entries with string keys
	sort (keys.string)
	for _, key in ipairs (keys.string) do
		outf (format ("%s[%q] = ", many and p or '', key))
		value (tab[key], outf, ind, p)
		outf (sep_n)
	end
	if many then outf (pre) end
	outf ("}")
end


--
-- Serializes a value.
--
value = function (v, outf, ind, pre)
	local t = type (v)
	if t == "string" then
		outf (format ("%q", v))
	elseif t == "number" then
		outf (tostring(v))
	elseif t == "boolean" then
		outf (tostring(v))
	elseif t == "table" then
		tabledump (v, outf, ind, pre)
	else
		outf (format ("%q", tostring(v)))
	end
end

----------------------------------------------------------------------------
return {
	serialize = tabledump,
}