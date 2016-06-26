local access = require "sailor.access"
local conf = require "conf.conf"
local admin={}

function admin.index(page)
	local msg = ""
	if next(page.POST) then
		access.settings{default_password = conf.sailor.admin_password}
		local login, err = access.login('admin', page.POST.password)
		if login then
			page:redirect('admin/dashboard')
		else
			msg = err
		end
	end
	page:render('index' ,{msg = msg})

end


return admin