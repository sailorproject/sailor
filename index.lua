

function handle(r)
	local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))
	package.path = package.path .. ";"..path.."/src/?.lua;"..path.."/conf/?.lua;"..path.."/controllers/?.lua"
    r.content_type = "text/html"

    require "conf"
    local lfs = require "lfs"
    local sailor = require "sailor" 
    local mail = require "mail"

    sailor.init(r,path)

 	sailor.route()  
 	
    return apache2.OK
end


