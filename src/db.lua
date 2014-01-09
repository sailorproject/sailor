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

return db