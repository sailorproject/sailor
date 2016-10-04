--------------------------------------------------------------------------------
-- cli.lua v0.1.1: Functions for sailor's command line utility
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local cli = {}

local function get_sailor_path(current_dir)
	local sailor_path = ((debug.getinfo(1).source):match("^@?(.-)/sailor$"))

	local f = sailor_path and io.open(sailor_path.."/src/sailor.lua", "r")
	if not f then
		local datafile = require("datafile")
		sailor_path = datafile.path("sailor/cookie.lua"):match("^@?(.-)/sailor/cookie.lua$")
	else
		f:close()
		if sailor_path == '.' then
			sailor_path = current_dir.."/src"
		elseif sailor_path:match("^.") then
			local path = sailor_path:match(".(.-)")
			sailor_path = current_dir.."/sailor"..tostring(path).."/src"
		elseif not sailor_path:match("^/") then
			sailor_path = current_dir.."/src/"..sailor_path
		else
			sailor_path = sailor_path.."/src"
		end
	end
	return sailor_path
end

function cli.create(args, _)
	local name = string.gsub(args.name:lower(),' ','_')
	local current_dir = lfs.currentdir()
	local destiny = args.path or current_dir

	local sailor_path = get_sailor_path(current_dir)

	local raw_app = sailor_path.."/sailor/blank-app"
	local new_app = destiny.."/"..name
	assert(os.execute("cp -a '"..raw_app.."' '"..new_app.."'"))

	local htaccess = assert(io.open (new_app.."/.htaccess" , "r"))
	local src = htaccess:read("*a")
	htaccess:close()

	htaccess = assert(io.open (new_app.."/.htaccess" , "w"))
	src = string.gsub(src,"{{path}}",sailor_path)
	htaccess:write(src)
	htaccess:close()

	local conf = assert(io.open (new_app.."/conf/conf.lua" , "r"))
	src = conf:read("*a")
	conf:close()
	conf = assert(io.open (new_app.."/conf/conf.lua" , "w"))
	src = string.gsub(src,"Sailor! A Lua MVC Framework", args.name)
	conf:write(src)
	conf:close()

	print("done!")
	os.exit(0)
end

function cli.enable(args, _)
	local name = 'sailor-'..args.name
	local current_dir = lfs.currentdir()
	local sailor_path = get_sailor_path(current_dir)

	assert(os.execute('luarocks install '..name))

	local ext_app = sailor_path.."/sailor/"..name.."/app"
	assert(os.execute("mkdir -p extensions"))
	local err = assert(os.execute("cp -a '"..ext_app.."' extensions/"..name))
	if err == 0 then
		local index_file = assert(io.open ("index.lua" , "r"))
		local src = index_file:read("*a")
		index_file:close()

		local package_path = "package.path =  base_dir..'extensions/"..name.."/?.lua;'..package.path"
		src = string.gsub(src,"\nlocal sailor",package_path.."\n\nlocal sailor")
		index_file = assert(io.open ("index.lua" , "w"))
		index_file:write(src)
		index_file:close()
		print("New files:")
		print("extensions/"..name.."/*\n")
		print("Files modified:")
		print("index.lua\n")
		print("done!")
		os.exit(0)
	end
end

function cli.gen_all(args)
	local model =  require "sailor.model"
	model.generate_model(args.table_name)
	model.generate_crud(args.table_name)
end

function cli.gen_crud(args)
	local model =  require "sailor.model"
	model.generate_crud(args.model_name)
end

function cli.gen_model(args)
	local model =  require "sailor.model"
	model.generate_model(args.table_name)
end

function cli.test(args, _)
	local ok, code

   flags = table.concat(args.EXTRA_FLAGS, " ")

	if args.resty then
		ok, code = os.execute('resty tests/bootstrap_resty.lua')
	else
		ok, code = os.execute('busted --helper=tests/bootstrap.lua '..flags..' tests/unit/* tests/functional/*')
	end

	if type(ok) == "number" then return ok end -- Lua 5.1 just returns the status code
	exit_code = ok and 0 or 1 -- don't care about actual value

    if exit_code and exit_code ~= 0 then
    	-- exit code sometimes is > 255 and fails to be propagated
    	os.exit(1, true)
    end
end

function cli.version()
	print("Sailor: version " .. require "sailor.version")
	os.exit(0)
end

return cli