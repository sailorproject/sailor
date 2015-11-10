-- A helper file contains functions to be shared among all tests
-- Needs to be required

local M = {}

function M.tostring (val, indent, sep, ln, inspect)
  indent = indent or 0
  inspect = inspect or ''
  sep = sep or ' '
  ln = ln or "\n"

  if type(val) ~= "table" then
      inspect = inspect .. tostring(val)
  else
    for k, v in pairs(val) do
      if(k ~= "__newindex") then
          local formatting = ln..string.rep(sep, indent) .. k .. ": "
          inspect = inspect.. formatting 
          inspect = M.tostring(v, indent+8, sep, ln, inspect)    
      end
    end
  end
  return inspect
end

return M