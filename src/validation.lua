-- Chain validation module
-- Example 1:
--	validation:new().type("string").len(3,5)("test string!") -- false
-- Example 2:
--	local reusable_validation = validation:new().type("string").len(3,5)
--	reusable_validation("test string!") -- false
--	reusable_validation("test!") -- true

local validation = {}

-- CORE
-- Caution, this is confusing

-- creates a new validation object, useful for reusable stuff and creating many validation tests at a time
function validation:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	-- __index will be called always when chaining validation functions
	self.__index = function(t,k)
					--saves a function named _<index> with its args in a funcs table, to be used later when validating
					return function(...) 
						local args = {...}
						local f = function(value) return validation['_'..k](value,unpack(args)) end
						table.insert(t.funcs,f)
						return t 
					end 
				end

	-- __call will run only when the value is validated
	self.__call = function(t,value)
					local res = true
					local fres, err
					-- iterates through all chained validations funcs that were packed, passing the value to be validated
					for i,f in ipairs(t.funcs) do
						fres,err = f(value)
						res = res and fres
						-- breaks the chain if a test fails
						if err then
							break
						end
					end
					-- boolean, error message or nil
					return res,err
				end
	obj.funcs = {}
	return obj
end
--

-- VALIDATION FUNCS
-- Add new funcs at will, they all should have the value to be validated as first parameter 
--   and their names must be preceded by '_'.
-- For example, if you want to use .custom_val(42) on your validation chain, you need to create a 
--   function validation._custom_val(<value var>,<other var>). Just remember the value var will be known
--   at the end of the chain and the other var, in this case, will receive '42'. You can add multiple other vars.
-- These functions can be called directly (validation._len("test",2,5))in a non-chained and isolated way of life 
--   for quick stuff, but chaining is much cooler!
-- Return false,'<error message>' if the value fails the test and simply true if it succeeds.

-- aux funcs
local function empty(v)
	return not v or string.len(v) == 0
end
--

-- String
function validation._empty(value)
	if not empty(value) then return false,"not empty" end
	return true
end

function validation._not_empty(value)
	if empty(value) then return false,"empty" end
	return true
end

function validation._len(value,min,max)
	local len = string.len(value or '')
	if len < min or len >max then return false,"should have "..min.."-"..max.." characters" end
	return true
end
--

-- Abstract
function validation._type(value,value_type)
	if type(value) ~= value_type then return false,"must be a "..value_type end
	return true
end
--

--
return validation
