local test = require "sailor.test"
local lfs = require "lfs"
local conf = require "conf.conf"
local model = require "sailor.model"


local db = require "sailor.db"
local helper = require "tests.helper"



describe("Testing #Autogen", function()

  it("should not open autogen page", function()
    
 	  conf.sailor.enable_autogen = false
    local res = test.request('autogen')
    assert.truthy(res.body:match('Error'))
  end)

  it("should open autogen page", function()
  	conf.sailor.enable_autogen = true
    local res = test.request('autogen')
    assert.same(200,res.status)
    assert.truthy(res.body:match('Generate CRUD'))
  end)

  it("should not generate model", function()
    local res = test.request('autogen',{post={table_name ='asdasd'}})
    assert.falsy(res.body:match('Model generated with success'))
  end)

  it("should generate model", function()
  	local path = 'models/category.lua'
  	os.remove(path)
    local res = test.request('autogen',{post={table_name ='category'}})
    assert.truthy(res.body:match('Model generated with success'))
    assert.truthy(lfs.attributes(path))
  end)

  it("should not generate CRUD", function()
    local res = test.request('autogen',{post={model_name ='asdasd'}})
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

    local res = test.request('autogen',{post={model_name ='category'}})
    assert.truthy(res.body:match('CRUD generated with success'))
    for _,f in ipairs(paths) do
  		 assert.truthy(lfs.attributes(f))
  	end
  end)

end)