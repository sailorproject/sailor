--------------------------------------------------------------------------------
-- test.lua, v0.1: Helper functions for testing functionality
-- This file is a part of Sailor project
-- Copyright (c) 2014-2015 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local M = {}

local db = require "sailor.db"

function M.load_fixtures(model_name)
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

return M
