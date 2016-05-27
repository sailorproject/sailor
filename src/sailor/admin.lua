local M ={}
function M.gen()
	local code=[[

	<h4>Admin Center</h4>
<form method="post">
	<input type=text placeholder="Enter Password set in conf file" name="password"/>
	<input type="submit" />
</form>

	]]
	return code

end
return M