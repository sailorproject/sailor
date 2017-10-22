sailor = require "sailor"
local t = require "sailor.test"
local busted = require 'busted.runner'
local lfs = require 'lfs'

-- load fixtures
-- t.load_fixtures()

-- prepare busted
busted()

local busted_lib = {
	describe = describe,
	it = it,
	setup = setup,
	assert = assert,
	teardown = teardown,
	before_each = before_each,
	finally = finally,
	pending = pending,
	spy = spy,
	stub = stub,
	mock = mock,
}

local test_dirs = {
	"tests/unit",
	"tests/functional",
}

-- Get busted vars to pass them ahead when loading each test file

local env = {}
for k,v in pairs(_G) do env[k] = v end
for name,f in pairs(busted_lib) do 
	env[name] = f
end

-- Looping through test dirs and loading them with environment with busted vars

for _,dir in pairs(test_dirs) do
	dir = sailor.path..'/'..dir
	for file in lfs.dir(dir) do
		if file ~= '.' and file ~= '..' then
	    	local t 
	    	if _VERSION == "Lua 5.1" then
	    		t = assert(loadfile(dir..'/'..file))
		        setfenv(t,env)
		    else
		        t = assert(loadfile(dir..'/'..file, env))
		    end
			t()
	    end
	end
end

