local db = {}
local env,con
local conf = require("conf.conf").db
local luasql = require "luasql.mysql"

local function connect()
	env = assert (luasql.mysql())
	con = assert (env:connect(conf.dbname,conf.user,conf.pass,conf.host))
end

local function close()
	con:close()
	env:close()
end

function db.query(query)
	connect()
	con:execute(query)
	close()
end

return db