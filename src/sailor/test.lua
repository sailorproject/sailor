--------------------------------------------------------------------------------
-- test.lua, v0.2: Helper functions for testing functionality
-- This file is a part of Sailor project
-- Copyright (c) 2014-2015 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local M = {}


function M.load_fixtures(model_name)
	local db = require "sailor.db"

	local Model = sailor.model(model_name)
	local fixtures = require("tests.fixtures."..model_name) or {}
	local objects = {}
	db.connect()
	db.query('truncate table ' .. Model.db.table .. ';') -- Reseting current state
	db.close()
	for _,v in pairs(fixtures) do  -- loading fixtures
	  o = Model:new(v)
	  o:save(false)
	end
end

local function redirected(response, path)
	if response.status ~= 302 then return false end
	return (response.headers['Location']):match(path) and true or false
end


function M.request(path, data, additional_headers)
	local conf = require "conf.conf"
	data = data or {}
	conf.sailor.friendly_urls = false

	local body = ''
	local function write(_,data) body = body .. data end
	local r = { uri = '/'..path, write = write, puts = write, headers_in = {}, headers_out = {} }
	
	local page = sailor.init(r)
	page.POST = data.post or {}
	page.GET = data.get or {}
	page.GET[conf.sailor.route_parameter] = path
	local status = sailor.route(page)
	
	return {status = status, body = body, headers = r.headers_out, redirected = redirected}
end

return M
