local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))

require "src.sailor"

function handle(r)
    r.content_type = "text/html"

    local page = sailor.init(r, path)

    if sailor.route(page) then
		return apache2.OK
	end
	return 404
end

