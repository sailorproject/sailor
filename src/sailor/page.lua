--------------------------------------------------------------------------------
-- page.lua, v0.3 - The Page object
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local sailor = require "sailor"
local conf = require "conf.conf"
local lp = require "web_utils.lp_ex"

local open,assert,loadstring,setfenv,load,random = io.open,assert,loadstring,setfenv,load,math.random
local match,tostring,gsub = string.match,tostring,string.gsub

local M = {}

local Page = {
	-- These values are set on sailor.init passed to page.new. 
	-- Here only for reference.
	r = nil, -- request (varies a lot upon server used)
    write = nil,
    print = nil,
    GET = nil,
    POST = nil,
    POSTMULTI = nil,
    base_path = nil
}

-- Prepares the page object
-- @param obj table: table with some useful functions established by sailor
-- returns page object
function M.new(obj)
	obj = obj or {}
	for k,v in pairs(obj) do
		Page[k] = v
	end

    Page.trace = {} -- used for page.inspect
    Page.theme = conf.sailor.theme
    Page.layout = conf.sailor.layout
    Page.title = conf.sailor.app_name

	return Page
end

-- Aux function
-- Renders a previously read and parsed .lp file
-- path: string for debug purposes, shown on error messages
-- parms: table, the parameters being passed ahead to the rendered page
-- src: the parsed string
local function render_page(path,parms,src)
    local f
    if _VERSION == "Lua 5.1" then
        f = assert(loadstring(src,'@'..path))
        local env = getfenv(f)
        for k,v in pairs(parms) do env[k] = v end
        setfenv(f,env)
    else
        for k,v in pairs(_G) do parms[k] = v end
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
    render_page(path,parms,incl_src)
end


-- Renders a view from a controller action
-- filename: string, filename without ".lp". The file must be inside /views/<controller name>
-- parms: table, vars being passed ahead.
function Page:render(filename,parms,src)
    parms = parms or {}
    if src ~= nil then return render_page(filename,parms,src) end -- shortcut for autogen module

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
        local dir = self.controller_view_path or 'views'
        -- filename is nil if the controller script is missing in /controllers/
        -- ToDo: print error informing about missing controller?
        if filename ~= nil then
            filepath = sailor.path..'/'..dir..'/'..filename
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
        render_page(filepath..".lp",parms,src)
    end
end


-- Redirects to another action or another address
-- route: string, '<controller name>/<action_name>'
-- args: table, vars to be passed in url get style
function Page:redirect(route,args)
    args = args or {}
    if not route:match('^https?://') then
        route = self:make_url(route,args)
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

-- Pretty printing
-- @param val: variable to be pretty printed
-- @param indent: optional, initial indentation
-- @param sep: optional, default: &nbsp;, the separator for indentation
-- @param ln: optional, default: <br/>, the separator for new lines
-- @param inspect: string, the string where the pretty printed is constructed recursively
-- @return: string: the string to be printed
function Page:tostring (val, indent, sep, ln, inspect)
    indent = indent or 0
    inspect = inspect or ''
    sep = sep or '&nbsp;'
    ln = ln or "<br/>"

    if type(val) ~= "table" then
        inspect = inspect .. tostring(val)
    else
        for k, v in pairs(val) do
            if(k ~= "__newindex") then
                local formatting = ln..string.rep(sep, indent) .. k .. ": "
                inspect = inspect.. formatting 
                inspect = self:tostring(v, indent+8, sep, ln, inspect)    
            end
        end
    end
    return inspect
end

-- creates a url string based on friendly url configuration
-- route: string, controller/action or controller
-- params: table, get vars and values. example: {id = 3, color = "blue"}
function Page:make_url(route,params)
    params = params or {}
    local url = route
    local base_path = self.base_path
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

-- Sends variables to the browser virtual machine
-- Only available to Starlight VM
-- @param var_table, table: Containes the variable(s) to be sent
--    E.g. page:to_browser{x="Harry",y="Wizard"}
-- Important: Does not convert functions. Only numbers, strings and tables.
-- Functions will be assigned nil
local function to_string(var)
    if type(var) == 'number' then
        return var
    elseif type(var) == 'string' then
        return "'".. var .."'"
    elseif type(var) == 'table' then
        local code = {}
        for k,v in pairs(var) do
            if type(k)=='number' then k = '['..k..']' end
            table.insert(code,k..'='..to_string(v))
        end
        return '{'..table.concat(code,',')..'}'
    end
    return 'nil'
end

function Page:to_browser(var_table)
    if conf.lua_at_client.vm ~= "starlight" then
        error("page:to_browser is not yet supported by the current Lua->JS virtual machine. Please switch to Starlight if you need this feature.")
    end
    local vm = require("latclient.starlight")

    local code = {}
    for name, var in pairs(var_table) do
        table.insert(code, " "..name.." = "..to_string(var))
    end
    code = table.concat(code,"\n")
    local client_code = vm.get_client_js(code)
    render_page('',{},lp.translate(client_code,true))
end

return M
