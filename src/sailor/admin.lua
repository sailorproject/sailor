local M ={}
function M.gen()
	local code=[[

<?lua
local conf = require "conf.conf"
local access = require "sailor.access"
access.settings{default_password = conf.sailor.admin_password}

if next(page.POST) then
	if page.POST.password then
		local login, err = access.login('admin', page.POST.password)

		if login then
			?>
			
			<p>Login success. (it should redirect form here)</p>
			<a href="?r=/admin/conf"> Config editor</a><br>
			<a href="?r=autogen"> Autogen Fucntions</a>

			<?lua
			else ?><p>Password error. Check config file</p>
				<?lua
		end
	end
end

	
?>
	
	<h2>Admin Center</h2>
	<p>Enter the password set in the config file</p>
<form method="post">
	<input type="password"  name="password"/>
	<input type="submit" />
</form>


	]]
	return code

end



function M.autogen()
local code=[[<p>yoloooooo</p>]]
end

function M.conf( )

local code=[[
	<p>yolo</p>
	]]
	return code
end

return M