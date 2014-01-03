

function handle(r)
	local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))
	package.path = package.path .. ";"..path.."/src/?.lua;"..path.."/conf/?.lua"
    r.content_type = "text/html"

    require "conf"
    local sailor = require "sailor" 
    local mail = require "mail"

    sailor.init(r,path)



    -- THIS SHOULD GO TO A CONTROLLER LATER
    local stringVariable = 'this variable is being passed from a "controller" to a "view"!'
    local anotherVar = 2342


    local POST, POSTMULTI = r:parsebody()
	if POST['email'] ~= nil then
		mail.sendMessage("<dalcol@etiene.net>","Yay! Somebody is interested!","This is the email: "..POST['email'])
	end 
 

    sailor.render('index',{stringVariable = stringVariable,anotherVar = anotherVar, POST = POST})
    -- ^^

    return apache2.OK
end


