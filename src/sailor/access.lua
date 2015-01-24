--------------------------------------------------------------------------------
-- access.lua, v0.2.5: controls access of sailor apps
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
--access.default = "demo"
--access.default_pass = "demo"
--access.salt = "sailorisawesome" -- set to nil to use unhashed passwords

local INVALID = "Invalid username or password."

-- Simple hashing algorithm for encrypting passworsd
function access.hash(username, password, salt)
	salt = salt or access.salt
	local hash = username .. password
	-- Check if bcrypt is embedded
	if sailor.conf.bcrypt and salt and sailor.r.htpassword then
		hash = sailor.r:htpassword(salt .. hash, 2, 100) -- Use bcrypt on pwd
		return hash
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
	access.data = session.data
	return not access.data.username
end

function access.grant(data,time)
	session.setsessiontimeout (time or 604800) -- 1 week
	if not data.username then return false end
	access.data = data
	return session.save(data)
end

function access.login(username,password)
	local id
	if not access.default then
		local User = sailor.model("user")
		local u = User:find_by_attributes{
			username=username
			}
		if not u then
			return false, INVALID
		end

		if u.password ~= access.hash(username, password, u.salt) then
			return false, INVALID
		end

		id = u.id
	else
		if username ~= access.default or password ~= access.default_pass then
			return false, INVALID
		end
		id = 1
	end
	
	return access.grant({username=username,id=id})	
end

function access.logout()
	session.destroy(sailor.r)
end

return access
