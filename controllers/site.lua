local sailor = require "sailor"
site = {}

function site.index()
	local stringVariable = 'this variable is being passed from a "controller" to a "view"!'
    local anotherVar = 2342


	--local POST, POSTMULTI = sailor.response:parsebody()
	--if POST['email'] ~= nil then
	--	mail.sendMessage("<test@example.com>","Yay! Somebody sent an email using your form!","This is the email: "..POST['email'])
	--end 
 

    sailor.render('index',{stringVariable = stringVariable,anotherVar = anotherVar})

    sailor.render('test/test')

end


function site.notindex(sailor)

	 sailor.render('test/test')
end

return site