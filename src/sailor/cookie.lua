--------------------------------------------------------------------------------
-- cookie.lua, v0.2: lib for cookies
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local cookie = {}

function cookie.set(r, key, value)
    r.headers_out['Set-Cookie'] = ("%s=%s;"):format(key, value)
end

function cookie.get(r, key)
    local value = (r.headers_in['Cookie'] or ""):match(key .. "=([^;]+)") or ""
    return value
end

return cookie