package.path =  ((debug.getinfo(1).source):match('^@?(.-)/index.lua$') or '')..'../../src/?.lua;'..package.path

require "sailor"
local test = require "sailor.test"
local access = require "sailor.access"
local User = sailor.model('user')
local fixtures = require "tests.fixtures.user" or {}

describe("Testing #UserController", function()
  
  local users
  setup(function()
    users = test.load_fixtures('user')
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


end)