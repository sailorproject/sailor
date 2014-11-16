local post = {}

-- Attributes and their validation rules
post.attributes = {
	--<attribute> = { <valfunc> = {<args>}, <valfunc> = {<args>}...}
	{id = "safe"},
	{author_id = "safe" },
	{body = "safe"},
}

post.relations = {
	author = {relation = "BELONGS_TO", model = "user", attribute = "author_id"},
	categories = {relation = "MANY_MANY", model = "category", table = "post_category", attributes = {"post_id","category_id"}},
	comments = {relation = "HAS_MANY", model = "comment", attribute = "post_id"}
}

post.db = {
	key = 'id',
	table = 'post'
}

return post

