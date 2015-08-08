local M = {
	js_served = false,
	modules_served = {}
}

local common = require "latclient.common"

function M.get_header(s)
	if M.js_served == false then
		M.js_served = true
		local header = [[
		<script src="./pub/luavmjs/lua.vm.js"></script>
		]]
		s = header..s
	end
	return s
end

function M.get_client_js(s)
	s = '<script type="text/lua">'..s..'</script>'
	return M.get_header(s)
end

return M
