-- Remy - Lwan compatibility
-- Copyright (c) 2014 Leandro Pereira <leandro@tia.mat.br>
-- License: MIT

require "base64"

local lwan = {}
lwan.query_param_table = function(req)
    return setmetatable({}, {
        __index = function(tbl, key)
            return req.native_request:query_param(key)
        end
    })
end

lwan.post_param_table = function(req)
    return setmetatable({}, {
        __index = function (tbl, key)
            return req.native_request:post_param(key)
        end
    })
end

local request = {
    -- ENCODING/DECODING FUNCTIONS
    base64_decode = function(_,...) return base64.decode(...) end,
    base64_encode = function(_,...) return base64.encode(...) end,
    -- REQUEST PARSING FUNCTIONS
    parseargs = function(...) return lwan.query_param_table(...), {} end,
    parsebody = function(...) return lwan.post_param_table(...), {} end,
    requestbody = function(_,...) return nil end,
    -- REQUEST RESPONSE FUNCTIONS
    puts = function(req, ...) req.native_request:say(...) end,
    write = function(req, ...) req.native_request:say(...) end,
}

local M = {
    mode = "lwan",
    request = request
}

function M.init()
    -- FIXME: Most of these constants are hardcoded to possibly wrong values.
    local filename = "./index.lua"
    local uri = "/index.lua"
    apache2.version = M.mode

    local r = request
    r = remy.loadrequestrec(r)

    r.headers_out = {}
    r.headers_in = {}

    r.banner = M.mode
    r.server_name = r.hostname

    r.started = 0
    r.args = {}

    r.canonical_filename = filename
    r.context_document_root = "/"
    r.document_root = "/"
    r.filename = filename

    r.hostname = "127.0.0.1"
    r.useragent_ip = "127.0.0.1"
    r.port = "8080"

    r.range = nil

    r.method = "GET"
    r.protocol = "HTTP/1.1"
    r.the_request = "GET / HTTP/1.1"

    r.unparsed_uri = uri
    r.uri = uri

    -- This is handled by Lwan itself and is not exposed to the API
    r.user = nil
    r.basic_auth_pw = nil
end

function M.contentheader(content_type)
    request.content_type = content_type
end

function M.finish(code)
end

return M
