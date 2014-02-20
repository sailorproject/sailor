local cookie = {}

function cookie.set(r, key, value)
    r.headers_out['Set-Cookie'] = ("%s=%s;"):format(key, value)
end

function cookie.get(r, key)
    local value = (r.headers_in['Cookie'] or ""):match(key .. "=([^;]+)") or ""
    return value
end

return cookie