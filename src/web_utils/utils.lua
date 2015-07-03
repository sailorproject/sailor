local os_tmpname, gsub =  os.tmpname, string.gsub

local M = {
}

-- Default function for temporary names
-- @returns a temporay name using os.tmpname
function M.tmpname ()
    local tempname = os_tmpname()
    -- Lua os.tmpname returns a full path in Unix, but not in Windows
    -- so we strip the eventual prefix
    tempname = gsub(tempname, "(/tmp/)", "")
    return tempname
end

function M.deepcopy(orig)
    local orig_type = type(orig)
    local copy
    if orig_type == 'table' then
        copy = {}
        for orig_key, orig_value in next, orig, nil do
            copy[M.deepcopy(orig_key)] = M.deepcopy(orig_value)
        end
        setmetatable(copy, M.deepcopy(getmetatable(orig)))
    else -- number, string, boolean, etc
        copy = orig
    end
    return copy
end

return M
