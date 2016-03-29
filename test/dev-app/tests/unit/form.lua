local form = require "sailor.form"
local model = require "sailor.model"
local User = model("user")

describe("Testing form generator", function()
	local u = User:new()

	it("should not create fields that don't exist", function ()
    	assert.has_error(
    		function() local html = form.blah(u,'password') end, 
    		"attempt to call field 'blah' (a nil value)"
    	)
	end)

	it("should create a generic field accordingly", function()
		local html = form.text(u,'password')
		assert.equal('<input type="text" name="user:password" id="user:password" />',html)
	end)

	it("should create textarea field accordingly", function()
		local html = form.textarea(u,'password')
		assert.equal(html,'<textarea name="user:password" id="user:password" > asadas </textarea>')
	end)

	it("should create a dropdown list accordingly", function()
		local html = form.dropdown(u,'password',{'a','b'},'Select...')
		assert.equal(html,'<select name="user:password" id="user:password" > <option value="" selected>Select...</option> <option value="1">a</option> <option value="2">b</option> </select>')
	end)

	it("should create a radio list accordingly", function()
		local html = form.radio_list(u,'password',{'a','b'},1,'vertical')
		assert.equal(html,'<input type="radio" value="1" checked /> a <br/><input type="radio" value="2" /> b')
	end)

	it("should create a checkbox accordingly", function()
		local html = form.checkbox(u,'password',nil, true)
		assert.equal(html,'<input type="checkbox" name="user:password" id="user:password" checked /> password')
	end)

end)