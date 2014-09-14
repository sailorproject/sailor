-- Remy - CGI-Lua compatibility
-- Copyright (c) 2014 Felipe Daragon
-- License: MIT

require "base64"

-- TODO: implement all functions from mod_lua's request_rec
local request = {
	-- ENCODING/DECODING FUNCTIONS
	base64_decode = function(_,...) return base64.decode(...) end,
	base64_encode = function(_,...) return base64.encode(...) end,
	escape = function(_,...) return cgilua.urlcode.escape(...) end,
	unescape = function(_,...) return cgilua.urlcode.unescape(...) end,
	-- REQUEST PARSING FUNCTIONS
	parseargs = function(_) return cgilua.QUERY, {} end,
	parsebody = function(_) return cgilua.POST, {} end,
	-- REQUEST RESPONSE FUNCTIONS
	puts = function(_,...) cgilua.put(...) end,
	write = function(_,...) cgilua.print(...) end
}

local M = {
  mode = "cgilua",
  request = request
}

function M.init()
	local r = request
	local query = cgilua.servervariable("QUERY_STRING")
	local port = cgilua.servervariable("SERVER_PORT")
	local server_name = cgilua.servervariable("SERVER_NAME")
	local path_info = M.getpathinfo()
	apache2.version = cgilua.servervariable("SERVER_SOFTWARE")
	r = remy.loadrequestrec(r)
	r.ap_auth_type = cgilua.servervariable("AUTH_TYPE")
	if query ~= nil and query ~= '' then
 		r.args = query
	end
	r.banner = apache2.version
	r.canonical_filename = cgilua.script_path
	r.content_type = "text/html" -- CGILua needs a default content_type
	r.context_document_root = cgilua.script_pdir
	r.document_root = cgilua.script_pdir
	r.filename = cgilua.script_path
	r.hostname = server_name
	r.method = cgilua.servervariable("REQUEST_METHOD")
	r.path_info = path_info
	if port ~= nil then
		r.port = tonumber(port)
		if r.port == 443 then
			r.is_https = true
		end
	end
	r.protocol = cgilua.servervariable("SERVER_PROTOCOL")
	r.range = cgilua.servervariable("HTTP_RANGE")
	r.server_name = server_name
	r.started = os.time()
	r.the_request = r.method..' '..M.getunparseduri()..' '..r.protocol
	r.unparsed_uri = M.getunparseduri()
	r.uri = path_info
	r.user = cgilua.servervariable("REMOTE_USER")
	r.useragent_ip = cgilua.servervariable("REMOTE_ADDR")
end

function M.getpathinfo()
	local p = cgilua.urlpath
  	if p == nil then
  		p = cgilua.servervariable("SCRIPT_NAME")
  	end
  return p
end

function M.getunparseduri()
	local uri = M.getpathinfo()
	local query = cgilua.servervariable("QUERY_STRING")
	if query ~= nil and query ~= '' then
		uri = uri..'?'..query
	end
	return uri
end

function M.contentheader(content_type)
	if content_type == "text/html" then
		cgilua.htmlheader()
	else
		local header_sep = "/"
		local header_type = remy.splitstring(content_type,header_sep)[1]
		local header_subtype = remy.splitstring(content_type,header_sep)[2]
		cgilua.contentheader(header_type,header_subtype)
	end
end

-- TODO: handle the return code in CGILua
function M.finish(code)
end

return M
