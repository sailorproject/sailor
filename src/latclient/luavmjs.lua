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
		<script src="{url}/luavmjs/lua.vm.js"></script>
		]]
		header = string.gsub(header, "{url}", M.js_url)
		s = header..s
	end
	return s
end

function M.get_client_js(s)
	s = '<script type="text/lua">'..s..'</script>'
	return M.get_header(s)
end

return M
