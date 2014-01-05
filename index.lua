local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))
package.path = package.path .. ";"..path.."/src/?.lua;"..path.."/conf/?.lua;"..path.."/controllers/?.lua" 
require "conf"
local sailor = require "sailor"

function handle(r)
	r.content_type = "text/html"

    local page = sailor.init(r,path)
 	sailor.route(page)  

    return apache2.OK
end


