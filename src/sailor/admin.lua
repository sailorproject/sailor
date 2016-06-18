local M ={}
function M.gen()
	local code=[[

<?lua
local conf = require "conf.conf"
local access = require "sailor.access"
local session = require "sailor.session"

access.settings{default_password = conf.sailor.admin_password}

if next(page.POST) then
		local login, err = access.login('admin', page.POST.password)
		if login then
			?>
		
			<p>Login success.</p>
			

			<?lua
			else ?>
				<p>Password error. Check config file</p>
				<?lua
		end
	
end
?>
<?lua	
if access.is_guest() then ?>	
	<h2>Admin Center</h2>
	<p>Enter the password set in the config file</p>
<form method="post">
	<input type="password"  name="password"/>
	<input type="submit" />
</form>
<?lua
else ?>
		<a href="?r=logoutadmin">Logout</a><br>
		<a href="?r=configedit"> Config editor</a><br>
		<a href="?r=autogen"> Autogen Fucntions</a>



<?lua
 end ?>


	]]
	return code

end

function M.configedit()
	local code=[=====[
<?lua

local conf = require "conf.conf" 
local sailor = require "sailor"

if next(page.POST) then
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
	local static = "default_static="..page.POST.default_static..",\n"
	table.insert(t, static)
	local autogen = "enable_autogen="..page.POST.enable_autogen..",\n"
	table.insert(t, autogen)
	local urls = "friendly_urls="..page.POST.friendly_urls..",\n"
	table.insert(t, urls)
	local trace = "hide_stack_trace="..page.POST.hide_stack_trace..",\n"
	table.insert(t, trace)
	local adminc = "enable_admin="..page.POST.enable_admin.."},\n"
	table.insert(t, adminc)


	local string2 = [=[ 
	db = {
		development = { ]=]

	table.insert(t,string2)

	local driver = "driver = " .."\""..page.POST.driver.."\""..",\n"
	table.insert(t, driver)
	local host = "host = " .."\""..page.POST.host.."\""..",\n"
	table.insert(t, host)
	local user = "user = " .."\""..page.POST.user.."\""..",\n"
	table.insert(t, user)
	local pass = "pass = " .."\""..page.POST.pass.."\""..",\n"
	table.insert(t, pass)
	local dbname = "dbname = " .."\""..page.POST.dbname.."\"".."}},\n"
	table.insert(t, dbname)

	local string3 = [==[
		smtp = {
	]==]

	table.insert(t,string3)
	local smtpserver = "server = " .."\""..page.POST.smtpserver.."\""..",\n"
	table.insert(t, smtpserver)
	local smtpuser = "user = " .."\""..page.POST.smtpuser.."\""..",\n"
	table.insert(t, smtpuser)
	local smtppass = "pass = " .."\""..page.POST.smtppass.."\""..",\n"
	table.insert(t, smtppass)
	local smtpfrom = "from = " .."\""..page.POST.smtpfrom.."\"".."},\n"
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
		?>
		<p>Configuration Edited Successfully</p>
		<?lua
	else
		?>
		<p>Error in Changing conf file</p>
		<?lua
	end



end
?>



	<h1> Config editor</h1><br>


<form method="post">
<h3><u>Sailor Settings</u></h3>

<table style="width:100%">

<tr>
<td>Admin Password</td>
<td><input type="text"  name="admin_password" value="<%= conf.sailor.admin_password %>" /></td>
</tr>

<tr>
<td>Application Name</td>
<td><input type="text"  name="app_name" value="<%= conf.sailor.app_name %>" /></td>
</tr>

<tr>
<td>Theme</td>
<td><input type="text"  name="theme" value="<%= conf.sailor.theme %>" /></td>
</tr>

<tr>
<td>Layout</td>
<td><input type="text"  name="layout" value="<%= conf.sailor.layout %>"/></td>
</tr>

<tr>
<td>Route Parameter</td>
<td><input type="text"  name="route_parameter" value="<%= conf.sailor.route_parameter %>" /></td>
</tr>

<tr>
<td>Default Error View</td>
<td><input type="text"  name="default_error404" value="<%= conf.sailor.default_error404 %>" /></td>
</tr>

<tr>
<td>Database Environment</td>
<td><input type="text"  name="environment" value="<%= conf.sailor.environment %>"/></td>
</tr>

<tr>
<td>Default Controller</td>
<td><input type="text"  name="default_controller" value="<%= conf.sailor.default_controller %>"/></td>
</tr>

<tr>
<td>Default Action</td>
<td><input type="text"  name="default_action" value="<%= conf.sailor.default_action %>"/></td>
</tr>

<tr>
<td>Default Static</td>
<td><input type="text"  name="default_static" value="<%= tostring(conf.sailor.default_static) %>" /></td>
</tr>

<tr>
<td>Toggle Autogen</td>
<td><input type="radio" name="enable_autogen" value="true">True
<input type="radio" name="enable_autogen" value="false" checked>False</td>
</tr>

<tr>
<td>Toggle Admin</td>
<td><input type="radio" name="enable_admin" value="true">True
<input type="radio" name="enable_admin" value="false" checked>False</td>
</tr>

<tr>
<td>Hide Stack Trace</td>
<td><input type="radio" name="hide_stack_trace" value="true" checked>True
<input type="radio" name="hide_stack_trace" value="false">False</td>
</tr>

<tr>
<td>Toggle Friendly Urls</td>
<td><input type="radio" name="friendly_urls" value="true">True
<input type="radio" name="friendly_urls" value="false" checked>False</td>
</tr>

</table>

<h3> Database Settings</h3>

<table style="width:100%">

<tr>
<td> Database Driver</td>
<td><input type="text"  name="driver" value="<%= tostring(conf.db.development.driver) %>" /></td>
</tr>


<tr>
<td> Host</td>
<td><input type="text"  name="host" value="<%= tostring(conf.db.development.host) %>" /></td>
</tr>


<tr>
<td> Username</td>
<td><input type="text"  name="user" value="<%= conf.db.development.user %>" /></td>
</tr>

<tr>
<td> Password</td>
<td><input type="text"  name="pass" value="<%= conf.db.development.pass %>" /></td>
</tr>

<tr>
<td> Database Name</td>
<td><input type="text"  name="dbname" value="<%= conf.db.development.dbname %>" /></td>
</tr>
</table>

<h3> Mail Server Settings</h3>

<table style="width:100%">

<tr>
<td>Mail Server</td>
<td><input type="text"  name="smtpserver" value="<%= conf.smtp.server %>" /></td>
</tr>

<tr>
<td> Username</td>
<td><input type="text"  name="smtpuser" value="<%= conf.smtp.user %>" /></td>
</tr>

<tr>
<td> Password</td>
<td><input type="text"  name="smtppass" value="<%= conf.smtp.pass %>" /></td>

<tr>
<td> From Address</td>
<td><input type="text"  name="smtpfrom" value="<%= conf.smtp.from %>" /></td>
</tr>

<tr>
<td> <u>Lua at Client VM</u></td>
<td><input type="text"  name="lua_at_client" value="<%= conf.lua_at_client.vm %>" /></td>
</tr>

<tr>
<td><u>Toggle Debug Mode</u></td>
<td><input type="radio" name="debug" value="true">True
<input type="radio" name="debug" value="false" checked>False</td>
</tr>

</table>


<input type="submit" />

</form>




	]=====]

	return code
end

return M