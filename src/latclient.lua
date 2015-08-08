--[[
Lua@Client 0.3
Lua Pages Template Preprocessor Extension
Copyright (c) 2014 Felipe Daragon

License: MIT
]]

local M = {}

local conf = require "conf.conf"
local vm = require("latclient."..conf.lua_at_client.vm)

function M.translate(src)
	local get_both = function(s) return '<? '..s..' ?>'..vm.get_client_js(s) end
	src = string.gsub(src,'<[?]lua@both%s*(.-)%s*[?]>',get_both) -- must come first
	src = string.gsub(src,'<[?]lua@client%s*(.-)%s*[?]>',vm.get_client_js)
	src = string.gsub(src,'<[?]lua@server%s*(.-)%s*[?]>','<? %1 ?>')
	return src
end

return M
