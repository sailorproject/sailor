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
	lp.setoutfunc(f)
end

return M
