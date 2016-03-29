local user = {}
local val = require "valua"
local access = require "sailor.access"
-- Attributes and their validation rules
user.attributes = {
	--{<attribute> =  < "safe" or validation function, requires valua >}
	{id = "safe"},
	{username = val:new().not_empty() },
	{password = val:new().not_empty().len(6,10) }
}

user.db = {
	key = 'id',
	table = 'users'
}

user.relations = {
	posts = {relation = "HAS_MANY", model = "post", attribute = "author_id"},
	comments = {relation = "HAS_MANY", model = "comment", attribute = "author_id"}
}

-- Public Methods
function user.test() return "test" end

function user.authenticate(login,password,use_hashing)
	if use_hashing == nil then use_hashing = true end
	access.settings({model = 'user', hashing = use_hashing})
	return access.login(login,password)
end

function user.logout()
	return access.logout()
end

return user
