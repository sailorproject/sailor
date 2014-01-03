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

    parms["r"] = response

    setfenv(f,parms)
    f()
end

return sailor
