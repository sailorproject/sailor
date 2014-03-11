package.path = package.path .. ';./src/lib/?.lua;'
require "src.sailor"
sailor.launch()