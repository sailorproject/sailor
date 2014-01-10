local model = require "src.model"
local user = {}

-- Attributes, this will be used for better validation
-- So far, this is already used to determine what can be set for this model and basic Lua type validation
user.attributes = {
	id = 'number',
	name = 'string',
	password = 'string',
}

user.db = {
	key = 'id',
	table = 'user'
}

-- Public Methods
function user.test() return "test" end

return model:new(user)
