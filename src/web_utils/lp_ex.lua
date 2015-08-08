local lp = require"web_utils.lp"
local lat = require"latclient"

local M = {
	lat = lat
}

function M.translate (s)
	s = lat.translate(s)
	return lp.translate(s)
end

function M.setoutfunc (f)
	local conf = require "conf.conf"
	local vm = require("latclient."..conf.lua_at_client.vm)
	vm.js_served = false
	vm.modules_served = {}
	lp.setoutfunc(f)
end

return M
