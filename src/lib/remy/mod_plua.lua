-- Remy - mod_pLua compatibility
-- Copyright (c) 2014 Felipe Daragon
-- License: MIT

-- TODO: implement all functions from mod_lua's request_rec
local request = {
	-- ENCODING/DECODING FUNCTIONS
	base64_decode = function(_,...) return string.decode64(...) end,
	base64_encode = function(_,...) return string.encode64(...) end,
	md5 = function(_,...) return string.md5(...) end,
	-- REQUEST PARSING FUNCTIONS
	parseargs = function(_) return parseGet(), {} end,
	parsebody = function(_) return parsePost(), {} end,
	requestbody = function(_,...) return getRequestBody(...) end,
	-- REQUEST RESPONSE FUNCTIONS
	sendfile = function(_,...) return file.send(...) end,
	puts = function(_,...) echo(...) end,
	write = function(_,...) echo(...) end
}

local M = {
  mode = "mod_plua",
  request = request
}

function M.init()
	local env = getEnv()
	local r = request
	local auth = string.decode64((env["Authorization"] or ""):sub(7))
	local _,_,user,pass = auth:find("([^:]+)%:([^:]+)")
	local filename = env["Filename"]
	apache2.version = env["Server-Banner"]
	r = remy.loadrequestrec(r)
	r.method = env["Request-Method"]
	r.args = remy.splitstring(env["Unparsed-URI"],'?')
	r.banner = apache2.version
	r.basic_auth_pw = pass
	r.canonical_filename = filename
	r.context_document_root = env["Working-Directory"]
	r.document_root = r.context_document_root
	r.filename = filename
	r.hostname = env["Host"]
	r.path_info = env["Path-Info"]
	r.range = env["Range"]
	r.server_name = r.hostname
	r.the_request = env["Request"]
	r.unparsed_uri = env["Unparsed-URI"]
	r.uri = env["URI"]
	r.user = user
	r.useragent_ip = env["Remote-Address"]
end

function M.contentheader(content_type)
	request.content_type = content_type
	setContentType(content_type)
end

function M.finish(code)
	-- mod_pLua uses text/html as default content type
	if request.content_type ~= nil then
		setContentType(request.content_type)
	end
	setReturnCode(code)
end

return M
