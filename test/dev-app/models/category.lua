local M = {}

-- Attributes and their validation rules
M.attributes = {
	{id = "safe"},
	{name = "safe"},
}

M.db = {
	key = 'id',
	table = 'category'
}

M.relations = {
	posts = {relation = "MANY_MANY", model = "post", table = "post_category", attributes = {"cateogory_id","post_id"}}
}

return M
