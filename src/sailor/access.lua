--------------------------------------------------------------------------------
-- access.lua, v0.2: controls access of sailor apps
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local session = require "sailor.session"
local access = {}

session.open(sailor.r)

-- Uncomment to login with "demo" / "demo"
-- Comment to login through db (user model)
local default = "demo"
local default_pass = "demo"
local salt = "sailorisawesome" -- uncomment to use unhashed passwords

local INVALID = "Invalid username or password."

-- Simple hashing algorithm for encrypting passworsd
function access.hash(username, password)
	local hash = username .. password
	-- Check if bcrypt is embedded
	if sailor.r.htpassword then
		return sailor.r:htpassword(hash, 2, 100) -- Use bcrypt on pwd
		
	-- If not, fall back to sha1 hashing
	else
		if salt and sailor.r.sha1 then
			for i = 1, 500 do
				hash = sailor.r:sha1(salt .. hash)
			end
		end
	end
	return hash
end


function access.is_guest()
	return not session.data.username
end

function access.grant(data,time)
	session.setsessiontimeout (time or 604800) -- 1 week
	if not data.username then return false end
	return session.save(data)
end

function access.login(username,password)
	local id
	if not default then
		local User = sailor.model("user")
		local u = User:find_by_attributes{
			username=username,
			password=access.hash(username, password)
			}
		if not u then
			return false, INVALID
		end
		id = u.id
	else
		if username ~= default or password ~= default_pass then
			return false, INVALID
		end
		id = 1
	end
	access.grant({username=username,id=id})	
	return true
end

function access.logout()
	session.destroy(sailor.r)
end

return access
