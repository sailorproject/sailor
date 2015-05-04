-- Remy - Lighttpd's mod_magnet compatibility
-- Copyright (c) 2015 Felipe Daragon
-- License: MIT

require "base64"

local utils = {}

utils.parseargs = function()
    local get = {}
    if (lighty.env["uri.query"]) then
      -- split the query-string
      for k, v in string.gmatch(lighty.env["uri.query"], "(%w+)=(.+)") do
        get[k] = v
      end
    end
    return get
end

-- TODO: implement all functions from mod_lua's request_rec
local request = {
	-- ENCODING/DECODING FUNCTIONS
	base64_decode = function(_,...) return base64.decode(...) end,
	base64_encode = function(_,...) return base64.encode(...) end,
	sha1  = function(_,...) return remy.sha1(...) end,
	-- REQUEST PARSING FUNCTIONS
	parseargs = function(_) return utils.parseargs(), {} end,
	parsebody = function(_) return {}, {} end,
	-- REQUEST RESPONSE FUNCTIONS
	puts = function(_,...) remy.print(...) end,
	write = function(_,...) remy.print(...) end
}

local M = {
  mode = "lighttpd",
  request = request
}

function M.init()
	local r = request
	local filename = lighty.env["physical.path"]
	local uri = lighty.env["uri.path"]
	apache2.version = M.mode
	r = remy.loadrequestrec(r)
	r.headers_out = lighty.header
	r.headers_in = lighty.request
	local auth = base64.decode((r.headers_in["Authorization"] or ""):sub(7))
	local _,_,user,pass = auth:find("([^:]+)%:([^:]+)")
	r.method = lighty.env["request.method"]
	r.args = lighty.env["uri.query"]
	--r.args = remy.splitstring(lighty.env['request.uri'],'?')
	r.banner = M.mode
  r.basic_auth_pw = pass
	r.canonical_filename = filename
	r.context_document_root = lighty.env["physical.doc-root"]
	r.document_root = lighty.env["physical.doc-root"]
	r.filename = filename
	r.hostname = lighty.env["uri.authority"]
	--r.port = ???
	r.protocol = lighty.env["request.protocol"]
	r.range = r.headers_in["Range"]
	r.server_name = r.hostname
	r.the_request = r.method.." "..lighty.env["request.uri"].." "..r.protocol
	r.unparsed_uri = lighty.env["request.orig-uri"]
	r.uri = uri
	r.user = user
	r.useragent_ip = lighty.env['request.remote-ip']
end

function M.contentheader(content_type)
	request.content_type = content_type
	lighty.header["Content-Type"] = content_type
end

function M.finish(code)
  lighty.content = { remy.responsetext }
end

return M