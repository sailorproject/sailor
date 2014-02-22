local model = require "src.model"
local user = {}

-- Attributes and their validation rules
user.attributes = {
	--<attribute> = { <valfunc> = {<args>}, <valfunc> = {<args>}...}
	id = {},
	username = { not_empty = {} },
	password = { not_empty = {}, len = {6,10} }
}

user.db = {
	key = 'id',
	table = 'user'
}

-- Public Methods
function user.test() return "test" end


return model:new(user)
