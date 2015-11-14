local db = require "sailor.db"
local helper = require "tests.helper"

describe("Testing db module", function()

	local fixtures = require "tests.fixtures.post"
	local count = #fixtures

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
		count = count + 1
		-- should be posts already inserted by the fixtures plus this one
		assert.is_equal(count,res)
	end)

	it("should find multiple results",function()
		db.connect()
		local res = db.query("select * from post limit 2")
		db.close()
		assert.is_equal(2,#res)
	end)

	it("should begin transaction and commit",function()
		db.begin_transaction()
		local res = db.query_insert("insert into post(author_id,body) values(2,'Transaction 1')")
		db.commit()
		count = count + 1
		assert.is_equal(count,res)

		db.connect()
		local res2 = db.query_one("select count(*) from post")
		db.close()

		assert.is_equal(count,tonumber(res2))
	end)

	it("should begin transaction and rollback",function()
		db.begin_transaction()
		local res = db.query_insert("insert into post(author_id,body) values(2,'Transaction 2')")
		db.rollback()
		count = count + 1
		assert.is_equal(count,res)

		db.connect()
		local res2 = db.query_one("select count(*) from post")
		db.close()
		count = count -1
		assert.is_equal(count,tonumber(res2))
	end)

	it("should see if a table exists",function()
		db.connect()
		local res = db.table_exists("category")
		local res2 = db.table_exists("asdasda")
		db.close()
		assert.is_true(res)
		assert.is_false(res2)
	end)

	it("should get columns and key of a table",function()
		db.connect()
		local columns,key = db.get_columns("category")
		db.close()

		local col_id,col_name = false

		for _,v in ipairs(columns) do
			if v == 'id' then col_id = true end
			if v == 'name' then col_name = true end
		end

		assert.same(2,#columns)
		assert.is_true(col_id)
		assert.is_true(col_name)
		assert.same('id',key)
	end)

	it("should not get columns ",function()
		db.connect()
		local columns,key = db.get_columns("asdas")
		db.close()
		assert.same(0,#columns)
		assert.same(nil,key)
	end)

end)