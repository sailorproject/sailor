-- This file is part of the Lua@Client project
-- Copyright (c) 2015 Etiene Dalcol
-- License: MIT

local M = {
	js_served = false,
	modules_served = {}
}

local common = require "latclient.common"
local loadstring = loadstring or load

function M.get_header(s)
	if M.js_served == false then
		M.js_served = true
		local header = [[
		<script src="{url}/moonshine/moonshine.min.js"></script>
		<script src="{url}/moonshine/distillery.moonshine.min.js"></script>
		<script src="{url}/moonshine/DOMAPI.moonshine.min.js"></script>
		<script>var vm = new shine.VM(shine.DOMAPI);</script>
		]]
		header = string.gsub(header, "{url}", M.js_url)
		s = header..s
	end
	return s
end


function M.get_client_js(s)
	local modules = M.get_modules(s)
	s = string.dump(assert(loadstring(s)))
	s = common.js_string_escape(s)
	s = '<script>'..modules..'vm.load('..s..');</script>'
	return M.get_header(s)
end


function M.get_modules(s)
	local modules = ""
	for name in string.gfind(s, "require%s*%(?[\"'](.-)[\"']%)?")  do
		if not M.modules_served[name] then
			local module_file = common.search_module_path(name)
			if module_file then
				local module_bytecode = common.js_string_escape(string.dump(assert(loadfile(module_file))))
				modules = modules .. 'vm.preload("'..name..'",'..module_bytecode..'); '
				M.modules_served[name] = true
			end
		end
	end
	return modules
end

return M