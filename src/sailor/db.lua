--------------------------------------------------------------------------------
-- db.lua, v0.2.1: DB module for connecting and querying through LuaSQL
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local db = {env,con}
local conf = require("conf.conf").db
local luasql = require("luasql."..conf.driver)

-- Creates the connection of the instance
function db.connect()
	db.env = assert (luasql[conf.driver]())
	db.con = assert (db.env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

-- Closes the connection of the instance
function db.close()
	db.con:close()
	db.env:close()
end

-- Runs a query
-- @param query string: the query to be executed
-- @return table: a cursor 
function db.query(query)
	local cur = assert(db.con:execute(query))
	return cur
end

-- Escapes a string or a table (its values). Should be used before concatenating strings on a query.
-- @param q string or table: the string or table to be escaped
-- @return string or nil: if q is a string, returns the new escaped string. If q is a table
--							it simply returns, since it already escaped the table's values 
function db.escape(q)
	if type(q) == "string" then
		q = db.con:escape(q)
		return q
	elseif type(q) == "table" then
		for k,v in pairs(q) do 
			q[k] = db.con:escape(v)
		end
		return 
	end
	return q
end


--- Runs two queries and returns the result of the second query.
-- It is no longer in use. It was used by sailor.model to insert and obtain the last id.
-- It is now replaced by query_insert but it's still a valid method that could be used again.
-- @param q1 string: first query to be executed
-- @param q2 string: second query to be executed
-- return table: the result of the second execution
--[[function db.query_query(q1,q2)
	local res
	local rows = assert(db.con:execute(q1))
	if rows == 0 then
		res = 0
	else
		res = assert(db.con:execute(q2))
	end
	return res
end]]

--- Runs a query and returns the id of the last inserted row. Used for saving 
-- a model and obtaining the model id.
-- @param query string: the query to be executed
-- return number or string: the id of the last inserted row.
function db.query_insert(query)
	local id
	if conf.driver == "postgresql" then
		query = query .. "RETURNING uid; "
		id = assert(db.con:execute(query))
	else
		query  = query .. "; "
		assert(db.con:execute(query))
		id = db.con:getlastautoid()
	end

	return id
end

return db
