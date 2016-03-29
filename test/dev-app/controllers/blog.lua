local sailor = require "sailor"

local blog = {}

function blog.index (page)
	local posts = sailor.model("post"):find_all()
	page:inspect(posts,"Content of posts")
	page:render('index',{posts=posts})
end

function blog.comments (page)
	local post = sailor.model("post"):find_by_id( page.GET.pid )
	if not post then
		return 404
	end
	page:render('comments',{post = post})
end

return blog
