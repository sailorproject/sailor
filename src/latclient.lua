--[[
Lua@Client 0.3.1
Lua Pages Template Preprocessor Extension
Copyright (c) 2014-2015 Felipe Daragon

License: MIT
]]

local M = {}

local conf = require "latclient.conf"
local vm = require("latclient."..conf.lua_at_client.vm)
vm.js_url = conf.lua_at_client.vm_url or "./pub"

function M.translate(src)
  -- Reset for persistent environments (like Lighttpd)
  vm.js_served = false
  vm.modules_served = {}
  
  -- Starts processing Lua@Client tags
	local get_both = function(s) return '<? '..s..' ?>'..vm.get_client_js(s) end
	src = string.gsub(src,'<[?]lua@both%s*(.-)%s*[?]>',get_both) -- must come first
	src = string.gsub(src,'<[?]lua@client%s*(.-)%s*[?]>',vm.get_client_js)
	src = string.gsub(src,'<[?]lua@server%s*(.-)%s*[?]>','<? %1 ?>')
	return src
end

return M
