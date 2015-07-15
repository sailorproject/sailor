-- Remy 0.2.8
-- Copyright (c) 2014-2015 Felipe Daragon
-- License: MIT (http://opensource.org/licenses/mit-license.php)
--
-- Remy runs Lua-based web applications in alternative web server
-- environments that allow to run Lua code.

local remy = {
	MODE_AUTODETECT = nil,
	MODE_CGILUA = 0,
	MODE_MOD_PLUA = 1,
	MODE_NGINX = 2,
	MODE_LWAN = 3,
	MODE_LIGHTTPD = 4
}

local emu = {}

-- The values below will be updated during runtime
remy.config = {
	banner = "Apache/2.4.7 (Unix)",
	hostname = "localhost",
	uri = "/index.lua"
}

remy.responsetext = nil

-- HTTPd Package constants
remy.httpd = {
	-- Internal constants from include/httpd.h
	OK = 0,
	DECLINED = -1,
	DONE = -2,
	version = remy.config.banner,
	-- Other HTTP status codes are not yet implemented in mod_lua
	HTTP_MOVED_TEMPORARILY = 302,
	-- Internal constants used by mod_proxy
	PROXYREQ_NONE = 0,
	PROXYREQ_PROXY = 1,
	PROXYREQ_REVERSE = 2,
	PROXYREQ_RESPONSE = 3,
	-- Internal constants used by mod_authz_core
	AUTHZ_DENIED = 0,
	AUTHZ_GRANTED = 1,
	AUTHZ_NEUTRAL = 2,
	AUTHZ_GENERAL_ERROR = 3,
	AUTHZ_DENIED_NO_USER = 4
}

-- mod_lua's request_rec
-- The values below will be updated during runtime
local request_rec_fields = {
	allowoverrides = " ",
	ap_auth_type = nil,
	args = nil,
	assbackwards = false,
	auth_name = "",
	banner = remy.config.banner,
	basic_auth_pw = "",
	canonical_filename = nil,
	content_encoding = nil,
	content_type = nil,
	context_prefix = nil,
	context_document_root = nil,
	document_root = nil,
	err_headers_out = {},
	filename = nil,
	handler = "lua-script",
	headers_in = {}, -- request headers
	headers_out = {}, -- response headers
	hostname = remy.config.hostname,
	is_https = false,
	is_initial_req = true,
	limit_req_body = 0,
	log_id = nil,
	method = "GET",
	notes = {},
	options = "Indexes FollowSymLinks ",
	path_info = "",
	port = 80,
	protocol = "HTTP/1.1",
	proxyreq = "PROXYREQ_NONE",
	range = nil,
	remaining = 0,
	server_built = "Nov 26 2013 15:46:56",
	server_name = remy.config.hostname,
	some_auth_required = false,
	subprocess_env = {},
	started = 1393508507,
	status = 200,
	the_request = "GET "..remy.config.uri.." HTTP/1.1",
	unparsed_uri = remy.config.uri,
	uri = remy.config.uri,
	user = nil,
	useragent_ip = "127.0.0.1"
}

function remy.init(mode, native_request)
	remy.responsetext = nil
	if mode == remy.MODE_AUTODETECT then
		mode = remy.detect(native_request)
	end
	if mode == remy.MODE_CGILUA then
		emu = require "remy.cgilua"
	elseif mode == remy.MODE_NGINX then
		emu = require "remy.nginx"
	elseif mode == remy.MODE_MOD_PLUA then
		emu = require "remy.mod_plua"
	elseif mode == remy.MODE_LIGHTTPD then
		emu = require "remy.mod_magnet"
	elseif mode == remy.MODE_LWAN then
		emu = require "remy.lwan"
	end
	apache2 = remy.httpd
	emu.init(native_request)
	return mode
end

-- Sets the value of the Content Type header field
function remy.contentheader(content_type)
  emu.contentheader(content_type)
end

-- Detects the Lua environment
function remy.detect(native_request)
	local mode = nil
	if package.loaded.cgilua ~= nil then
		mode = remy.MODE_CGILUA
	elseif package.loaded.ngx ~= nil then
		mode = remy.MODE_NGINX
	elseif getEnv ~= nil then
		local env = getEnv()
		if env["pLua-Version"] ~= nil then
			mode = remy.MODE_MOD_PLUA
		end
	elseif package.loaded.lighty ~= nil then
		mode = remy.MODE_LIGHTTPD
	elseif native_request ~= nil and type(native_request.query_param) == "function" then
		mode = remy.MODE_LWAN
	end
	return mode
end

-- Handles the return code
function remy.finish(code)
  emu.finish(code)
end

-- Load the default request_rec fields
function remy.loadrequestrec(r)
	for k,v in pairs(request_rec_fields) do r[k] = v end
	return r
end

-- Temporarily stores the printed content (needed by CGILua mode)
function remy.print(str)
  remy.responsetext = remy.responsetext or ""
  remy.responsetext = remy.responsetext..str
end

-- Runs the mod_lua handle function
function remy.run(handlefunc)
	local code = handlefunc(emu.request)
	remy.finish(code)
end

function remy.splitstring(s, delimiter)
	local result = {}
	for match in (s..delimiter):gmatch("(.-)"..delimiter) do
		table.insert(result, match)
	end
	return result
end

function remy.sha1(str)
	local sha1 = require "sha1"
	return sha1(str)
end

return remy
