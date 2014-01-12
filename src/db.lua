local db = {env,con}
local conf = require("conf.conf").db
local luasql = require "luasql.mysql"

function db:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	self.__index = self
	return obj
end

function db:connect()
	self.env = assert (luasql[conf.driver]())
	self.con = assert (self.env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

function db:close()
	self.con:close()
	self.env:close()
end

function db:query(query)
	local cur = assert(self.con:execute(query))
	return cur
end

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

function db:query_query(q1,q2)
	local res
	local rows = assert(self.con:execute(q1))
	if rows == 0 then
		res = 0
	else
		res = assert(self.con:execute(q2))
	end
	return res
end

function db:query_insert(query)
	assert(self.con:execute(query))
	local id = self.con:getlastautoid()
	return id
end

return db
