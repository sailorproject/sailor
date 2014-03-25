package = "Sailor"
version = "0.2-1"
source = {
   url = "git://github.com/Etiene/sailor",
   tag = "v0.2"
}
description = {
   summary = "A Lua MVC Framework",
   detailed = [[
      Sailor is a web framework written in Lua that follows the MVC design pattern.
   ]],
   homepage = "https://github.com/Etiene/sailor", 
   license = "MIT"
}
dependencies = {
   "lua >= 5.1, < 5.3",
   'luafilesystem >= 1.6.2',
   'luasql-mysql >= 2.3.0',
   'luasocket >= 3.0',
   'luasec >= 0.5',
   'valua >= 0.2.1',
}
build = {
   type = "builtin",
   modules = {
      ["remy"] = "src/remy.lua",
      ["latclient"] = "src/latclient.lua",
      ["sailor"] = "src/sailor.lua",
   },
   install = {
      bin = {
         sailor_create = "sailor_create.lua"
      }
   }
}