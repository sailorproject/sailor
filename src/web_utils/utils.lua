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

return M