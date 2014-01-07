local site = {}

local mail = require "mail"

function site.index(page)
	local stringVariable = 'this variable is being passed from a "controller" to a "view"!'
    local anotherVar = 2342

    --[[
    	--Testing models
	    local u = sailor.new("user")
	    u.name = "234"
		page:write(u.name) 
		local u2 = sailor.new("user")
	    u2.name = "567"
		page:write(u2.name)  
		page:write(u.name) 
		u.test = function() return "jfjsdf" end
		page:write(u.test())
		page:write(u2.test())
	]]

	if page.POST['email'] ~= nil then
		mail.sendMessage("<test@example.com>","Yay! Somebody sent an email using your form!","This is the email: "..page.POST['email'])
	end 

    page:render('index',{stringVariable = stringVariable,anotherVar = anotherVar})

end

function site.people(page)
	page:write("hahaha")
end

function site.notindex(page)
	page:render('test/test')
end

return site