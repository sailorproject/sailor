--------------------------------------------------------------------------------
-- lp_ex.lua, v0.2 - Extension to lua pages, bridge with lua at client
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local lp = require"web_utils.lp"
local lat = require"latclient"

local M = {
	lat = lat
}

function M.translate (s,skip_lat)
	if not skip_lat then
		s = lat.translate(s)
	end
	return lp.translate(s)
end

function M.setoutfunc (f)
	lp.setoutfunc(f)
end

return M
