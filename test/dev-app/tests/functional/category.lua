--[-[
local model = require "sailor.model"
local form = require "sailor.form"('category')
local test = require "sailor.test"
local helper = require "tests.helper"

describe("Testing #CategoryController", function()
  local Category = model('category')
  local fixtures = require "tests.fixtures.category"

  setup(function()
 	test.load_fixtures('category')
  end)

  it("should open index", function()
    local res = test.request('category')
    assert.same(200,res.status)
    assert.truthy(res.body:match('View all'))
  end)

  it("should open create page", function()
    local res = test.request('category/create')
    assert.same(200,res.status)
    assert.truthy(res.body:match('Create category'))
  end)

  it("should create new category", function()
  	local count_before = Category:count()
    local res = test.request('category/create', {post = form.ify(fixtures[1])})
    assert.same(Category:count(), count_before + 1)
    assert.is_true(res:redirected('category/index'))
  end)

  it("should open update page with a category", function()
    local res = test.request('category/update', {get = {id = 1}})
    assert.same(200,res.status)
    assert.truthy(res.body:match('Update category'))
  end)

  it("should not open update page without a category", function()
    local res = test.request('category/update')
    assert.truthy(res.body:match('Error'))
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

  it("should not get category if id not found", function()
    local res = test.request('category/view', {get = {id = 42}})
    assert.same(200,res.status)
    assert.truthy(res.body:match('Error'))
  end)
  it("should not get category without id", function()
    local res = test.request('category/view')
    assert.same(200,res.status)
    assert.truthy(res.body:match('Error'))
  end)

  it("should delete category", function()
    local count_before = Category:count()
    local res = test.request('category/delete', {get = {id = 1}})
    assert.same(count_before - 1, Category:count())
    assert.falsy(Category:find_by_id(1))
    assert.is_true(res:redirected('category/index'))
  end)

  it("should not delete category without id", function()
    local count_before = Category:count()
    local res = test.request('category/delete')
    assert.same(count_before, Category:count())
    assert.truthy(res.body:match('Error'))
  end)

  it("should not delete category if id not found", function()
    local count_before = Category:count()
    local res = test.request('category/delete',{get={id=42}})
    assert.same(count_before, Category:count())
    assert.truthy(res.body:match('Error'))
  end)

end)
--]]