local M = {}

-- Attributes and their validation rules
M.attributes = {
	{id = "safe"},
	{body = "safe"},
	{author_id = "safe"},
	{post_id = "safe"}
}

M.db = {
	key = 'id',
	table = 'comment'
}

M.relations = {
	post = {relation = "BELONGS_TO", model = "post", attribute = "post_id"},
	author = {relation = "BELONGS_TO", model = "user", attribute = "author_id"},
}

return M
