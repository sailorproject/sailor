local db = require "sailor.db"

describe("Testing LuaSQL db module", function()

	local fixtures = require "tests.fixtures.post"

	it("should find 1 result",function()
		db.connect()
		local res = db.query("select * from post where id = 1")
		db.close()
		assert.is_equal(1,#res)
	end)

	it("should insert and give me the id",function()
		db.connect()
		local res = db.query_insert("insert into post(author_id,body) values(2,'Hello darkness my old friend')")
		db.close()
		-- should be posts already inserted by the fixtures plus this one
		assert.is_equal(#fixtures+1,res)
	end)

	it("should find multiple results",function()
		db.connect()
		local res = db.query("select * from post limit 2")
		db.close()
		assert.is_equal(2,#res)
	end)

end)
