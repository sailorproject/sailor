-- This file is part of the Lua@Client project
-- Copyright (c) 2014-2015 Felipe Daragon
-- License: MIT

local M = {
	js_served = false,
}

local common = require "latclient.common"

function M.get_header(s)
	if M.js_served == false then
		M.js_served = true
		local header = [[
		<script src="{url}/lua51js/lua5.1.5.min.js"></script>
		<script src="{url}/lua51js/latclient.js"></script>
		<script src="{url}/lua51js/js-lua.js"></script>
		]]
		header = string.gsub(header, "{url}", M.js_url)
		s = header..s
	end
	return s
end


function M.get_client_js(s)
	local s = common.js_string_escape(s)
	s = '<script>LuaCS.runString('..s..')</script>'
	return M.get_header(s)
end

function M.get_provide_script(fn,path,filename)
	local js = [[
	(function(Lua5_1) {
		Lua5_1.provide_file(%s, %s, %s,true, false);
		})(Lua5_1);
		]]
		local file = io.open (fn, "r")
		local src = file:read("*all")
		file:close()
		src = M.js_string_escape(src)
		path = M.js_string_escape(path)
		filename = M.js_string_escape(filename)
		return string.format(js, path, filename, src)
end

-- File provider for mod_lua
function M.handle(r,path,filename)
		r.content_type = "text/javascript"
		if filename == nil then
			filename = r.uri:match( "([^/]+)$")
		end
		if path == nil then
			path = r.uri:match("^@?(.-)/"..filename.."$").."/"
		end
		r:puts(M.get_provide_script(r.filename,path,filename))
		return apache2.OK
end

-- File provider for CGI-Lua
function M.cgilua_exit(path,filename)
		if cgilua ~= nil then
			cgilua.contentheader("text","javascript")
			if filename == nil then
				filename = cgilua.script_path:match( "([^/]+)$")
			end
			if path == nil then
				path = cgilua.servervariable("SCRIPT_NAME"):match("^@?(.-)/"..filename.."$").."/"
			end
			cgilua.put(M.get_provide_script(cgilua.script_path,path,filename))
			os.exit()
		end
end

return M