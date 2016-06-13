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
	local code=[=[
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
	local admin = "enable_admin="..page.POST.enable_admin..",\n"
	local.insert(t, admin)
	local upload = "max_upload="..page.POST.max_upload
	local.insert(t, upload)
	

	local  file  = io.open(path, "w")
	file:write(t)
	file:close()

end



?>
	<h1> Config editor</h1><br>

<form method="post">
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

<tr>
<td> Max upload



</table>
<br>
<input type="submit" />

</form>




	]=]

	return code
end

return M