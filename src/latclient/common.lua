-- This file is part of the Lua@Client project
-- Copyright (c) 2014 Felipe Daragon
-- Portions copyright (c) 2015 Etiene Dalcol
-- License: MIT

local M = {}

local function file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end

function M.search_module_path(name)
	local path
	name = string.gsub(name,'%.','/')
	for s in string.gmatch(package.path, "[^;]+") do
	  path = string.gsub(s,'?',name)
	  if file_exists(path) then return path end
	end
	return nil
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


		return '`' .. s:gsub('[\\"/%z\1-\031\128-\255]', matches) .. ''

end

return M