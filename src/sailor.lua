local conf = require "conf.conf"

sailor = {conf = conf.sailor}

local lp = require "src.lp"
local lfs = require "lfs"
local Page = {}


function sailor.init(r,p)
    local POST, POSTMULTI = r:parsebody()
    local GET, GETMULTI = r:parseargs()
    local page = {
        r = r,
        path = p,
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

local function render(page,filename,src,parms)
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

function Page:include(path,parms)
    local lua_page = assert (io.open (self.path.."/"..path..".lp", "rb"))
    local incl_src = lua_page:read("*all")
    lua_page:close()
    incl_src = lp.translate(incl_src)
    render(self,path,incl_src,parms)
end

function Page:render(filename,parms) 
    local dir = ''
    if self.controller then
        dir = '/'..self.controller
    end

    self.layout_path = "layouts/"..self.layout
    local lua_page = assert (io.open (self.path.."/views"..dir.."/"..filename..".lp", "rb"))
    local layout = assert (io.open (self.path.."/"..self.layout_path.."/index.lp", "rb"))
    local lp_src = lua_page:read("*all")
    local layout_src = layout:read("*all")
    lua_page:close()
    layout:close()

    local src = string.gsub(layout_src,"{{content}}",lp_src)
    src = lp.translate(src)

    render(self,filename,src,parms)
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

    if GET['r'] ~= nil and GET['r'] ~= '' then
        local controller, action = string.match(GET['r'], "(%a+)/?(%a*)")
        local route = lfs.attributes (page.path.."/controllers/"..controller..".lua")

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
                local res = ctr[action](page)
                return res or apache2.OK
            end
        end
    else
        if conf.sailor.default_static then
            page:render(conf.sailor.default_static)
            return apache2.OK
        elseif conf.sailor.default_controller and conf.sailor.default_action then
            page.controller = conf.sailor.default_controller
            local ctr = require("controllers."..page.controller)
            local res = ctr[conf.sailor.default_action](page)
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

