local access = require "sailor.access"
local conf = require "conf.conf"
local test = require "sailor.test"


describe("Testing Admin", function ()

	it("Admin Page should not open", function()
 	conf.sailor.enable_admin = false
    local res = test.request('admin')
    assert.truthy(res.body:match('Error'))
  end)

	it("Admin page should open", function()
  	conf.sailor.enable_admin = true
    local res = test.request('admin')
    assert.same(200,res.status)
    assert.truthy(res.body:match('Admin Center'))
  end)

	it("Should Not login to admin", function()
  	conf.sailor.enable_admin = true
    local res = test.request('admin',{post={password = "randomtstaa"}})
    assert.falsy(res.body:match('Login Success.'))
  end)

	it("Should Not login to admin", function()
  	conf.sailor.enable_admin = true
  	conf.sailor.admin_password = "test"
    local res = test.request('admin',{post={password = "test"}})
    assert.falsy(res.body:match('Login Success.'))
  end)







end)


