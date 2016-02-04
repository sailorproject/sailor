--------------------------------------------------------------------------------
-- sailor.lua, v0.5.2.1: core functionalities of the framework
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local conf = require "conf.conf"
local remy = require "remy"

local sailor = {
    conf = conf.sailor,
    _COPYRIGHT = "Copyright (C) 2014-2015 Etiene Dalcol",
    _DESCRIPTION = "Sailor is a framework for creating MVC web applications.",
    _VERSION = "Sailor 0.5.2",
}

-- Loads Lua@client's settings from Sailor conf.
-- If lua_at_client table is missing, use default Lua@client settings
local lp = require "web_utils.lp_ex"
lp.lat.conf.lua_at_client = conf.lua_at_client or require"latclient.conf".lua_at_client

local lfs = require "lfs"
local match, traceback,xpcall = string.match, debug.traceback,xpcall
local httpd = {}

-- Cross-environment compatible launcher. Makes Sailor adapt to
-- different web server environments
function sailor.launch(native_request)
    if apr_table ~= nil then
        -- This is Apache with mod_lua
        -- Sets a handle function to be called by mod_lua
        httpd = apache2
        handle = sailor.handle_request
    else
        -- This is a non-Apache (such as Nginx, Lighttpd, etc) or
        -- Apache with CGILua or mod_pLua
        -- Handled by Remy extension
        httpd = remy.httpd
        sailor.remy_mode = remy.init(sailor.remy_mode, native_request)
        remy.contentheader('text/html')
        remy.run(sailor.handle_request)
    end
end

function sailor.handle_request(r)
    r.content_type = "text/html"
    local page = sailor.init(r)
    return sailor.route(page)
end

-- Stores the path of the application in sailor.path
function sailor.set_application_path(r)
    if r.uri and r.filename then
        local filename = r.uri:match( "([^/]+)$") 
        if filename then
            sailor.path = r.filename:match("^@?(.-)/"..filename.."$")
            if sailor.path ~= '.' then return end
        end
    end
    sailor.path = lfs.currentdir()
end

-- Encapsulates request_rec functions inside the Page object
-- Useful for posterior compatibility with other servers
-- r: webserver's request object
function sailor.init(r)
    local page = require "sailor.page"

    sailor.set_application_path(r)
    sailor.base_path = ((r.uri):match('^@?(.-)/index.lua$') or '')
    r.content_type = "text/html"

    local GET, GETMULTI = {}, {}
    local POST, POSTMULTI = {}, {}
    if r.parsebody ~= nil then -- only present in Apache 2.4.3 or higher
        POST, POSTMULTI = r:parsebody(conf.sailor.max_upload or nil)
    end
    if r.parseargs ~= nil then
        GET, GETMULTI = r:parseargs()
    end

    local p = page.new{
        r = r,
        write = function(_,...) r:write(...) end,
        print = function(_,...) r:puts(...) end,
        GET = GET,
        POST = POST,
        POSTMULTI = POSTMULTI,
        base_path = sailor.base_path
    }

    if conf.extensions and conf.extensions.enable then
        for _,e in pairs(conf.extensions.enable) do
            package.path = 'extensions/' .. e .. '/?.lua;' .. package.path
            local c = require "controllers.user"
        end
    end

    sailor.r = r
    lp.setoutfunc("page:print")

    return p
end


-- Auxiliary function to open the autogen page for models and CRUDs
-- page: our page object
local function autogen(page)
    local autogen = require "sailor.autogen"

    local src = autogen.gen()
    src = lp.translate(src)
    page:render('sailor/autogen',{page=page},src)
end

-- Gets parameter from url query and made by mod rewrite and reassembles into page.GET
-- TODO - improve
local function apache_friendly_url(page)
    if conf.sailor.friendly_urls and page.GET.q and page.GET.q ~= '' then
        local query = {}
        for w in string.gmatch(page.GET.q, "[^/]+") do
            table.insert(query,w)
        end
        for i=1,#query,2 do
            if query[i+1] then
                page.GET[query[i]] = query[i+1]
            end
        end
    end
end

-- Reads route GET var to decide which controller/action or default page to run.
-- page: Page object with utilitary functions and request
function sailor.route(page)
    local error_404, error_handler

    apache_friendly_url(page)

    local route_name = page.GET[conf.sailor.route_parameter]

    -- Error for controller or action not found
    error_404 = function()
        local _, res
        if sailor.conf.default_error404 and sailor.conf.default_error404 ~= '' then
            page.controller_view_path = nil
            _, res = xpcall(function () page:render(sailor.conf.default_error404) end, error_handler)
            return res or httpd.OK or page.r.status or 200
        end
        page.r.status = 404
        return res or page.r.status
    end
    -- Encapsulated error function for showing detailed traceback
    -- Needs improvement
    error_handler = function (msg)
        if sailor.conf.hide_stack_trace then
            page:write("<pre>Error 500: Internal Server Error</pre>")
            return 500
        end
        page:write("<pre>"..traceback(msg,2).."</pre>")
    end

    -- If a default static page is configured, run it and prevent routing
    if conf.sailor.default_static then
        xpcall(function () page:render(conf.sailor.default_static) end, error_handler)
        return httpd.OK or page.r.status or 200
    -- If there is a route path, find the correspondent controller/action
    else 
        local controller, action 

        if not route_name or route_name == '' then
            controller, action = conf.sailor.default_controller, conf.sailor.default_action
        else
            controller, action = match(route_name, "([^/]+)/?([^/]*)")
        end

        if conf.sailor.enable_autogen and controller == "autogen" then
            local _,res = xpcall(function () autogen(page) end, error_handler)
            return res or httpd.OK or page.r.status or 200
        end

        local ctr
        local _, res = xpcall(function() ctr = require("controllers."..controller) end, error_handler)
        if ctr then
            local custom_path = ctr.path or (ctr.conf and ctr.conf.path)
            page.controller_view_path = (custom_path and custom_path..'/views/'..controller) or 'views/'..controller
            -- if no action is specified, defaults to index
            if action == '' then
                action = 'index'
            end

            if not ctr[action] then return error_404() end

            -- run action
            _, res = xpcall(function() return ctr[action](page) end, error_handler)
            if res == 404 then return error_404() end
        end

        return res or httpd.OK or page.r.status or 200
    end
    -- No route specified and no defaults or something went wrong
    return 500
end

-- DEPRECATED - it was moved to the page object
--              it will no longer be here on sailor versions >= 0.6
-- creates a url string based on friendly url configuration
-- route: string, controller/action or controller
-- params: table, get vars and values. example: {id = 3, color = "blue"}
function sailor.make_url(route,params)
    params = params or {}
    local url = route
    local base_path = sailor.base_path
    if base_path ~= '' then
        base_path = base_path..'/'
    end
    if conf.sailor.friendly_urls then
        if base_path == '' then
            base_path = '/'
        end
        url =  base_path..url
        for k,v in pairs(params) do
            url = url.."/"..k.."/"..v
        end
    else
        url = base_path.."?"..conf.sailor.route_parameter.."="..url
        for k,v in pairs(params) do
            url = url.."&"..k.."="..v
        end
    end
    return url
end

-- DEPRECATED, it will no longer be here on sailor versions >= 0.6
-- Creates a sailor model and returns an instantiated object
-- There must be a .lua file with the model's name under /model
-- model_name: string, model's name.
function sailor.new(model_name)
    local model = require "sailor.model"
    local obj = {errors = {}}
    obj["@name"] = model_name
    return sailor.model(model_name):new(obj)
end

-- DEPRECATED, moved to __call on model module
--             it will no longer be here on sailor versions >= 0.6
-- Creates a sailor model that can be instantiated in objects with :new()
-- There must be a .lua file with the model's name under /model
-- model_name: string, model's name.
function sailor.model(model_name)
    local model = require "sailor.model"
    local obj = require("models."..model_name)
    obj["@name"] = model_name
    obj.errors = {}

    return model:new(obj)
end

return sailor
