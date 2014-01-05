local sailor = {}
local lp = require "lp"
local response
local path

function sailor.init(r,p)
    response = r
    path = p
    lp.setoutfunc("r:puts")
end

function sailor.render(filename,parms) 
    local fh = assert (io.open (path.."/views/"..filename..".lp", "rb"))
    local src = fh:read("*all")
    fh:close()

    local string = lp.translate(src)
    
    local f = loadstring(string)
    if not parms then
    	parms = {}
    end

    parms.r = response

    setfenv(f,parms)
    f()
end

function sailor.route()
    local GET, GETMULTI = response:parseargs()
    local action, controller
    if GET['r'] ~= nil and GET['r'] ~= '' then
        controller, action = string.match(GET['r'], "(%a+)/?(%a*)")
        local route = lfs.attributes (path.."/controllers/"..controller..".lua")

        if not route then
             response:write("error 404")       
        else
            local ctr = require(controller)
            if action == '' then
                action = 'index'
            end
            if(ctr[action] == nil) then 
                response:write('error 404')
            else
                ctr[action]()     
            end
        end
    else
        sailor.render('default')
    end

end

return sailor
