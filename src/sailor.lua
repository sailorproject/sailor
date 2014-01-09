sailor = {
    conf = require "conf.conf",
    db = require "src.db"
}

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
        write = function(_,...) r:write(...) end,
        POST = POST,
        GET = GET
    }

    lp.setoutfunc("r:puts")

    return page
end

function Page:render(filename,parms) 
    local fh = assert (io.open (self.path.."/views/"..filename..".lp", "rb"))
    local src = fh:read("*all")
    fh:close()

    local string = lp.translate(src)
    
    local f = loadstring(string)
    if not parms then
    	parms = {}
    end

    parms.r = self.r

    setfenv(f,parms)
    f()
end

function sailor.route(page)
    local GET, GETMULTI = page.r:parseargs()

    if GET['r'] ~= nil and GET['r'] ~= '' then
        local controller, action = string.match(GET['r'], "(%a+)/?(%a*)")
        local route = lfs.attributes (page.path.."/controllers/"..controller..".lua")

        if not route then
             page.r:write("error 404")       
        else
            local ctr = require("controllers."..controller)

            if action == '' then
                action = 'index'
            end
            if(ctr[action] == nil) then 
                page.r:write('error 404')
            else
                ctr[action](page)
            end
        end
    else
        page:render('default')
    end

end

function sailor.new(model)
    local obj = require("models."..model):new()
    return obj
end



