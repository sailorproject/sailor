--------------------------------------------------------------------------------
-- luasql_common.lua, v0.5.2: DB module for connecting and querying through LuaSQL
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local main_conf = require "conf.conf"
local conf = main_conf.db[main_conf.sailor.environment]
local luasql = require("luasql."..conf.driver)
local db = { transaction = false}
local utils = require "web_utils.utils"

-- Reads the cursor information after reading from db and returns a table
local function fetch_row(cur, res)
	res = res or {}
	local row = cur:fetch ({}, "a")

	if not row then
		cur:close()
		return res
	end

	local types = cur:getcoltypes()
	local names = cur:getcolnames()

	for k,t in pairs(types) do
		if t:find('number') or t:find('int') then
			row[names[k]] = tonumber(row[names[k]])
		end
	end

	table.insert(res,row)
	
	return fetch_row(cur,res)
end

-- Creates the connection of the instance
function db.connect()
	if db.transaction then return end
	db.env = assert (luasql[conf.driver]())
	db.con = assert (db.env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

-- Closes the connection of the instance
function db.close()
	if db.transaction then return end
	db.con:close()
	db.env:close()
end

-- Runs a query
-- @param query string: the query to be executed
-- @return table: the rows with the results
function db.query(query)
	local cur = assert(db.con:execute(query))
	if type(cur) == 'number' then
		return cur
	end
	return fetch_row(cur)
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
	local query
	if conf.driver == "postgres" then 
		query = 'truncate table ' .. table_name .. ' RESTART IDENTITY CASCADE;' 
	elseif conf.driver == "sqlite3" then
		query = 'delete from '.. table_name .. ';'
		db.query(query)
		query = "delete from sqlite_sequence where name='" .. table_name .. "';"
	else 
		query = 'truncate table ' .. table_name .. ';'
	end
	return db.query(query)
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
local function query_insert_postgres(query,key)
	key = key or 'id'
	
	query = query .. " RETURNING id; "
	local cur = assert(db.con:execute(query))

	if type(cur) == 'number' then
		return cur
	else
		local res = fetch_row(cur)
		if next(res) then
			return tonumber(res[1][key])
		end
	end
	return nil
end

local function query_insert_common(query,key)
	key = key or 'id'
	local id
	
	query  = query .. "; "
	assert(db.con:execute(query))
	id = db.con:getlastautoid()

	return id
end

function db.query_insert(query,key)
	if conf.driver == 'postgres' then
		return query_insert_postgres(query,key)
	end
	return query_insert_common(query,key)
end

-- Starts a transation
function db.begin_transaction()
	db.connect()
	local query = "START TRANSACTION;"
	if conf.driver == 'sqlite3' then
		query = "BEGIN TRANSACTION;"
	end
	db.query(query)
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

-- Checks if a table exists
-- @param table_name string: the name of the table
-- @return boolean
function db.table_exists(table_name)
	table_name = db.escape(table_name)
	local query
 	if conf.driver == 'postgres' then 
 		query = "SELECT relname FROM pg_class WHERE relname = '"..table_name.."';" 	
	elseif conf.driver == 'sqlite3' then
    	query = "SELECT name FROM sqlite_master WHERE type='table' AND name='"..table_name.."';"
 	else
    	query = "SHOW TABLES LIKE '"..table_name.."';"
	end
	local res = db.query_one(query)
	return res == table_name
end

-- Gets columns
-- @param table_name string: the name of the table
-- @return table{strings}, string (primary key column name)
local function get_columns_pg(table_name)
	local columns = {}
	local key
	local query_col = "SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '"..table_name.."';"
	local query_key = "SELECT column_name FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE table_name = '"..table_name.."';"

	for _,v in ipairs(db.query(query_col)) do
		columns[#columns+1] = v.column_name
	end
	key = db.query_one(query_key)
	return columns,key
end


local function get_columns_sqlite3(table_name)
	local columns = {}
	local key
	local query = [[SELECT sql FROM sqlite_master WHERE type='table' AND name = ']]..table_name..[[';]]
	local res = db.query_one(query)
	local res = res:match("%((.*)%)")
	local s = utils.split(res,',')
	for _,s2 in pairs(s) do
		local words = utils.split(s2,' ')
		columns[#columns+1] = (words[1]:gsub("^%s*(.-)%s*$", "%1")) --trim
		for i,w in ipairs(words) do
			if w == 'primary' and words[i+1] == 'key' then
				key = (words[1]:gsub("^%s*(.-)%s*$", "%1")) --trim
			end
		end
	end
	return columns,key
end

function db.get_columns(table_name)
	local columns = {}
	local key = nil

	if not db.table_exists(table_name) then 
		return columns, key 
	end
	table_name = db.escape(table_name)

 	if conf.driver == 'postgres' then 
 		return get_columns_pg(table_name)

	elseif conf.driver == 'sqlite3' then
		return get_columns_sqlite3(table_name)
 	end

	local query = "SELECT column_name, column_key FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '"..table_name.."';"
	
	local res = db.query(query)
	
	for _,v in ipairs(res) do
		if v.column_key == 'PRI' then key = v.column_name end
		columns[#columns+1] = v.column_name
	end
	
	
	return columns, key
end

return db
