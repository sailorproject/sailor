local db = {}
local env,con
local conf = require("conf.conf").db
local luasql = require "luasql.mysql"

function db.connect()
	env = assert (luasql[conf.driver]())
	con = assert (env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

function db.close()
	con:close()
	env:close()
end

function db.query(query)
	local cur = assert(con:execute(query))
	return cur
end

function db.escape(q)
	if type(q) == "string" then
		q = con:escape(q)
		return q
	elseif type(q) == "table" then
		for k,v in pairs(q) do 
			q[k] = con:escape(v)
		end
		return 
	end
	return q
end

function db.query_query(q1,q2)
	local res
	local rows = assert(con:execute(q1))
	if rows == 0 then
		res = 0
	else
		res = assert(con:execute(q2))
	end
	return res
end

function db.query_insert(query)
	assert(con:execute(query))
	local id = con:getlastautoid()
	return id
end

return db