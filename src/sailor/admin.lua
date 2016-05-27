local M ={}
function M.gen()
	local code=[[

<?lua
local conf = require "conf.conf"

print('conf.sailor.admin_password')

if next(page.POST) then
	if page.POST.password then
		if (conf.sailor.admin_password == page.POST.password) then
			?><p>login success</p><?lua
		end
	end
end

	
?>
	
	<h4>Admin Center</h4>
<form method="post">
	<input type=text placeholder="Enter Password set in config file" name="password"/>
	<input type="submit" />
</form>


	]]
	return code

end
return M