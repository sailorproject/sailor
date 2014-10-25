local user = {}
local val = require "valua"
-- Attributes and their validation rules
user.attributes = {
	--{<attribute> =  < "safe" or validation function, requires valua >}
	{id = "safe"},
	{username = val:new().not_empty() },
	{password = val:new().not_empty().len(6,10) }
}

user.db = {
	key = 'id',
	table = 'user'
}

-- Public Methods
function user.test() return "test" end


return user
