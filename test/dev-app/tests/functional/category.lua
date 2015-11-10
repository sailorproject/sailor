local form = require "sailor.form"('category')
local test = require "sailor.test"
local helper = require "tests.helper"

describe("Testing #CategoryController", function()
  local Category = sailor.model('category')
  local fixtures = require "tests.fixtures.category"

  setup(function()
 	test.load_fixtures('category')
  end)

  it("should open index", function()
    local res = test.request('category')
    assert.same(200,res.status)
    assert.truthy(res.body:match('View all'))
  end)

  it("should create new category", function()
  	local count_before = Category:count()
    local res = test.request('category/create', {post = form.ify(fixtures[1])})
    assert.same(Category:count(), count_before + 1)
    assert.is_true(res:redirected('category/index'))
  end)

  it("should update category", function()
    local res = test.request('category/update', {get = {id = 1}, post = form.ify(fixtures[2])})
    assert.same(fixtures[2].name, Category:find_by_id(1).name)
    assert.is_true(res:redirected('category/index'))
  end)

  it("should get category", function()
    local res = test.request('category/view', {get = {id = 2}})
    assert.same(200,res.status)
    assert.truthy(res.body:match(fixtures[2].name))
  end)

  it("should delete category", function()
  	local count_before = Category:count()
    --print(helper.tostring(count_before,0,' ','\n'))

    local res = test.request('category/delete', {get = {id = 1}})
    assert.same(count_before - 1, Category:count())
    assert.falsy(Category:find_by_id(1))
    assert.is_true(res:redirected('category/index'))
  end)

end)