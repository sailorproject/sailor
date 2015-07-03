--------------------------------------------------------------------------------
-- test.lua, v0.4: Helper functions for testing functionality
-- This file is a part of Sailor project
-- Copyright (c) 2014-2015 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local M = {}

local page
local r

-- Prepares for making a request
function M:prepare(write_func, headers_in)	
	headers_in = headers_in or {}
	r = { uri = '', write = write_func, puts = write_func, headers_in = headers_in, headers_out = {} }
	page = sailor.init(r)
	return self
end

-- Loads tests fixtures into the database
-- Warning, this will truncate the table, make sure you have configured a test database
-- Returns table with objects created
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
	  table.insert(objects, o)
	end
	return objects
end

-- Function that is a part of the request response.
-- Verifies if the request redirected somewhere
-- Requires path: string
-- Returns boolean
local function redirected(response, path)
	if response.status ~= 302 then return false end
	return (response.headers['Location']):match(path) and true or false
end

-- Makes a mockup request to an internal sailor path
-- path: string. The path you want to make a request to, such as a controller or controller/action. Example: 'user/view'
-- data: table. A table containing some data you want to send to the request, such as get or post. Example: {get = {id = 1}}
-- additional_headers: A table containing additional headers you may want to send. Example: {ACCEPT = 'application/json'}
-- Returns a table with the following fields:
-- status: number. The status of the response.
-- body: string. The body of the response.
-- headers: table. Any headers out that were set.
-- redirected: function. The above redirect function
function M.request(path, data, additional_headers)
	local conf = require "conf.conf"
	data = data or {}
	local body = ''
	local function write(_,data) body = body .. data end
	conf.sailor.friendly_urls = false

	M:prepare(write,additional_headers)
	page.POST = data.post or {}
	page.GET = data.get or {}
	page.GET[conf.sailor.route_parameter] = path
	local status = sailor.route(page)
	
	return {status = status, body = body, headers = r.headers_out, redirected = redirected}
end

return M:prepare()
