local access = require "sailor.access"
local conf = require "conf.conf"
local sailor = require "sailor"
local model =  require "sailor.model"

local admin={}

function admin.index(page)
	if conf.sailor.enable_admin then
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
	else
		page:render('error')
	end
end

function admin.logout( page )
	if access.logout() then
		page:redirect('admin')
	end
end

function admin.dashboard(page)
	local testmsg =""
	local mogelgen = false
	local crudgen = false
	if not access.is_guest() then 
		page:redirect('admin')
	else		
		if next(page.POST) then
			if (page.POST.table_name or page.POST.model_name) then
				if page.POST.table_name then
					modelgen = model.generate_model(page.POST.table_name)
					page:render('dashboard',{modelgen=modelgen})
				end

				if page.POST.model_name then
					crudgen = model.generate_crud(page.POST.model_name)
					page:render('dashboard', {crudgen=crudgen})
				end
			end

			local path = sailor.path..'/conf/conf.lua'

			local t={}
			local string1 =[[local conf = {
					sailor = {

					]]

			table.insert(t,string1)
			local name= "app_name = " .."\""..page.POST.app_name.."\""..",\n"
			table.insert(t,name)
			local password = "admin_password = " .."\""..page.POST.admin_password.."\""..",\n"
			table.insert(t, password)
			local theme ="theme = " .."\""..page.POST.theme.."\""..",\n"
			table.insert(t,theme)
			local layout = "layout = " .."\""..page.POST.layout.."\""..",\n"
			table.insert(t,layout)
			local parameter = "route_parameter = " .."\""..page.POST.route_parameter.."\""..",\n"
			table.insert(t, parameter)
			local error = "default_error404 = " .."\""..page.POST.default_error404.."\""..",\n"
			table.insert(t, error)
			local environment = "environment = " .."\""..page.POST.environment.."\""..",\n"
			table.insert(t, environment)
			local controller = "default_controller = " .."\""..page.POST.default_controller.."\""..",\n"
			table.insert(t, controller)
			local action = "default_action = " .."\""..page.POST.default_action.."\""..",\n"
			table.insert(t, action)
			local static = "default_static="..tostring(page.POST.default_static)..",\n"
			table.insert(t, static)
			local urls = "friendly_urls="..tostring(page.POST.friendly_urls)..",\n"
			table.insert(t, urls)
			local trace = "hide_stack_trace="..page.POST.hide_stack_trace..",\n"
			table.insert(t, trace)
			local adminc = "enable_admin="..tostring(page.POST.enable_admin).."},\n"
			table.insert(t, adminc)


			local string2 = [=[ 
			db = {
				development = { ]=]

			table.insert(t,string2)

			local driver = "driver = " .."\""..tostring(page.POST.driver).."\""..",\n"
			table.insert(t, driver)
			local host = "host = " .."\""..tostring(page.POST.host).."\""..",\n"
			table.insert(t, host)
			local user = "user = " .."\""..tostring(page.POST.user).."\""..",\n"
			table.insert(t, user)
			local pass = "pass = " .."\""..tostring(page.POST.pass).."\""..",\n"
			table.insert(t, pass)
			local name = "name = " .."\""..tostring(page.POST.name).."\"".."}},\n"
			table.insert(t, name)

			local string3 = [==[
				smtp = {
			]==]

			table.insert(t,string3)
			local smtpserver = "server = " .."\""..tostring(page.POST.server).."\""..",\n"
			table.insert(t, smtpserver)
			local smtpuser = "smtpuser = " .."\""..tostring(page.POST.smtpuser).."\""..",\n"
			table.insert(t, smtpuser)
			local smtppass = "smtppass = " .."\""..tostring(page.POST.smtppass).."\""..",\n"
			table.insert(t, smtppass)
			local smtpfrom = "from = " .."\""..tostring(page.POST.from).."\"".."},\n"
			table.insert(t, smtpfrom)

			local string4="lua_at_client = {"
			table.insert(t, string4)

			local vm = "vm = " .."\""..page.POST.lua_at_client.."\""..",},\n"
			table.insert(t, vm)

			local string5 = "debug = { \n"
			table.insert(t, string5)

			local debug = "inspect = "..page.POST.debug.."}}\n"
			table.insert(t, debug)

			local string6 = "return conf"
			table.insert(t, string6)

			local  file  = io.open(path, "w")
			local writeconf = file:write(table.concat(t))
			file:close()
			
			if writeconf then
				testmsg = "Write Success"
			else
				testmsg = "Error in writing"
			end


			
		end
		
	page:render('dashboard',{test = testmsg, modelgen=modelgen,crudgen=crudgen})
	end
end

return admin