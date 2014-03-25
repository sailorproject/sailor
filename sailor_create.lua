#!/usr/bin/lua
local lfs = require "lfs"

local function help()
	print("\n\t\27[31mUsage:\27[0m\n")
	print("\t\tsailor_create.lua <app name> {<dir>} - Generates web files in a directory.")
	print("\t\t   <app name>: The name of your application.")
	print("\t\t   <dir>: Optional. The directory you wish your files to be created or current dir.\n")
	print("\n\t\27[31mExample:\27[0m\n")
	print("\t\tsailor_create.lua 'Hey Arnold' /var/www")
	print("\t\t   This will create your web app under /var/www/hey_arnold.\n")
end

local function get_sailor_path(current_dir)
	local sailor_path = ((debug.getinfo(1).source):match("^@?(.-)/sailor_create.lua$"))

	local f = sailor_path and io.open(sailor_path.."/src/sailor.lua", "r")
	if not f then 
		print("caiu no not f")
		local datafile = require("datafile")
		sailor_path = datafile.path("sailor/cookie.lua"):match("^@?(.-)/sailor/cookie.lua$")
	else
		print("caiu no f")
		f:close() 
		if sailor_path == '.' then
			print("aaaa")
			sailor_path = current_dir.."/src"
		elseif sailor_path:match("^.") then
			print("bbbb")
			local path = sailor_path:match(".(.-)")
			sailor_path = current_dir.."/sailor"..tostring(path).."/src"
		elseif not sailor_path:match("^/") then 
			print("cccc")
			sailor_path = current_dir.."/src/"..sailor_path 
		else
			print("dddd")
			sailor_path = sailor_path.."/src"
		end
	end
	return sailor_path
end

local function error()
	print("\27[33mError generating sailor web app.\27[0m ")
	print("Please report to developers.")
end

local function create()
	local name = string.gsub(arg[1]:lower(),' ','_')
	local current_dir = lfs.currentdir()
	local destiny = arg[2] or current_dir 
	
	local sailor_path = get_sailor_path(current_dir)
	
	local raw_app = sailor_path.."/sailor/demo-app"
	local new_app = destiny.."/"..name
	os.execute("cp -a "..raw_app.." "..new_app)

	local index = io.open (new_app.."/.htaccess" , "r")
	local src = index:read("*a")
	index:close()

	index = io.open (new_app.."/.htaccess" , "w")
	src = string.gsub(src,"{{path}}",sailor_path)
	index:write(src)
	index:close()

	local conf = io.open (new_app.."/conf/conf.lua" , "r")
	src = conf:read("*a")
	conf:close()
	conf = io.open (new_app.."/conf/conf.lua" , "w")
	src = string.gsub(src,"Sailor! A Lua MVC Framework",arg[1])
	conf:write(src)
	conf:close()

	print("done!")
end

local function run()
	if not arg[1] or arg[1] == '--help' or arg[1] == '-h' then
		help()
	else
		create()
	end
end

run()