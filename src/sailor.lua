sailor = {}



local lp = require "src.lp"
local lfs = require "lfs"
local Page = {}
local conf = require "conf.conf"

function sailor.init(r,p)
    local POST, POSTMULTI = r:parsebody()
    local GET, GETMULTI = r:parseargs()
    local page = {
        r = r,
        path = p,
        render = Page.render,
        write = function(_,...) r:write(...) end,
        puts = function(_,...) r:puts(...) end,
        POST = POST,
        GET = GET
    }

    lp.setoutfunc("page:puts")

    return page
end

function Page:render(filename,parms) 
    local dir = ''
    if self.controller then
        dir = '/'..self.controller
    end

    local fh = assert (io.open (self.path.."/views"..dir.."/"..filename..".lp", "rb"))
    local src = fh:read("*all")
    fh:close()

    local string = lp.translate(src)

    if not parms then
        parms = {}
    end

    parms.page = self

    local f
    if _VERSION == "Lua 5.1" then 
        f = loadstring(string,'@'..filename)
        setfenv(f,parms)
    else
        f = load(string,'@'..filename,'t',parms)
    end

    f()
end

function sailor.route(page)
    local GET, GETMULTI = page.r:parseargs()

    if GET['r'] ~= nil and GET['r'] ~= '' then
        local controller, action = string.match(GET['r'], "(%a+)/?(%a*)")
        local route = lfs.attributes (page.path.."/controllers/"..controller..".lua")

        if not route then
            return false
        else
            local ctr = require("controllers."..controller)
            page.controller = controller

            if action == '' then
                action = 'index'
            end
            if(ctr[action] == nil) then 
                return false
            else
                ctr[action](page)
                return true
            end
        end
    else
        if conf.sailor.default_static then
            page:render(conf.sailor.default_static)
            return true
        elseif conf.sailor.default_controller and conf.sailor.default_action then
            page.controller = conf.sailor.default_controller
            local ctr = require("controllers."..page.controller)
            ctr[conf.sailor.default_action](page)
            return true
        end
    end
    return false
end

function sailor.new(model)
    return sailor.model(model):new()
end

function sailor.model(model)
    local model = require("models."..model)
    return model
end

