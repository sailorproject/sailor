local site = {}

local mail = require "mail"

function site.index(page)
	local stringVariable = 'this variable is being passed from a "controller" to a "view"!'
    local anotherVar = 2342

	if page.POST['email'] ~= nil then
		mail.sendMessage("<test@example.com>","Yay! Somebody sent an email using your form!","This is the email: "..page.POST['email'])
	end 

    page:render('site/index',{stringVariable = stringVariable,anotherVar = anotherVar})

end

function site.people(page)
	page:write("hahaha")
end

function site.notindex(page)
	page:render('test/test')
end

return site