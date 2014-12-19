--------------------------------------------------------------------------------
-- sailor.lua, v0.4: core functionalities of the framework
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local conf = require "conf.conf"

sailor = {
    conf = conf.sailor, 
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
function sailor.launch()
    if apr_table ~= nil then 
        -- This is Apache with mod_lua
        -- Sets a handle function to be called by mod_lua
        httpd = apache2
        handle = sailor.handle_request
    else
        -- This is a non-Apache or Apache server with CGILua
        -- Or Apache with mod_pLua
        require "remy"
        httpd = remy.httpd
        remy.init()
        remy.contentheader('text/html')
        remy.run(sailor.handle_request)
    end
end

function sailor.handle_request(r)
    r.content_type = "text/html"
    local page = sailor.init(r)
    return sailor.route(page)
end

-- Encapsulates request_rec functions inside the Page object
-- Useful for posterior compatibility with other servers
-- r: webserver's request object
function sailor.init(r)
    local filename = r.uri:match( "([^/]+)$")
    r.content_type = "text/html"
    sailor.path = r.filename:match("^@?(.-)/"..filename.."$")
    local GET, GETMULTI = r:parseargs()
    local POST, POSTMULTI = {}, {}
    if r.parsebody ~= nil then -- only present in Apache 2.4.3 or higher
        POST, POSTMULTI = r:parsebody()
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
        layout = conf.sailor.layout,
        title = conf.sailor.app_name,
        trace = {}
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
    local incl_src = read_src(sailor.path.."/"..path)

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

    -- If there's a default theme, parse the layout first
    if self.layout ~= nil and self.layout ~= '' then
        self.layout_path = "layouts/"..self.layout
        filepath = sailor.path.."/"..self.layout_path.."/index"
        local layout_src = read_src(filepath)
        local filename_var = "sailor_filename_"..tostring(random(1000))
        local parms_var = "sailor_parms_"..tostring(random(1000))
        -- Then remove layout and continue parsing
        src = gsub(layout_src,"{{content}}",' <? page.layout = nil; page:render('..filename_var..','..parms_var..') ?> ')
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
   
    if conf.debug.inspect and ( (conf.sailor.layout and self.layout) or not conf.sailor.layout )then
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
        local get = ''
        for k,v in pairs(args) do
            get = get.."&"..k.."="..v
        end  
        route = self.r.uri.."?r="..route..get
    end
      
    self.r.headers_out['Location'] = route
    self.r.status = 302
    return self.r.status
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

-- Reads route GET var to decide which controller/action or default page to run.
-- page: Page object with utilitary functions and request
function sailor.route(page)
    local GET = page.r:parseargs()
    local route_name = GET[conf.sailor.route_parameter]
    -- Encapsulated error function for showing detailed traceback
    -- Needs improvement
    local function error_handler(msg)
        page:write("<pre>"..traceback(msg,2).."</pre>")
    end

    -- If a default static page is configured, run it and prevent routing
    if conf.sailor.default_static then
        xpcall(function () page:render(conf.sailor.default_static) end, error_handler)
        return httpd.OK
    -- If there is a route path, find the correspondent controller/action
    elseif route_name ~= nil and route_name ~= '' then
        local controller, action = match(route_name, "([^/]+)/?([^/]*)")
        if conf.sailor.enable_autogen and controller == "autogen" then
            res = xpcall(function () autogen(page) end, error_handler)
            return res or httpd.OK
        end
        local route = lfs.attributes (sailor.path.."/controllers/"..controller..".lua")

        if not route then
            -- file not found
            if conf.sailor.default_error404 and conf.sailor.default_error404 ~= '' then
                local _,res = xpcall(function () page:render(conf.sailor.default_error404) end, error_handler)
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
                if conf.sailor.default_error404 and conf.sailor.default_error404 ~= '' then
                    local _, res = xpcall(function () page:render('../'..conf.sailor.default_error404) end, error_handler)
                end
                page.r.status = 404
                return res or page.r.status 
            else
                -- run action
                local _, res = xpcall(function() return ctr[action](page) end, error_handler)
                if res == 404 then
                    _,res = xpcall(function () page:render('../'..conf.sailor.default_error404) end, error_handler)
                end
                return res or httpd.OK
            end
        end
    -- If no route var is defined, run default controller action
    elseif conf.sailor.default_controller and conf.sailor.default_action then
        page.controller = conf.sailor.default_controller
        local ctr = require("controllers."..page.controller)
        local _,res = xpcall(function() return ctr[conf.sailor.default_action](page) end, error_handler)
        return res or httpd.OK
    end
    -- No route specified and no defaults
    return 500
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
