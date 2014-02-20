require "src.sailor"

function handle(r)
	local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))
    r.content_type = "text/html"
    local page = sailor.init(r,path)
    return sailor.route(page)
end
 