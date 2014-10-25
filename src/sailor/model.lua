--------------------------------------------------------------------------------
-- model.lua, v0.3: basic model creator, uses db module
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local model = {}
local db = require("sailor.db")

--Warning: this is a tech preview and this model class might or might not avoid SQL injections.
function model:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	self.__index = self
	obj.__newindex = function (table, key, value)
		if key ~= '__newindex' then
			local found = false
			for _,attr in pairs(obj.attributes) do
				if attr == key or attr[key] then
					found = true
				end
			end
			if not found and not obj[key] then
				error(tostring(key).." is not a valid attribute for this model.")
			end
		end
		rawset(table,key,value)
	end
	return obj
end

function model:save()
	local res,err = self:validate()
	if not res then
		return res,err
	end
	local id = self[self.db.key]
	if not id or not self:find(id) then
		return self:insert()
	else
		return self:update()
	end
end

function model:insert()
	db.connect()
	local key = self.db.key
	local attributes = self.attributes

	local attrs = {}
	local values = {}
	for attr,_ in pairs(attributes) do
		table.insert(attrs,attr)
		if not self[attr] then
			table.insert(values,"null")
		elseif type(self[attr]) == 'number' then
			table.insert(values,self[attr])
		else
			table.insert(values,"'"..db.escape(self[attr]).."'")
		end
	end
	local attr_string = table.concat (attrs, ',')
	local value_string = table.concat (values, ',')

	local query = "insert into "..self.db.table.."("..attr_string..") values ("..value_string.."); "
	local id = db.query_insert(query)

	self[self.db.key] = id
	db.close()
	return true
end

function model:update()
	db.connect()
	local attributes = self.attributes
	local key = self.db.key
	local updates = {}
	for attr,_ in pairs(attributes) do
		local string = attr.."="
		if not self[attr] then
			string = string.."null"
		elseif type(self[attr]) == 'number' then
			string = string..self[attr]
		else
			string = string.."'"..db.escape(self[attr]).."'"
		end
		table.insert(updates,string)
	end
	local update_string = table.concat (updates, ', ')
	local query = "update "..self.db.table.." set "..update_string.." where "..key.." = "..db.escape(self[key])..";"

	local u = (db.query(query) ~= 0)
	db.close()
	return u
end

function model:fetch_object(cur)
	local row = cur:fetch ({}, "a")
	cur:close()
	if row then
		local obj = self:new(row)
		return obj
	else
		return false
	end
end

function model:find_by_id(id)
	db.connect()
	local cur = db.query("select * from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';")
	local f = self:fetch_object(cur)
	db.close()
	return f
end

function model:find_by_attributes(attributes)
	db.connect()

	local n = 0
    local where = ' where '
    for k,v in pairs(attributes) do
        if n > 0 then
            where = where..' and '
        end
        v = db.escape(v)
        where = where..k.." = '"..v.."' "
        n = n+1
    end

    local cur = db.query("select * from "..self.db.table..where..";")
	local f = self:fetch_object(cur)
	db.close()
	return f
	
end

function model:find(where_string)
	-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
	db.connect()
	local cur = db.query("select * from "..self.db.table.." where "..where_string..";")
	local f = self:fetch_object(cur)
	db.close()
	return f
end

function model:find_all(where_string)
	-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
	db.connect()
	local key = self.db.key
	if where_string then
		where_string = " where "..where_string
	else
		where_string = ''
	end
	local cur = db.query("select * from "..self.db.table..where_string..";")
	local res = {}
	local row = cur:fetch ({}, "a")
	while row do
		local obj = {}
		for attr,_ in pairs(self.attributes) do 
			obj[attr] = row[attr]
		end
		res[row[key]] = self:new(obj)
		row = cur:fetch (row, "a")
	end
	cur:close()
	db.close()
	return res
end

function model:delete()
	db.connect()
	local id = self[self.db.key]
	if id and self:find(id) then
		local d = (db.query("delete from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';") ~= 0)
		db.close()
		return d
	end
	db.close()
	return false
end

function model:validate()
	local check = true
	local errs = {}

	for _,n in pairs(self.attributes) do 
		
		for attr,rules in pairs(n) do
		
		if rules and rules ~= "safe" then 

			local res, err = rules(self[attr])

			check = check and res
			if not res then
				table.insert(errs,"'"..attr.."' "..tostring(err))
			end
		--[[	local val = validation:new()

			for val_func,args in pairs(rules) do
				val = val[val_func](unpack(args))
			end
			local res, err = val(self[attr])
			check = check and res
			if not res then
				table.insert(errs,"'"..attr.."' "..err)
			end]]
		end
		end
	end
	return check,errs
end

function model:get_post(POST)
	local sub = string.gsub
	local value
	local res = false
	local function apply(attr)
		if not self.attributes[attr] then
			return false, "No attribute '"..attr.."' in model '"..self["@name"]
		end
		self[attr] = value
		res = res or true
	end
	if not next(POST) then return false end
	for k,v in pairs(POST) do
		value = v
   		sub(k,self["@name"]..":(.*)",apply)
   	end
   	return res
end

function model.generate_model(table_name)
	local query = [[SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_name = ']]..table_name..[[';]]

	local code = [[-- Uncomment this to use validation rules
-- local val = require "valua"
local ]]..table_name..[[ = {}

-- Attributes and their validation rules
]]..table_name..[[.attributes = {
	-- {<attribute> = <validation function, valua required>}
	-- Ex. {id = val:new().integer()}
]]

	db.connect()
	local key
	local cur = db.query(query)
	local res = {}
	local row = cur:fetch ({}, "a")
	while row do
		if row.COLUMN_KEY == "PRI" then
			key = row.COLUMN_NAME
		end
		code = code..[[
	]]..row.COLUMN_NAME..[[ = "safe",
]]
		row = cur:fetch (row, "a")
	end
	code = code..[[
}

]]..table_name..[[.db = {
	key = ']]..key..[[',
	table = ']]..table_name..[['
}

return ]]..table_name..[[

]]
	cur:close()
	db.close()
	local file = io.open("models/"..table_name..".lua", "w")
	file:write(code)
	file:close()
end

--[[function model:generate_mysql()
	local query = "create table "..self.db.table.."("

	for attr,rules in pairs(self.attributes) do 
		query = query..attr.." "
		local attr_type
		local not_null = ""
		if attr ~= self.db.key and rules ~= "safe" then
			for rule,parms in pairs(rules) do

				if rule == "integer" or rule == "boolean" then
					attr_type = "int"
				elseif rule == "number" then
					attr_type = "double"
				elseif rule == "email" then
					attr_type = "varchar(255)"
				elseif rule == "date" then
					attr_type = "date"
				elseif rule == "not_empty" then
					not_null = " not null"
				elseif rule == "len" then
					attr_type = "varchar("..parms[2]..")"
				end

			end
		elseif attr == self.db.key then
			attr_type = "int auto_increment primary key"
		end

		if not attr_type then
			attr_type = "text"
		end
		
		query = query..attr_type..not_null..", "
	end

	query = query:sub(1, -3)..");"

	db.connect()
	db.query(query)
	db.close()
end]]

return model
