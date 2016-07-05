--------------------------------------------------------------------------------
-- cookie.lua, v1.1: lib for cookies
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local cookie = {}
local remy = require "remy"

function cookie.set(r, key, value, path)
	path = path or "/"
	if remy.detect(r) == remy.MODE_CGILUA then
		local ck = require "cgilua.cookies"
		return ck.set(key,value,{path=path})
	end
  r.headers_out['Set-Cookie'] = ("%s=%s;Path=%s;"):format(key, value, path)
end

function cookie.get(r, key)
	if remy.detect(r) == remy.MODE_CGILUA then
		local ck = require "cgilua.cookies"
		return ck.get(key)
	end
  return (r.headers_in['Cookie'] or ""):match(key .. "=([^;]+)") or ""
end

return cookie