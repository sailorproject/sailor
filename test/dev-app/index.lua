package.path = package.path .. ';'..((debug.getinfo(1).source):match('^@?(.-)/index.lua$') or '')..'/../../src/?.lua'
require "sailor"
sailor.launch()
