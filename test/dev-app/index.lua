package.path =  ((debug.getinfo(1).source):match('^@?(.-)/index.lua$') or '')..'../../src/?.lua;'..package.path

local sailor = require "sailor"
sailor.launch()
