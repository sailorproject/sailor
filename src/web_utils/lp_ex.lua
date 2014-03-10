local lp = require"src.web_utils.lp"
local lat = require"src.web_utils.latclient"

local M = {
	lat = lat
}

function M.translate (s)
	lat.js_url = "pub/latclient/js"
	s = lat.translate(s)
	return lp.translate(s)
end

function M.setoutfunc (f)
	lp.setoutfunc(f)
end

return M
