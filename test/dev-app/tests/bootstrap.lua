-- Test Bootstrap file
-- This file will run before running tests
sailor = require "sailor"
local t = require "sailor.test"

t.load_fixtures('user')
t.load_fixtures('post')
t.load_fixtures('category')

--t.load_fixtures()

