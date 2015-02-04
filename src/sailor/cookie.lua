--------------------------------------------------------------------------------
-- cookie.lua, v1.0: lib for cookies
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local cookie = {}

function cookie.set(r, key, value, path)
	path = path or "/"
    r.headers_out['Set-Cookie'] = ("%s=%s;Path=%s;"):format(key, value, path)
end

function cookie.get(r, key)
    local value = (r.headers_in['Cookie'] or ""):match(key .. "=([^;]+)") or ""
    return value
end

return cookie