--[[
Lua@Client 0.2
Lua Pages Template Preprocessor Extension
Copyright (c) 2014 Felipe Daragon

License: MIT
]]

local M = {
	js_url = "js",
	js_served = false,
	modules_served = {}
}

local conf = require "conf.conf"

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
		local header 
		if conf.lua_at_client and conf.lua_at_client.parse_at_server then
			header = [[
		<script src="{url}/moonshine/moonshine.min.js"></script>
		<script src="{url}/moonshine/distillery.moonshine.min.js"></script>
		<script src="{url}/moonshine/DOMAPI.moonshine.min.js"></script>
		<script>var vm = new shine.VM(shine.DOMAPI);</script>
		]]
		else
			header = [[
		<script src="{url}/starlight/starlight.min.js"></script>
		<script src="{url}/starlight/parser.min.js"></script>
		<script src="{url}/starlight/babel.min.js"></script>
		<script src="{url}/starlight/DOMAPI.min.js"></script>
		]]
		end
		header = string.gsub(header, "{url}", M.js_url)
		s = header..s
	end
	return s
end

function M.get_client_js(s)
	local modules = M.get_modules(s)
	if conf.lua_at_client and conf.lua_at_client.parse_at_server then
		s = string.dump(assert(loadstring(s)))
		s = M.js_string_escape(s)
		s = '<script>'..modules..'vm.load('..s..');</script>'
	else
		s = '<script>'..modules..'(starlight.parser.parse(`'..s..'`))();</script>'

	end
	return M.get_header(s)
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


local function file_exists(name)
   local f=io.open(name,"r")
   if f~=nil then io.close(f) return true else return false end
end

local function search_module_path(name)
	local path
	name = string.gsub(name,'%.','/')
	for s in string.gmatch(package.path, "[^;]+") do
	  path = string.gsub(s,'?',name)
	  if file_exists(path) then return path end
	end
	return nil
end

function M.get_modules(s)
	local modules = ""
	for name in string.gfind(s, "require%s*%(?[\"'](.-)[\"']%)?")  do
		if not M.modules_served[name] then
			local module_file = search_module_path(name)
			if module_file then
				if conf.lua_at_client and conf.lua_at_client.parse_at_server then
					local module_bytecode = M.js_string_escape(string.dump(assert(loadfile(module_file))))
					modules = modules .. 'vm.preload("'..name..'",'..module_bytecode..'); '
				else
					local file = io.open(module_file,'r')
					local file_str = file:read("*a")
					file:close()
					local lua_code = "rawset(package.preload, '" .. name.. [[', function(...)\n ]]
					 .. file_str .. 
					 [[ \nend)]]
					modules = modules .. '(starlight.parser.parse(`'..lua_code..'`))(); '
				end
				M.modules_served[name] = true
			end
		end
	end
	return modules
end

return M
