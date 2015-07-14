--------------------------------------------------------------------------------
-- access.lua, v0.3: controls user login on sailor apps
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local sailor = require "sailor"
local session = require "sailor.session"
local access = {}

session.open(sailor.r)

local INVALID = "Invalid username or password."

local settings = {
	default_login = 'admin',	    -- Default login details
	default_password = 'demo',
	grant_time = 604800, 			-- 1 week
	model = nil,					-- Setting this field will deactivate default login details and activate below fields
	login_attributes = {'username'},-- Allows multiple options, for example, username or email. The one used to hash the
	password_attribute = 'password',--     password should come first.
	salt_attribute = 'salt',
	hashing = true
}

-- Changes settings
function access.settings(s)
	for k, v in pairs(s) do
		settings[k] = v
	end
end

-- Simple hashing algorithm for encrypting passworsd
function access.hash(username, password, salt)
	if not settings.hashing then return password end
	local hash = username .. password
	salt = salt or ''

	-- Check if bcrypt is embedded
	if sailor.conf.bcrypt and sailor.r.htpassword then
		hash = sailor.r:htpassword(salt .. hash, 2, 100) -- Use bcrypt on pwd
		return hash
	-- If not, fall back to sha1 hashing
	else
		if sailor.r.sha1 then
			for i = 1, 500 do
				hash = sailor.r:sha1(salt .. hash)
			end
		end
	end
	return hash
end


function access.is_guest()
	if not access.data then
		access.data = session.data
	end
	return not access.data.login
end

function access.grant(data,time)
	session.setsessiontimeout (time or 604800) -- 1 week
	if not data.login then return false end
	access.data = data
	return session.save(data)
end

function access.find_model(login)
	local Model = sailor.model(settings.model)
	local m
	for _, attr in pairs(settings.login_attributes) do
		local a = {}
		a[attr] = login
		m = Model:find_by_attributes(a)
		if m ~= nil then return m end
	end
	return false
end

function access.login(login,password)
	local id
	if settings.model then
		local model = access.find_model(login)
		if not model then
			return false, INVALID
		end

		if model.password ~= access.hash(model[settings.login_attributes[1]], password, model[settings.salt_attribute]) then
			return false, INVALID
		end

		id = model.id
	else
		if login ~= settings.default_login or password ~= settings.default_password then
			return false, INVALID
		end
		id = 1
	end
	return access.grant({login=login,id=id})
end


function access.logout()
	session.data = {}
	access.data = {}
	return session.destroy(sailor.r)
end

return access
