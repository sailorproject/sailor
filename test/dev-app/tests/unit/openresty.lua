--[[local remy = require "remy"
--remy.forced_mode = remy.MODE_NGINX
--local mysql = require "resty.mysql"
--local rest = 
local helper = require "tests.helper"
--local remy = require 'remy'
    fakengx = require 'fake.fakengx'
ngx = fakengx.new()
ngx.config = {}
ngx.config.ngx_lua_version = 10000
local old_tcp = ngx.socket.tcp
ngx.socket.tcp = function()
	local sock,err = old_tcp()
	sock.getreusedtimes = function()
		return 0
	end
	return sock,err
end


local db 
describe("Testing #openresty", function()
 
 setup(function()
 	remy.force_mode(remy.MODE_NGINX)

db = require "sailor.db"
db = db.detect()
  end)

  it("should do nothing", function()
    --print(tstring(remy,0,' ','\n'))
    print("mode:",remy.detect())
    assert.is_equal(1,1)
 
  end)

  it("should find 1 result",function()
		db.connect()
		local res = db.query("select * from post where id = 1")
		print(helper.tostring(res))
		db.close()
		assert.is_equal(1,#res)
	end)

teardown(function()
 
  end)
  --remy.forced_mode = nil
  --ngx = nil
end)
]]