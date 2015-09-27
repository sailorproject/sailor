-- Alternative index for LightTPD's mod_magnet
if lighty ~= nil then
  -- Note: package.loaded.lighty ~= nil will not work because lighty is a
  -- local variable and not a package
  local docroot = lighty.env['physical.doc-root']
  package.path = package.path..";"..docroot.."/../lib/lua/?.lua"
  package.cpath = package.cpath..";"..docroot.."/../lib/clibs/?.dll"
  package.path = package.path..";"..docroot.."/sailor/?.lua"
  
  -- Makes lighty global so it can be accessed by Remy or controllers
  _G["lighty"] = lighty
  local sailor = require "sailor"
  sailor.launch()
  return sailor.r.status
end

