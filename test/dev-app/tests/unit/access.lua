local test = require "sailor.test"
local access = require "sailor.access"
local User = require "sailor.model"('user')
local fixtures = require "tests.fixtures.user" or {}

describe("Testing #UserController", function()

  it("should know no one has logged in", function()
    assert.is_true(access.is_guest())
  end)

  it("should not login with wrong pass", function()
    assert.is_false(User.authenticate(fixtures[1].username,"dummy",true))
  end)

  it("should not login with wrong username", function()
    assert.is_false(User.authenticate("meh",fixtures[1].password,false))
  end)

  it("should not login with default settings", function()
    assert.is_false(access.login('admin','demo'))
  end)

  it("should login", function()
    assert.is_true(User.authenticate(fixtures[1].username,fixtures[1].password,false))
  end)

  it("should know the user is logged in", function()
    assert.is_false(access.is_guest())
  end)

  it("should logout", function()
    assert.is_true(User.logout())
  end)

  it("should know the user is logged out", function()
    assert.is_true(access.is_guest())
  end)

  it("should login with encrypted pass", function()
    local u = User:new()
    u.username = 'Hermione'
    local raw_pass = 'freeelf54'
    u.password = access.hash(u.username,raw_pass)
    u:save(false)
    assert.is_true(User.authenticate(u.username,raw_pass,true))
    assert.is_false(access.is_guest())
    User.logout()
    u:delete()
  end)

  it("should with default settings", function()
    access.settings({model = false, hashing = false, default_login = 'admin', default_password = 'demo'})
    assert.is_true(access.login('admin','demo'))
    assert.is_false(access.is_guest())
    assert.is_true(User.logout())
    assert.is_true(access.is_guest())

  end)

  it("should not login with default settings", function()
    assert.is_false(access.login('admin','demon'))
    assert.is_true(access.is_guest())
  end)
  
end)
