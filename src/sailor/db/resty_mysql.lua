--------------------------------------------------------------------------------
-- rest_mysql.lua, v0.2: DB module for connecting and querying through MySQL on openresty servers
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local main_conf = require "conf.conf"
local conf = main_conf.db[main_conf.sailor.environment]
local mysql = require "resty.mysql"

local db = {instance = nil, transaction = false}

function db.instantiate()
	if not db.instance then
		local instance, err = mysql:new()
    	if not instance then
        	error("Failed to instantiate mysql: ".. (err or ''))
    	end
    	db.instance = instance
	end
end
-- Creates the connection of the instance
function db.connect()
	if db.transaction then return end
	db.instantiate()
	conf.host = string.gsub(conf.host, "localhost", "127.0.0.1")
	local ok, err, errno, sqlstate = db.instance:connect{
        host = conf.host,
        port = 3306,
        database = conf.dbname,
        user = conf.user,
        password = conf.pass,
        max_packet_size = 1024 * 1024 
    }
    if not ok then
	   error("Failed to connect to database: ".. tostring(err)..": ".. (errno or '') .." "..(sqlstate or ''))
	end
end

-- Closes the connection of the instance
function db.close()
	if db.transaction then return end
	local ok, err = db.instance:close()
    if not ok then
        error("Failed to close database connection: ".. err)
    end
    db.instance = nil
end

-- Runs a query
-- @param query string: the query to be executed
-- @return table: a cursor
function db.query(query)
	local res, err, errno, sqlstate = db.instance:query(query)
    if not res then
    	error(query)
        error("Bad result: ".. err ..": ".. (errno or '') .." "..(sqlstate or ''))
    end
    return res
end

-- Runs a query and get one single value
-- @param query string: the query to be executed
-- @return string | number: the result
function db.query_one(query)
	local res = db.query(query)
	local value
	if next(res) then
		for _,v in pairs(res[1]) do value = v end
	end
	return value
end

-- Truncates a table
-- @param table_name string: the name of the table to be truncated
function db.truncate(table_name)
	return db.query('truncate table ' .. table_name .. ';')
end

-- Escapes a string or a table (its values). Should be used before concatenating strings on a query.
-- @param q string or table: the string or table to be escaped
-- @return string or nil: if q is a string, returns the new escaped string. If q is a table
--							it simply returns, since it already escaped the table's values

function escape_string(s)
	-- Based on luajson code
	-- https://github.com/harningt/luajson/blob/master/lua/json/encode/strings.lua
	local matches = {
		['\\'] = '\\\\',    
		["\0"] = '\\0',
		["\n"] = '\\n',
		["\r"] = '\\r',
		["'"] = "\\'",
		['"'] = '\\"',
		["\x1a"] = '\\Z'
	}

	for i = 0, 255 do
		local c = string.char(i)
		if c:match('[%z\1-\031\128-\255]') and not matches[c] then
			matches[c] = ('\\x%.2X'):format(i)
		end
	end

	return s:gsub('[\\"/%z\1-\031\128-\255]', matches)
end

function db.escape(q)
	if type(q) == "string" then
		q = escape_string(q)
		return q
	elseif type(q) == "table" then
		for k,v in pairs(q) do
			q[k] = escape_string(v)
		end
		return
	end
	return q
end

-- Starts a transation
function db.begin_transaction()
	db.connect()
	db.query("START TRANSACTION;")
	db.transaction = true
end

-- Commits a transaction, everything went alright
function db.commit()
	db.query("COMMIT;")
	db.transaction = false
	db.close()
end

-- Rollback everything done during transaction
function db.rollback()
	db.query("ROLLBACK;")
	db.transaction = false
	db.close()
end

--- Runs a query and returns the id of the last inserted row. Used for saving
-- a model and obtaining the model id.
-- @param query string: the query to be executed
-- return number or string: the id of the last inserted row.
function db.query_insert(query)
	local res = db.query(query)
	return res.insert_id
end

return db

