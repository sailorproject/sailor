-- This file is part of the Lua@Client project
-- Copyright (c) 2015 Etiene Dalcol
-- License: MIT

local M = {
	js_served = false,
	modules_served = {}
}

local common = require "latclient.common"

function M.get_header(s)
	if M.js_served == false then
		M.js_served = true
		local header = [[
		<script src="./pub/starlight/starlight.min.js"></script>
		<script src="./pub/starlight/parser.min.js"></script>
		<script src="./pub/starlight/babel.min.js"></script>
		<script src="./pub/starlight/DOMAPI.min.js"></script>
		]]
		s = header..s
	end
	return s
end


function M.get_client_js(s)
	local modules = M.get_modules(s)
	s = '<script>'..modules..'(starlight.parser.parse(`'..s..'`))();</script>'
	return M.get_header(s)
end


function M.get_modules(s)
	local modules = ""
	for name in string.gfind(s, "require%s*%(?[\"'](.-)[\"']%)?")  do
		if not M.modules_served[name] then
			local module_file = common.search_module_path(name)
			if module_file then
				local file = io.open(module_file,'r')
				local file_str = file:read("*a")
				file:close()
				local lua_code = "rawset(package.preload, '" .. name.. [[', function(...)\n ]]
				 .. file_str .. 
				 [[ \nend)]]
				modules = modules .. '(starlight.parser.parse(`'..lua_code..'`))(); '
				M.modules_served[name] = true
			end
		end
	end
	return modules
end

return M