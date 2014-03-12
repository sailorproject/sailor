-- Valua 0.2
-- Copyright (c) 2014 Etiene Dalcol
-- License: MIT
--
-- Originally bundled with Sailor MVC Web Framework, now released as a separated module.
-- http://sailorproject.org
--
-- This module provides tools for validating values, very useful in forms, but also usable elsewhere.
-- It works in appended chains. Create a new validation object and start chaining your test functions.
-- If your value fails a test, it breaks the chain and does not evaluate the rest of it.
-- It returns a boolean and an error string (nil when tests succeeded)
--
-- Example 1 - Just create, chain and use:
--	valua:new().type("string").len(3,5)("test string!") -- false, "should have 3-5 characters"
--
-- Example 2 - Create, chain and later use it multiple times:
--	local reusable_validation = valua:new().type("string").len(3,5)
--	reusable_validation("test string!") -- false, "should have 3-5 characters"
--	reusable_validation("test!") -- true
--

local valua = {}

local tinsert,setmetatable,len,match,tonumber = table.insert,setmetatable,string.len,string.match,tonumber
local next,type,floor,ipairs = next,type,math.floor, ipairs

-- CORE
-- Caution, this is confusing

-- creates a new validation object, useful for reusable stuff and creating many validation tests at a time
function valua:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	-- __index will be called always when chaining validation functions
	self.__index = function(t,k)
		--saves a function named _<index> with its args in a funcs table, to be used later when validating
		return function(...) 
			local args = {...}
			local n = select("#", ...)
			local f = function(value) return valua['_'..k](value, unpack(args, 1, n)) end
			tinsert(t.funcs,f)
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
--   function valua._custom_val(<value var>,<other var>). Just remember the value var will be known
--   at the end of the chain and the other var, in this case, will receive '42'. You can add multiple other vars.
-- These functions can be called directly (valua._len("test",2,5))in a non-chained and isolated way of life 
--   for quick stuff, but chaining is much cooler!
-- Return false,'<error message>' if the value fails the test and simply true if it succeeds.

-- aux funcs
local function empty(v)
	return not v or (type(v)=='string' and len(v) == 0) or (type(v)=='table' and not next(v))
end
--

-- String
function valua._len(value,min,max)
	local len = len(value or '')
	if len < min or len >max then return false,"should have "..min.."-"..max.." characters" end
	return true
end

function valua._compare(value,another_value)
	if value ~= another_value then return false, "values are not equal" end
	return true
end

function valua._email(value)
	if not value:match("[A-Za-z0-9%.%%%+%-]+@[A-Za-z0-9%.%%%+%-]+%.%w%w+") then
  		return false, "is not a valid email address" 
  	end
  	return true
end

function valua._match(value,pattern)
	if not value:match(pattern) then return false, "does not match pattern" end
	return true
end

function valua._alnum(value)
	if value:match("%W") then return false, "constains improper characters" end
	return true
end

function valua._contains(value,substr)
	if not value:find(substr) then return false, "does not contain '"..substr.."'" end
	return true
end

function valua._no_white(value)
	if value:find("%s") then return false, "must not contain white spaces" end
	return true
end
--

-- Numbers
function valua._min(value,n)
	if value < n then return false,"must be greater than "..n end
	return true
end

function valua._max(value,n)
	if value > n then return false,"must not be greater than "..n end
	return true
end

function valua._integer(value)
	if floor(value) ~= value then return false, "must be an integer" end
	return true
end
--

-- Date

--  Check for a UK date pattern dd/mm/yyyy , dd-mm-yyyy, dd.mm.yyyy
--  or US pattern mm/dd/yyyy, mm-dd-yyyy, mm.dd.yyyy
--  or ISO pattern yyyy/mm/dd, yyyy-mm-dd, yyyy.mm.dd 
--  Default is UK
function valua._date(value,format)
    local valid = true
    if (match(value, "^%d+%p%d+%p%d%d%d%d$")) then
        local d, m, y
        if format and format:lower() == 'us' then
        	m, d, y = match(value, "(%d+)%p(%d+)%p(%d+)")
        elseif format and format:lower() == 'iso' then
        	y, m, d = match(value, "(%d+)%p(%d+)%p(%d+)")
        else
        	d, m, y = match(value, "(%d+)%p(%d+)%p(%d+)")
        end
        d, m, y = tonumber(d), tonumber(m), tonumber(y)

        local dm2 = d*m*m
        if  d>31 or m>12 or dm2==116 or dm2==120 or dm2==124 or dm2==496 or dm2==1116 or dm2==2511 or dm2==3751 then
            -- invalid unless leap year
            if not (dm2==116 and (y%400 == 0 or (y%100 ~= 0 and y%4 == 0))) then
                valid = false
            end
        end
    else
        valid = false
    end
    if not valid then return false, "is not a valid date" end
    return true
end
--

-- Abstract
function valua._empty(value)
	if not empty(value) then return false,"must be empty" end
	return true
end

function valua._not_empty(value)
	if empty(value) then return false,"must not be empty" end
	return true
end

function valua._type(value,value_type)
	if type(value) ~= value_type then return false,"must be a "..value_type end
	return true
end

function valua._boolean(value)
	if type(value) ~= 'boolean' then return false,"must be a boolean" end
	return true
end

function valua._number(value)
	if type(value) ~= 'number' then return false,"must be a number" end
	return true
end

function valua._string(value)
	if type(value) ~= 'string' then return false,"must be a string" end
	return true
end

function valua._in_list(value,list)
	local valid = false
	for _,v in ipairs(list) do
		if value == v then
			valid = true
			break
		end
	end
	if not valid then return false,"is not in the list" end
	return true
end
--

--
return valua
