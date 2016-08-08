
local db_driver, db_user, db_pass, db_name

if os.getenv("TRAVIS") == "true" then
	db_driver = assert(os.getenv("DB_DRIVER"))
	db_user = assert(os.getenv("DB_USER"))
	db_pass = os.getenv("DB_PASS")
	db_name = os.getenv("DB_NAME")
end

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
		enable_autogen = true, -- default is false, should be true only in development environment
		friendly_urls = false,
		hide_stack_trace = false,
		max_upload = 1024 * 1024,
		environment = "test", -- this will use db configuration named test
		search_engine = "elasticsearch",
		enable_admin = false,
		admin_password = "" 
	},

	db = {
		test = { -- current environment
			driver = db_driver or 'mysql',
			host = 'localhost',
			user = db_user or '',
			pass = db_pass or '',
			dbname = db_name or ''
		},

	
	},
	search ={	
		elasticsearch={
			hosts={
				{
				protocol ="http",
				host ="localhost",
				port=9200			
				}	
			},
			params={
				pingTimeout = 1,
				selector = 'RoundRobinSelector',
				connectionPool = 'StaticConnectionPool',
				maxRetryCount = 5,
				logLevel = 'WARN'
			},
			index = "test"
		}

	},
	smtp = {
		server = '',
		smtpuser = '',
		smtppass = '',
		from = ''
	},

	lua_at_client = {
		vm = "starlight", -- starlight is default. Other options are: "lua51js", "luavmjs" and "moonshine"
	},

	debug = {
		inspect = true
	}
}

return conf
