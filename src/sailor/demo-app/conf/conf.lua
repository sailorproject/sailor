local conf = {
	sailor = {
		app_name = 'Sailor! A Lua MVC Framework',
		default_static = nil, -- If defined, default page will be a rendered lp as defined. 
							  -- Example: 'maintenance' will render /views/maintenance.lp
		default_controller = 'main', 
		default_action = 'index',
		theme = 'default',
		layout = 'main',
		route_parameter = 'r',
		default_error404 = 'error/404',
		enable_autogen = false, -- default is false, should be true only in development environment
		friendly_urls = false,
	},
	db = {
		driver = 'mysql',
		host = '',
		user = '',
		pass = '',
		dbname = ''
	},
	smtp = {
		server = '',
		user = '',
		pass = '',
		from = ''
	},
	debug = {
		inspect = false
	}
}

return conf
