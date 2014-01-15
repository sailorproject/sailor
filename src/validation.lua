-- Chain validation module
-- Example local _,err = validation.check("test string!").type("string").len(3,5)

local validation = {}
local stop = setmetatable({}, {__index = function(...) return validation.stop end })

local value
local err

-- String
local function empty(v)
	return not v or string.len(v) == 0
end

function validation.empty()
	if not empty(value) then err = "not empty" return stop,err end
	return validation
end

function validation.not_empty()
	if empty(value) then err = "empty" return stop,err end
	return validation
end

function validation.len(min,max)
	local len = string.len(value)
	if len < min or len >max then err = "should have "..min.."-"..max.." characters" return stop,err end
	return validation
end
--

-- Abstract
function validation.type(value_type)
	if type(value) ~= value_type then err = "must be a "..value_type return stop,err end
	return validation
end
--

--Core
function validation.check(v)
	value = v
	return validation
end

function validation.stop()
	return stop,err
end
--

return validation