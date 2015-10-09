local conf = {
	lua_at_client = {
		vm = "starlight", -- starlight is default. Other options are moonshine, lua51js and luavmjs.
		vm_url = nil -- allows to set a custom URL for the VM JavaScript files.
	}
}

return conf