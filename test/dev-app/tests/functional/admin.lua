local access = require "sailor.access"
local conf = require "conf.conf"
local test = require "sailor.test"
local lfs = require "lfs"

describe("Testing Admin", function ()

	it("Admin Page should not open", function()
 	conf.sailor.enable_admin = false
    local res = test.request('admin')
    assert.truthy(res.body:match('Enable Admin first in the config file'))
  end)

  -- it("Admin page should open", function()
  --   conf.sailor.enable_admin = true
  --   conf.sailor.admin_password = "test"
  --   local res = test.request('admin/index',{post={password = "test"}})
  --   assert.same(200,res.status)
  --   assert.truthy(res.body:match('Login to Admin Center'))
  --   assert.is_true(res:redirected('admin/dashboard'))
  --   assert.truthy(res.body:match('Generate CRUD'))
  --   assert.truthy(res.body:match('Config Editor'))
  -- end)

  it("should not generate model", function()
    local res = test.request('admin/dashboard',{post={table_name ='asdasd'}})
    assert.falsy(res.body:match('Model generated with success'))
  end)

  it("should generate model", function()
    local path = 'models/category.lua'
    os.remove(path)
    local res = test.request('admin/dashboard',{post={table_name ='category'}})
    assert.truthy(res.body:match('Model generated with success'))
    assert.truthy(lfs.attributes(path))
  end)

  it("should not generate CRUD", function()
    local res = test.request('admin/dashboard',{post={model_name ='asdasd'}})
    assert.falsy(res.body:match('CRUD generated with success'))
  end)

  it("should generate CRUD", function()
    local paths = {
      'controllers/category.lua',
      'views/category/create.lp',
      'views/category/index.lp',
      'views/category/update.lp',
      'views/category/view.lp'
    }
    for _,f in ipairs(paths) do
      os.remove(f)
    end

    local res = test.request('admin/dashboard',{post={model_name ='category'}})
    assert.truthy(res.body:match('CRUD generated with success'))
    for _,f in ipairs(paths) do
       assert.truthy(lfs.attributes(f))
    end
  end)
	

end)


