local conf = require "conf.conf"

sailor = {
    conf = conf.sailor, 
}

local lp = require "src.web_utils.lp"
local lfs = require "lfs"
local Page = {}


function sailor.init(r,p)
    sailor.path = p

    local POST, POSTMULTI = r:parsebody()
    local GET, GETMULTI = r:parseargs()
    local page = {
        r = r,
        render = Page.render,
        redirect = Page.redirect,
        include = Page.include,
        write = function(_,...) r:write(...) end,
        print = function(_,...) r:puts(...) end,
        POST = POST,
        GET = GET,
        POSTMULTI = POSTMULTI,
        layout = conf.sailor.layout,
        title = conf.sailor.app_name,
    }

    lp.setoutfunc("page:print")

    return page
end


local function render_page(page,filename,src,parms)
    parms = parms or {}
    parms.page = page

    for k,v in pairs(_G) do parms[k] = v end

    local f
    if _VERSION == "Lua 5.1" then 
        f = loadstring(src,'@'..filename)
        setfenv(f,parms)
    else
        f = load(src,'@'..filename,'t',parms)
    end

    f()
end

local function read_src(path)
    local lua_page = assert (io.open (path..".lp", "rb"))
    local src = lua_page:read("*all")
    lua_page:close()
    return src
end

function Page:include(path,parms)
    local incl_src = read_src(sailor.path.."/"..path)
    incl_src = lp.translate(incl_src)
    render_page(self,path,incl_src,parms)
end

function Page:render(filename,parms)
    parms = parms or {} 
    
    local src
    local filepath

    if self.layout ~= nil and self.layout ~= '' then
        self.layout_path = "layouts/"..self.layout
        filepath = sailor.path.."/"..self.layout_path.."/index"
        local layout_src = read_src(filepath)
        local filename_var = "sailor_filename_"..tostring(math.random(1000))
        local parms_var = "sailor_parms_"..tostring(math.random(1000))
        src = string.gsub(layout_src,"{{content}}",' <? page.layout = nil; page:render('..filename_var..','..parms_var..') ?> ')
        parms[filename_var] = filename
        parms[parms_var] = parms
    else
        local dir = ''
        if self.controller then
            dir = '/'..self.controller
        end
        filepath = sailor.path.."/views"..dir.."/"..filename
        src = read_src(filepath)
    end

    src = lp.translate(src)
    render_page(self,filepath..".lp",src,parms)
end

function Page:redirect(route,args)
    local get = ''
    for k,v in pairs(args) do
        get = get.."&"..k.."="..v
    end    
    self.r.headers_out['Location'] = self.r.uri.."?r="..route..get
    return apache2.HTTP_MOVED_TEMPORARILY
end

function sailor.route(page)
    local GET = page.r:parseargs()
    local function error_handler(msg)
        page:write("<pre>"..debug.traceback(msg,2).."</pre>")
    end

    if GET['r'] ~= nil and GET['r'] ~= '' then
        local controller, action = string.match(GET['r'], "(%a+)/?(%a*)")
        local route = lfs.attributes (sailor.path.."/controllers/"..controller..".lua")

        if not route then
            return 404
        else
            local ctr = require("controllers."..controller)
            page.controller = controller

            if action == '' then
                action = 'index'
            end
            if(ctr[action] == nil) then 
                return 404
            else
                local res = xpcall(function() ctr[action](page) end, error_handler)
                return res or apache2.OK
            end
        end
    else
        if conf.sailor.default_static then
            xpcall(function () page:render(conf.sailor.default_static) end, error_handler)
            return apache2.OK
        elseif conf.sailor.default_controller and conf.sailor.default_action then
            page.controller = conf.sailor.default_controller
            local ctr = require("controllers."..page.controller)
            local res = xpcall(function() ctr[conf.sailor.default_action](page) end, error_handler)
            return res or apache2.OK
        end
    end
    return 404
end

function sailor.new(model)
    local obj = {}
    obj["@name"] = model
    return sailor.model(model):new(obj)
end

function sailor.model(model)
    local obj = require("models."..model)
    obj["@name"] = model
    return obj
end
