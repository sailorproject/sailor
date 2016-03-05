## Testing

Sailor comes integrated with [Busted](http://olivinelabs.com/busted/) to provide for unit and functional testing of your applications.

Under your application folder you should find a /tests directory with the following structure:

  * `/fixtures` - A place for your fixtures
  * `/functional` - A place for your functional tests
  * `/unit` - A place for your unit tests
  * `bootstrap.lua` - A lua script that will run before running your tests
  * `helper.lua` - A lua script containing a module with functions you would like to share between tests

### Fixtures
Fixture is a fixed state with sample data that will be used to populate the database before running tests. 
In Sailor you can define a fixture by placing a Lua file under your fixtures directory. This file must have the same name as your model file return a table containing the sample data. Then, this fixture must be loaded before the tests run. `Warning`: loading fixtures will truncate the table so then it contains only the sample data. Make sure you have configured a separate entry on db configuration for testing and that you changed your environment to this new entry. Unlike regular Sailor objects, fixtures are not validated before being saved into the database because they are for testing and you might want to test invalid data.


    -- /conf/conf.lua
    local conf = {
        sailor = {
    ...
    		environment = "test", -- this will use db configuration named test
        },
    
        db = {
    	    test = { -- current environment
    			driver = 
    			...
    	    }
    	}
    	...
    }


#####Example
Let's suppose we have a User model and we want to unit test some of the User methods and for that we will need some sample users. 

    -- /tests/fixtures/user.lua
    
    return {
    	{
    		username = 'joao',
    		password = '123456'
    	},
    	
    	{
    		username = 'maria',
    		password = '1234'
    	}
    }

The fixture is a regular Lua script that will be required. This for multiple possibilities, such as making loops for inserting many entries, as long as in the end you return a table containing samples of your model.

After creating your fixture, you must add this on the bottom of your bootstrap file so they are loaded before running your tests.

    --/tests/bootstrap.lua
    ...
    local t = require "sailor.test"
    t.load_fixtures('user')


### Unit testing
Your unit tests are Lua scripts that go in `/tests/unit/`. These scripts must follow the format specified by Busted. A basic flow includes calling a `describe` function passing a description and a callback function that calls one or more `it` functions tests, also with a description and a callback containing specific tests and assertions. For more features and details of what you can do here, please check [Busted's documentation](http://olivinelabs.com/busted/).

#### Example
Let's test a portion of our User model, for example, and if objects are being created just fine. We start by creating a file under `/tests/unit`. This file does not have to be named in a particular way, but `user_test.lua` sounds reasonable.  Remember that if you defined some shared code on /tests/helper.lua to be used among various tests, it needs to be required here using `local helper = require "tests.helper"`


    -- /tests/unit/user_test.lua 
    describe("Testing User model", function()
    	local User = sailor.model('user')
    	local fixtures = require "tests.fixtures.user"     
    
    	it("should create a new user", function()
    		local count_before = User:count() -- Counting current users
        	local u = User:new(fixtures[1])   -- Creating one more user with one of the fixtures
        	assert.is_true(u:save(false))     -- Asserting that it saves
        	assert.is_equal(User:count(),count_before+1)  -- Asserting that the count increases by one
      	end)
      	-- ... more tests
    end)

### Functional testing
You can make functional tests to test your controllers, for example. Sailor test module provides a function that will mockup internal requests on your app. These scripts must follow the format specified by Busted. A basic flow includes calling a `describe` function passing a description and a callback function that calls one or more `it` functions tests, also with a description and a callback containing specific tests and assertions. For more features and details of what you can do here, please check [Busted's documentation](http://olivinelabs.com/busted/).

##### local res = test.request(path, data, additional_headers)

  * path: string. The path you want to make a request to, such as a controller or controller/action. Example: 'user/view'
  * data: table. A table containing some data you want to send to the request, such as get or post. Example: {get = {id = 1}}
  * additional_headers: A table containing additional headers you may want to send. Example: {ACCEPT = 'application/json'}

This function will return a table with the following fields:

  * res.status: number. The status of the response.
  * res.body: string. The body of the response.
  * res.headers: table. Any headers out that were set.
  * res:redirected(path): function. A function that receives an internal Sailor app path and sees if the request was redirected there.

If you have a form built with Sailor's form module and want to send an object in form-data through post, the form module also offers a handy function called form.ify

##### form.ify(object)

#### Example
Suppose we have a controller with actions to create, read, update and delete our users, for example, and we want to see if things work fine. We start by creating a file under `/tests/functional`. This file does not have to be named in a particular way, but `user_controller_test.lua` sounds reasonable.  Remember that if you defined some shared code on /tests/helper.lua to be used among various tests, it needs to be required here using `local helper = require "tests.helper"`

    -- /tests/functional/user_controller_test.lua 
    describe("Testing User Controller", function()
        local User = sailor.model('user')
        local test = require "sailor.test"
        local form = require "sailor.form"
        local fixtures = require "tests.fixtures.user"
    
        it("should open index", function()
    	    local res = test.request('user/index')  -- Getting the response a mock request to the index of the controller
    	    assert.same(200,res.status)       -- Asserting that the status of the response is ok
    	    assert.truthy(res.body:match('View all'))  -- Asserting that the page contains a string 'View all'
    	end)
    
        it("should create a new user", function()
          	local count_before = User:count()    -- Counting current users
            local res = test.request('user/create', {post = form.ify(fixtures[1])}) -- Posting some user to the 'user/create' page of your app
            assert.same(Category:count(), count_before + 1)   -- Asserting that the number of users increased by 1
            assert.is_true(res:redirected('user/index'))  -- Asserting that the page redirected you to the index
        end)
    end)


### Running your tests
To run your tests all you need to do is to go to your app's directory and type `sailor test` or `sailor t` on command line. You can also pass some flags that are accepted by [Busted](http://olivinelabs.com/busted/).

#### Example

    cd my_app
    sailor test --verbose

You should receive an output like this:

    ●●●●●●●●●●●●●●●●●●●●●●●●
    24 successes / 0 failures / 0 errors / 0 pending : 0.04076 seconds
