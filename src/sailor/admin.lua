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
	string1 =[[local conf = {
				sailor = {

				]]
		local  file  = io.open(path, "w")

	file:write(string1)
	file:write("app_name = " .."\""..page.POST.app_name.."\""..",\n")
	file:write("admin_password = " .."\""..page.POST.admin_password.."\""..",\n")
	file:write("theme = " .."\""..page.POST.theme.."\""..",\n")
	file:write("layout = " .."\""..page.POST.layout.."\""..",\n")
	file:write("route_parameter = " .."\""..page.POST.route_parameter.."\""..",\n")
	file:write("default_error404 = " .."\""..page.POST.default_error404.."\""..",\n")
	file:write("environment = " .."\""..page.POST.environment.."\""..",\n")
	file:write("default_controller = " .."\""..page.POST.default_controller.."\""..",\n")
	file:write("default_action = " .."\""..page.POST.default_action.."\""..",\n")
	file:write("default_static="..page.POST.default_static..",\n")
	file:write("enable_autogen="..page.POST.enable_autogen..",\n")
	file:write("friendly_urls="..page.POST.friendly_urls..",\n")
	file:write("hide_stack_trace="..page.POST.hide_stack_trace..",\n")
	file:write("enable_admin="..page.POST.enable_admin..",\n")
	file:write("max_upload="..page.POST.max_upload)
	string2=[[ }
}

return conf	]]
	file:write(string2)
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
<td><input type="radio" name="enable_autogen" value="true">True<br></td>
<td><input type="radio" name="enable_autogen" value="false" checked>False</td>
</tr>

<tr>
<td>Toggle Admin</td>
<td><input type="radio" name="enable_admin" value="true">True<br></td>
<td><input type="radio" name="enable_admin" value="false" checked>False</td>
</tr>

<tr>
<td>Hide Stack Trace</td>
<td><input type="radio" name="hide_stack_trace" value="true" checked>True<br></td>
<td><input type="radio" name="hide_stack_trace" value="false">False</td>
</tr>

<tr>
<td>Toggle Friendly Urls</td>
<td><input type="radio" name="friendly_urls" value="true">True<br></td>
<td><input type="radio" name="friendly_urls" value="false" checked>False</td>
</tr>



</table>
<br>
<input type="submit" />

</form>




	]=]

	return code
end

return M