local conf = {
	sailor = {
		app_name = 'Sailor! A Lua MVC Framework',
		default_static = nil, -- If defined, default page will be a rendered lp as defined. 
							  -- Example: 'maintenance' will render /views/maintenance.lp
		default_controller = 'main', 
		default_action = 'index',
		layout = 'default',
		route_parameter = 'r'
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
	}
}

return conf
