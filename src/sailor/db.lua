--------------------------------------------------------------------------------
-- db.lua, v0.2: DB module for connecting and querying through LuaSQL
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local db = {env,con}
local conf = require("conf.conf").db
local luasql = require "luasql.mysql"


--- Creates an instance of a db.
-- @param obj table: if given, is used to store the object
-- @return table or (nil, string): the object
function db:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	self.__index = self
	return obj
end

-- Creates the connection of the instance
function db:connect()
	self.env = assert (luasql[conf.driver]())
	self.con = assert (self.env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

-- Closes the connection of the instance
function db:close()
	self.con:close()
	self.env:close()
end

-- Runs a query
-- @param query string: the query to be executed
-- @return table: a cursor 
function db:query(query)
	local cur = assert(self.con:execute(query))
	return cur
end

-- Escapes a string or a table (its values). Should be used before concatenating strings on a query.
-- @param q string or table: the string or table to be escaped
-- @return string or nil: if q is a string, returns the new escaped string. If q is a table
--							it simply returns, since it already escaped the table's values 
function db:escape(q)
	if type(q) == "string" then
		q = self.con:escape(q)
		return q
	elseif type(q) == "table" then
		for k,v in pairs(q) do 
			q[k] = self.con:escape(v)
		end
		return 
	end
	return q
end


--- Runs two queries and returns the result of the second query.
-- It is no longer in use. It was used by src.model to insert and obtain the last id.
-- It is now replaced by query_insert but it's still a valid method that could be used again.
-- @param q1 string: first query to be executed
-- @param q2 string: second query to be executed
-- return table: the result of the second execution
--[[function db:query_query(q1,q2)
	local res
	local rows = assert(self.con:execute(q1))
	if rows == 0 then
		res = 0
	else
		res = assert(self.con:execute(q2))
	end
	return res
end]]

--- Runs a query and returns the id of the last inserted row. Used for saving 
-- a model and obtaining the model id.
-- @param query string: the query to be executed
-- return number or string: the id of the last inserted row.
function db:query_insert(query)
	assert(self.con:execute(query))
	local id = self.con:getlastautoid()
	return id
end

return db
