local db = {}
local env,con
local conf = require("conf.conf").db
local luasql = require "luasql.mysql"

local function connect()
	env = assert (luasql[conf.driver]())
	con = assert (env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

local function close()
	con:close()
	env:close()
end

function db.query(query)
	connect()
	local cur = assert(con:execute(query))
	close()
	return cur
end

function db.query_query(q1,q2)
	connect()
	local res
	local rows = assert(con:execute(q1))
	if rows == 0 then
		res = 0
	else
		res = assert(con:execute(q2))
	end
	close()
	return res
end

function db.query_insert(query)
	connect()
	assert(con:execute(query))
	local id = con:getlastautoid()
	close()
	return id
end

return db