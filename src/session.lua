local utils = require "src.web_utils.utils"
local session = require "src.web_utils.session"
local cookie = require "src.cookie"
local ID_NAME = "SAILORSESSID"

session.id = nil
session.setsessiondir (sailor.path..'/runtime')

function session.open (r)
	local id = cookie.get(r,ID_NAME )
    if not id then
        session.new(r)
    else
        session.data = session.load(id)
        if session.data then
        	session.id = id
        else
            session.new(r)
        end
    end
    
	session.cleanup()
	return id
end

function session.destroy (r)
	local id = session.id or cookie.get(r,ID_NAME )
	if id then
		session.data = {}
		session.delete (id)
	end
end

local new = session.new
function session.new(r)	
	session.id = new()
	session.data = {}
    cookie.set(r,ID_NAME,session.id)
end

local save = session.save
function session.save(data)
	save(session.id,data)
	session.data = data
end

return session
