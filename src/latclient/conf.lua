-- Use the same config file as Sailor
require "conf.conf"
local conf = require "conf.conf"
if not conf.lua_at_client or not conf.lua_at_client.vm then
       conf.lua_at_client = { vm = 'starlight'} -- default
end
return conf