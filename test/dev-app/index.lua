local base_dir = ((debug.getinfo(1).source):match('^@?(.-)index.lua$') or '')

package.path =  base_dir..'../../src/?.lua;'..package.path

local sailor = require "sailor"
sailor.launch()
