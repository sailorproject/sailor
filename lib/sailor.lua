local s = {}
local lp = require "lp"
local request
local path

function s.init(r,p)
	response = r
	path = p
	lp.setoutfunc("r:puts")
end

function s.render(filename,parms) 
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

return s
