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
	local code=[[
<?lua

local conf = require "conf.conf" 
local form = require "sailor.form"

if next(page.POST) then
	conf.sailor.admin_password = page.POST.admin_password
end



?>
	<h1> Config editor</h1><br>

<form method="post">
<table style="width:50%">
<tr>
<td>Admin Password</td>
<td><%= conf.sailor.admin_password %></td>
<td><input type="password"  name="admin_password"/></td>
<td><input type="submit" /></td>
</tr>


</table>
</form>




	]]

	return code
end

return M