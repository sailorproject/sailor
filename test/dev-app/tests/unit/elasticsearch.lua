local es_model = require ('sailor.db.es_model')
local fixtures = require "tests.fixtures.user" or {}

describe("Testing Elasticsearch Models", function()
	local user = es_model.new("test")
	user.name = "Test User"
	user.email = "test@test.com"
	user.save{id = 1}
	user.save{id = 3, body = {doc = { name = "new test2"}}}
	local count_before 


	it("Should create different objects", function()
		local u1 = es_model.new("test")
		u1.name = fixtures[1].username
		u1.save{id = "a"}
		local u2 = es_model.new("test")
		u2.name = fixtures[2].username
		u2.save{id = "b"}
		assert.is_equal(u1.get{id = "a"}._source.name, fixtures[1].username)
		assert.is_equal(u2.get{id = "b"}._source.name, fixtures[2].username)
		
	end)

	it("Should count objects", function()
		assert.is_equal(#user.getAll(), user.getCount())
	end)

	it("Should not assign attributes that don't defined in the model file", function()
		assert.has_error(function() user.blahblah = "hey" end, "blahblah is not a valid attribute for this model.")
	end)

	it("should not access attributes that don't exist", function()
		assert.falsy(user.blahblah)
	end)

	it("should save object", function()
		user.delete{id = 2}
		-- Give some time for it to index
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		count_before = user.getCount()
		local doc = {test = "random"}
		local _,code = user.save{id = 2 , body = doc}
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		assert.is_equal(code, 201)
		assert.is_equal(user.getCount(), count_before + 1)
	end)

	it("should update object", function()
		local _,code = user.update{id = 1, body = {doc = {name = "New name"}}}
		assert.is_equal(code, 200)
		assert.is_equal(user.get{id =1}._source.name, "New name")
	end)

	it("should delete object", function()
		count_before = user.getCount()
		local _,code = user.delete{id = "a"}
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		assert.is_equal(code, 200)
		assert.is_equal(user.getCount(), count_before - 1)

	end)

	it("should find by id", function()
		local data, err = user.get{id = "b"}
		assert.is_equal(data._source.name, fixtures[2].username)
	end)

	it("should not find by id", function()
		local data,err = user.get{id = "randomid"}
		local value
		if data == nil then value = false end
		assert.is_false(value)
	end)

	it("should find all objects", function()
		assert.is_equal(user.getCount(), #user.getAll())

	end)

	it("should find some objects", function()
		local count = user.search{q = "name"}.hits.total
		assert.is_equal(1, count)
	end)

	it("should find one object", function()
		local count = user.search{q = "test:random"}.hits.total
		assert.is_equal(1, count)
	end)

	it("shold create objects and then rollback", function()
		local data, status = user.save{id = 4, body = {doc = { name = "new test4"}}}
		assert.truthy(data)
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		assert.is_equal(5, user.getCount())
		user.delete{id = 4}
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		data, status = user.get{id = 4}
		assert.falsy(data)
		local ntime = os.time() + 1
		repeat until os.time() > ntime
		assert.is_equal(4, user.getCount())
	end)

	it("should bulk index", function()
		local data, status = user.bulkIndex{
						  		body = {
								    -- First action
								    {
								      index = {
								        ["_index"] = "my_index1",
								        ["_type"] = "my_type1"
								      }
								    },
								    -- First body
								    {
								      my_key1 = "my_value1",
								    },
								    -- Second action
								    {
								      index = {
								        ["_index"] = "my_index2",
								        ["_type"] = "my_type2"
								      }
								    },
								    -- Second body
								    {
								      my_key2 = "my_value2",
							    	}
						  		}		
							}

		assert.is_equal(status, 200)
	end)

	it("should get multiple documents at once", function()
		local data, status = user.mget{
			body = {
				docs = {
			    -- First document
			      {
			    	["_index"] = "my_index1",
			        ["_type"] = "my_type1",
			        ["_id"] = "my_id1"
			      },
			    -- Second document
			      {
			        ["_index"] = "my_index2",
			        ["_type"] = "my_type2",
			        ["_id"] = "my_id2"
			      }
			    }
			}
		}

		assert.is_equal(status, 200)

	end)
end)