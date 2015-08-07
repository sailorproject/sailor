local lp = require"web_utils.lp"
local lat = require"latclient"

local M = {
	lat = lat
}

function M.translate (s)
	lat.js_url = "./pub"
	s = lat.translate(s)
	return lp.translate(s)
end

function M.setoutfunc (f)
	lat.js_served = false
	lat.modules_served = {}
	lp.setoutfunc(f)
end

return M
