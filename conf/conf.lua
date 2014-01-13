local conf = {
        sailor = {
                default_static = nil, -- If defined, default page will be a rendered lp as defined. 
                                                          -- Example: 'maintenance' will render /views/maintenance.lp
                default_controller = 'main', 
                default_action = 'index',
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
