-- Alternative index for LightTPD's mod_magnet
if package.loaded.lighty ~= nil then
  local lighty = require "lighty"
  local docroot = lighty.env['physical.doc-root']
  package.path = package.path..";"..docroot.."/../lib/lua/?.lua"
  package.cpath = package.cpath..";"..docroot.."/../lib/clibs/?.dll"
  package.path = package.path..";"..docroot.."/sailor/?.lua"

  local sailor = require "sailor"
  sailor.launch()
  return sailor.r.status
end
