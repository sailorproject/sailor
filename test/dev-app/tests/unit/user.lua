local helper = require "tests.helper"

describe("Testing #UserModel", function()
  --helper.blah()
  local User = sailor.model('user')
  local fixtures = require "tests.fixtures.user" or {}
  local users = User:find_all()
  local u, count_before

  setup(function()
 
  end)

  it("should create object", function()
    
    local s = spy.on(User,'validate')
    local s2 = spy.on(User,'insert')
    count_before = User:count()
    u = User:new(fixtures[1] or nil)
    assert.is_true(u:save(false))
    assert.is_equal(User:count(),count_before+1)
    assert.spy(s).was_not_called()
    assert.spy(s2).was_called()
  end)

  it("should update object", function()
    local s = spy.on(User,'update')
    u.username = users[2].username or nil
    assert.is_true(u:save(false))
    assert.spy(s).was_called()
  end)

  it("should delete object", function()
    u:delete()
    assert.is_equal(User:count(),count_before)
  end)

  it("should find object by id", function()
    local u = User:find_by_id(1)
    assert.are_same(u.id,users[1].id)
  end)

  it("should not find object by id", function()
    local u = User:find_by_id(42)
    assert.is_false(u)
  end)

  it("should find object by attributes", function()
    local u = User:find_by_attributes({username = users[1].username})
    assert.are_same(u.id,users[1].id)
  end)

  it("should not find object by attributes", function()
    local u = User:find_by_attributes({username = ''})
    assert.is_false(u)
  end)

  it("should validate object", function()
    assert.is_true(users[1]:validate())
  end)

  it("should not validate object", function()
    assert.is_false(users[2]:validate())
  end)

  it("should find all objects", function()
    assert.is_equal(User:count(),#(User:find_all()))
  end)

end)