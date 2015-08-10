--------------------------------------------------------------------------------
-- sailor.lua, v0.4.7: core functionalities of the framework
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local conf = require "conf.conf"

local sailor = {
    conf = conf.sailor,
    _COPYRIGHT = "Copyright (C) 2014-2015 Etiene Dalcol",
    _DESCRIPTION = "Sailor is a framework for creating MVC web applications.",
    _VERSION = "Sailor 0.4",
}

local lp = require "web_utils.lp_ex"
local lfs = require "lfs"
local open,assert,loadstring,setfenv,load,random = io.open,assert,loadstring,setfenv,load,math.random
local match,tostring,gsub = string.match,tostring,string.gsub
local traceback,xpcall = debug.traceback,xpcall
local Page = {}
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
        local remy = require "remy"
        httpd = remy.httpd
        sailor.remy_mode = remy.init(sailor.remy_mode, native_request)
        if sailor.remy_mode == remy.MODE_LIGHTTPD then
            -- FIXME: os.tmpname(), used by web_utils\utils.lua not
            -- working in LightTPD (affects Windows build only?)
            -- This breaks every script using "session"
            function os.tmpname()
                return 'tmp'
            end
        end
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
    local dir = lfs.currentdir()

    if dir == '/' or not dir then
        local filename = r.uri:match( "([^/]+)$")
        sailor.path = r.filename:match("^@?(.-)/"..filename.."$")
    else
        sailor.path = dir
    end
end

-- Encapsulates request_rec functions inside the Page object
-- Useful for posterior compatibility with other servers
-- r: webserver's request object
function sailor.init(r)
    sailor.set_application_path(r)
    r.content_type = "text/html"

    local GET, GETMULTI = {}, {}
    local POST, POSTMULTI = {}, {}
    if r.parsebody ~= nil then -- only present in Apache 2.4.3 or higher
        POST, POSTMULTI = r:parsebody(conf.sailor.max_upload or nil)
    end
    if r.parseargs ~= nil then
        GET, GETMULTI = r:parseargs()
    end

    local page = {
        r = r,
        render = Page.render,
        redirect = Page.redirect,
        include = Page.include,
        inspect = Page.inspect,
        write = function(_,...) r:write(...) end,
        print = function(_,...) r:puts(...) end,
        GET = GET,
        POST = POST,
        POSTMULTI = POSTMULTI,
        theme = conf.sailor.theme,
        layout = conf.sailor.layout,
        title = conf.sailor.app_name,
        trace = {},
        base_path = ((r.uri):match('^@?(.-)/index.lua$') or '')
    }
    sailor.r = r
    lp.setoutfunc("page:print")

    return page
end

-- Aux function
-- Renders a previously read and parsed .lp file
-- path: string for debug purposes, shown on error messages
-- src: the parsed string
-- parms: table, the parameters being passed ahead to the rendered page
local function render_page(path,src,parms)
    parms.sailor = sailor
    for k,v in pairs(_G) do parms[k] = v end

    local f
    if _VERSION == "Lua 5.1" then
        f = assert(loadstring(src,'@'..path))
        setfenv(f,parms)
    else
        f = assert(load(src,'@'..path,'t',parms))
    end

    f()
end

-- Opens and reads a file and returns the read string
-- path: string, file path without ".lp"
local function read_src(path)
    local lua_page = assert (open (path..".lp", "rb"))
    local src = lua_page:read("*all")
    lua_page:close()
    return src
end

-- Includes a .lp file from a .lp file
-- path: string, full file path
-- parms: table, vars being passed ahead
function Page:include(path,parms)
    parms = parms or {}

    local incl_src = read_src(sailor.path..'/'..path)
    incl_src = lp.translate(incl_src)
    parms.page = self
    render_page(path,incl_src,parms)
end

-- Renders a view from a controller action
-- filename: string, filename without ".lp". The file must be inside /views/<controller name>
-- parms: table, vars being passed ahead.
function Page:render(filename,parms)
    parms = parms or {}

    local src
    local filepath

    -- If there's a default theme, parse the theme first
    if self.theme ~= nil and self.theme ~= '' then
        self.theme_path = self.base_path.."/themes/"..self.theme
        filepath = ((sailor.path):match('(.*)'..self.base_path:gsub('-','%%-') ) or '')..self.theme_path.."/"..self.layout

        local theme_src = read_src(filepath)
        local filename_var = "sailor_filename_"..tostring(random(1000))
        local parms_var = "sailor_parms_"..tostring(random(1000))
        -- Then remove theme and continue parsing
        src = gsub(theme_src,"{{content}}",' <? page.theme = nil; page:render('..filename_var..','..parms_var..') ?> ')
        parms[filename_var] = filename
        parms[parms_var] = parms

    else
        local dir = ''
        if self.controller then
            dir = '/'..self.controller
        end
        -- filename is nil if the controller script is missing in /controllers/
        -- ToDo: print error informing about missing controller?
        if filename ~= nil then
            filepath = sailor.path.."/views"..dir.."/"..filename
            src = read_src(filepath)
        end

    end

    if conf.debug and conf.debug.inspect and ( (conf.sailor.theme and self.theme) or not conf.sailor.theme )then
        local debug_src = read_src(sailor.path.."/views/error/inspect")
        src = src..debug_src
    end

    if filename ~= nil then
        src = lp.translate(src)
        parms.page = self
        render_page(filepath..".lp",src,parms)
    end
end


-- Redirects to another action or another address
-- route: string, '<controller name>/<action_name>'
-- args: table, vars to be passed in url get style
function Page:redirect(route,args)

    args = args or {}
    if not route:match('^https?://') then
        route = sailor.make_url(route,args)
    end

    if self.r.redirect then
        self.r.redirect(route)
    else

        self.r.headers_out['Location'] = route
        self.r.status = 302
        return self.r.status
    end
end

-- Shows an a trace message on the bottom of the page
-- value: a variable to be inspected
-- [message]: an optional debug message
function Page:inspect(value,message)
    if conf.debug.inspect then
        local inspect
        if not message then
            inspect = value
        else
            inspect = {}
            inspect[message] = value
        end
        table.insert(self.trace,inspect)
    end
end

-- Auxiliary function to open the autogen page for models and CRUDs
-- page: our page object
local function autogen(page)
    local autogen = require "sailor.autogen"

    local src = autogen.gen()
    src = lp.translate(src)
    render_page('sailor/autogen',src,{page=page})
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

    apache_friendly_url(page)

    local route_name = page.GET[conf.sailor.route_parameter]
    -- Encapsulated error function for showing detailed traceback
    -- Needs improvement
    local function error_handler(msg)
        page:write("<pre>"..traceback(msg,2).."</pre>")
    end

    -- If a default static page is configured, run it and prevent routing
    if conf.sailor.default_static then
        xpcall(function () page:render(conf.sailor.default_static) end, error_handler)
        return httpd.OK or page.r.status or 200
    -- If there is a route path, find the correspondent controller/action
    elseif route_name ~= nil and route_name ~= '' then
        local controller, action = match(route_name, "([^/]+)/?([^/]*)")
        if conf.sailor.enable_autogen and controller == "autogen" then
            local res = xpcall(function () autogen(page) end, error_handler)
            return res or httpd.OK
        end
        local route = lfs.attributes (sailor.path.."/controllers/"..controller..".lua")

        if not route then
            -- file not found
            local _, res
            if conf.sailor.default_error404 and conf.sailor.default_error404 ~= '' then
                _, res = xpcall(function () page:render(conf.sailor.default_error404) end, error_handler)
            end
            page.r.status = 404
            return res or page.r.status
       else
            local ctr = require("controllers."..controller)
            page.controller = controller
            -- if no action is specified, defaults to index
            if action == '' then
                action = 'index'
            end
            if(ctr[action] == nil) then
                -- controller does not have an action with this name
                local _, res
                if conf.sailor.default_error404 and conf.sailor.default_error404 ~= '' then
                    _, res = xpcall(function () page:render('../'..conf.sailor.default_error404) end, error_handler)
                end
                page.r.status = 404
                return res or page.r.status
            else
                -- run action
                local _, res = xpcall(function() return ctr[action](page) end, error_handler)
                if res == 404 then
                    _,res = xpcall(function () page:render('../'..conf.sailor.default_error404) end, error_handler)
                end

                return res or httpd.OK or page.r.status or 200
            end
        end
    -- If no route var is defined, run default controller action
    elseif conf.sailor.default_controller and conf.sailor.default_action then
        page.controller = conf.sailor.default_controller
        local ctr = require("controllers."..page.controller)
        local _,res = xpcall(function() return ctr[conf.sailor.default_action](page) end, error_handler)

        return res or httpd.OK or page.r.status or 200
    end
    -- No route specified and no defaults
    return 500
end

-- creates a url string based on friendly url configuration
-- route: string, controller/action or controller
-- params: table, get vars and values. example: {id = 3, color = "blue"}
function sailor.make_url(route,params)
    params = params or {}
    local url = route
    local base_path = ((sailor.r.uri):match('^@?(.-)/index.lua$') or '')
    if base_path ~= '' then
        base_path = base_path..'/'
    end
    if conf.sailor.friendly_urls then
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

-- Creates a sailor model and returns an instantiated object
-- There must be a .lua file with the model's name under /model
-- model_name: string, model's name.
function sailor.new(model_name)
    local model = require "sailor.model"
    local obj = {errors = {}}
    obj["@name"] = model_name
    return sailor.model(model_name):new(obj)
end

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
