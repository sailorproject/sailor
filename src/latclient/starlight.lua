-- This file is part of the Lua@Client project
-- v0.2
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
		<!-- While target browsers don't support ES6 natively, include Babel parser -->
		<script src="{url}/starlight/browser.5.8.34.min.js"></script>
		<script src="{url}/starlight/starlight.js" data-run-script-tags></script>
		<!-- Starlight! -->
		]]
		header = string.gsub(header, "{url}", M.js_url)
		s = s..header
	end
	return s
end


function M.get_client_js(s)
	local modules = M.get_modules(s)
	s = modules..M.wrap_code(s)
	return M.get_header(s)
end

function M.wrap_code(s,module_name)
	local mod = module_name and table.concat{'data-modname="',module_name,'"'} or ''

	return table.concat({
		'<script type="application/x-lua"',
		mod,
		'>',
		s,
		'</script>'
	}, '\n')
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
				modules = modules..M.wrap_code(file_str,name)
				M.modules_served[name] = true
			end
		end
	end
	return modules
end

return M