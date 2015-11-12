local model = require "sailor.model"
local helper = require "tests.helper"
local access = require "sailor.access"
local db = require "sailor.db"
local fixtures = require "tests.fixtures.user" or {}


describe("Testing #UserModel", function()
  --helper.blah()
  local User = model('user')
  local users = User:find_all()
  local u, count_before
  local db_spies = {}
  local db_spies_count = 0

  local function assert_db_close(n)
    n = n or 1
    db_spies_count = db_spies_count + n
    assert.spy(db_spies[1]).was_called(db_spies_count)
    assert.spy(db_spies[2]).was_called(db_spies_count)
  end

  setup(function()
    table.insert(db_spies, spy.on(db,'connect'))
    table.insert(db_spies, spy.on(db,'close'))
  end)

  it("should count objects", function()
    assert.is_equal(#users,User:count())
    assert_db_close()
  end)

  it("should create different objects", function()
    u = User:new(fixtures[1])
    u2 = User:new(fixtures[2])
    assert.is_equal(u.name,fixtures[1].name)
    assert.is_equal(u2.name,fixtures[2].name)
  end)

  it("should save object", function()
    local s = spy.on(User,'validate')
    local s2 = spy.on(User,'insert')
    count_before = User:count()
    u = User:new(fixtures[1])
    assert.is_true(u:save(false))
    assert.is_equal(User:count(),count_before+1)
    assert.spy(s).was_not_called()
    assert.spy(s2).was_called()
    assert_db_close(3)
  end)

  it("should update object", function()
    local s = spy.on(User,'update')
    u.username = users[2].username or nil
    assert.is_true(u:save(false))

    -- On update it is opening and closing db connection twice
    -- first for verifying if the entry exists
    -- maybe this should be revised
    assert_db_close(2)
    assert.spy(s).was_called()
  end)

  it("should delete object", function()
    u:delete()
    assert.is_equal(User:count(),count_before)
    assert_db_close(2)
  end)

  it("should find object by id", function()
    u = User:find_by_id(1)
    assert.are_same(u.id,users[1].id)
    assert_db_close()
  end)

  it("should find user relations", function()
    u = User:find_by_id(1)
    local post_fixtures = require "tests.fixtures.post" or {}
    local amount = 0
    for k, v in ipairs(post_fixtures) do
      if v.author_id == 1 then
        amount = amount + 1
        assert.is_equal(u.posts[amount].body,v.body)
      end
    end
    assert.is_equal(amount,#(u.posts))
    assert_db_close(2)
  end)

  it("should not find object by id", function()
    local u = User:find_by_id(42)
    assert.is_false(u)
    assert_db_close()
  end)

  it("should find object by attributes", function()
    local u = User:find_by_attributes({username = users[1].username})
    assert.are_same(u.id,users[1].id)
    assert_db_close()
  end)

  it("should not find object by attributes", function()
    local u = User:find_by_attributes({username = ''})
    assert.is_false(u)
    assert_db_close()
  end)

  it("should validate object", function()
    assert.is_true(users[1]:validate())
  end)

  it("should not validate object", function()
    assert.is_false(users[2]:validate())
  end)

  it("should find all objects", function()
    assert.is_equal(User:count(),#(User:find_all()))
    assert_db_close(2)
  end)

  it("should find some objects", function()
    assert.is_equal(2,#(User:find_all("password LIKE '12345%'")))
    assert_db_close()
  end)

  it("should find one object", function()
    u = User:find("password LIKE '12345%'")
    assert.is_equal(users[1].id,u.id)
    assert_db_close()
  end)
   
  it("should login", function()
    assert.is_true(User.authenticate(fixtures[1].username,fixtures[1].password,false))
    assert_db_close()
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

  it("should create objects but rollback", function()
    local Post = model('post')
    count_before = User:count()
    local count_post = Post:count()
    assert_db_close(2)

    db.begin_transaction()

      u = User:new(fixtures[1])
      assert.is_true(u:save(false))
      assert.is_equal(User:count(),count_before+1)
      
      local p = Post:new()
      p.author_id = u.id
      assert.is_true(p:save(false))
      assert.is_equal(Post:count(),count_post+1)

    db.rollback()
    assert_db_close()

    assert.is_equal(User:count(),count_before)
    assert.is_equal(Post:count(),count_post)
    assert_db_close(2)
  end)

  it("should create objects and commit", function()
    local Post = model('post')
    count_before = User:count()
    local count_post = Post:count()
    assert_db_close(2)

    db.begin_transaction()

      u = User:new(fixtures[1])
      assert.is_true(u:save(false))
      assert.is_equal(User:count(),count_before+1)
      
      local p = Post:new()
      p.author_id = u.id
      assert.is_true(p:save(false))
      assert.is_equal(Post:count(),count_post+1)

    db.commit()
    assert_db_close()

    assert.is_equal(User:count(),count_before+1)
    assert.is_equal(Post:count(),count_post+1)
    assert_db_close(2)
  end)

end)
