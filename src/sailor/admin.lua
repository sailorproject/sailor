local M ={}
function M.gen()
	local code=[[

<?lua
local conf = require "conf.conf"


if next(page.POST) then
	if page.POST.password then
		if (conf.sailor.admin_password == page.POST.password) then
			?>
			<p>Login success. (it should redirect form here)</p>
			<a href="?r=/admin/conf"> Config editor</a><br>
			<a href="M.autogen()"> Autogen Fucntions</a>
			<?lua
			else ?><p>Password error. Check config file</p><?lua
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



function M.autogen( ... )
		--copy the autogen fucntions here. 

end

function M.conf( )

local code=[[
	<?lua@client 
window:alert("the conf function")
	?>
	]]
	return code
end
return M