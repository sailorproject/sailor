--------------------------------------------------------------------------------
-- db.lua, v0.3: DB module for connecting and querying through different DB modules
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local main_conf = require "conf.conf"
local conf = main_conf.db[main_conf.sailor.environment]
local remy = require "remy"

local db

if remy.detect() == remy.MODE_NGINX and conf.driver == "mysql" then
	db = require "sailor.db.resty_mysql"
else	
	db = require "sailor.db.luasql"
end

return db
