--------------------------------------------------------------------------------
-- model.lua, v0.5.1: basic model creator, uses db module
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local model = {}
local db = require("sailor.db")
local autogen = require ("sailor.autogen")

--Warning: this is a tech preview and this model class might or might not avoid SQL injections.
--Attention, OO stuff! Will produce our little pretty objects
function model:new(obj)
	obj = obj or {errors={}}

	setmetatable(obj,self)
	self.__index = function (table, key)
		if key ~= "attributes" and key ~= "@name" and key ~= "relations" and key ~= "loaded_relations" and key ~= "db" and not model[key] and key ~= "errors" then
			if obj.relations and obj.relations[key] then
				self[key] = table:get_relation(key)
			end
		end
		return self[key]
	end
	obj.__newindex = function (table, key, value)
		if key ~= '__newindex'  and  key ~= '__index' and key ~= 'loaded_relations' then
			local found = false
			for _,attrs in pairs(obj.attributes) do 
				if attrs[key] then
					found = true
				end
			end
			if obj.relations and obj.relations[key] then
				found = true
			end
			if not found and not obj[key] then
				error(tostring(key).." is not a valid attribute for this model.")
			end
		end
		rawset(table,key,value)
	end
	return obj
end

-- saves our object
-- if the object is a new object, it will insert values in our table,
-- otherwise it updates them.
function model:save() 
	local res,err = self:validate()
	if not res then
		return res,err
	end
	local id = self[self.db.key]
	if not id or not self:find_by_id(id) then
		return self:insert()
	else
		return self:update()
	end
end

-- Based on the relations set for our model,
-- this function will search the related objects
-- (might be better to make this not automatic in the future?)
function model:get_relation(key)
	local relation = self.relations[key]
	self.loaded_relations = self.loaded_relations or {}
	if not self.loaded_relations[key] then
		local Model = sailor.model(relation.model)
		local obj = {}

		if relation.relation == "BELONGS_TO" then
			obj = Model:find_by_id(self[relation.attribute])
			local attr = relation.attribute
		elseif relation.relation == "HAS_ONE" then
			local attributes = {}
			attributes[relation.attribute] = self[self.db.key]
			obj = Model:find_by_attributes( attributes )

		elseif relation.relation == "HAS_MANY" then
			obj = Model:find_all(relation.attribute..' = '..self[self.db.key])

		elseif relation.relation == "MANY_MANY" then
			db.connect()
			local cur = db.query("select "..relation.attributes[2].." from "..relation.table.." where "..relation.attributes[1].."='"..self[self.db.key].."';")
			local res = {}
			local row = cur:fetch ({}, "a")
			while row do
				table.insert(obj,Model:find_by_id(row[relation.attributes[2]]))
				row = cur:fetch (row, "a")
			end
			cur:close()
			db.close()
		end


		self.loaded_relations[key] = obj 
		return obj
	else
		return self.loaded_relations[key]
	end
end	

-- (escaped) Inserts our model values in the db table!
function model:insert()
	db.connect()
	local key = self.db.key
	local attributes = self.attributes

	local attrs = {}
	local values = {}
	for _,n in pairs(self.attributes) do 
		for attr,_ in pairs(n) do
			table.insert(attrs,attr)
			if not self[attr] then
				table.insert(values,"null")
			elseif type(self[attr]) == 'number' then
				table.insert(values,self[attr])
			elseif type(self[attr]) == 'boolean' then
				table.insert(values,tostring(self[attr]))
			else
				table.insert(values,"'"..db.escape(self[attr]).."'")
			end
		end
	end
	local attr_string = table.concat (attrs, ',')
	local value_string = table.concat (values, ',')

	local query = "insert into "..self.db.table.."("..attr_string..") values ("..value_string..")"

	local id = db.query_insert(query)

	self[self.db.key] = id
	db.close()
	return true
end

-- (escaped) Updates our model values in the db table!
function model:update()
	db.connect()
	local attributes = self.attributes
	local key = self.db.key
	local updates = {}
	for _,n in pairs(self.attributes) do 
		for attr,_ in pairs(n) do
			local string = attr.."="
			if not self[attr] then
				string = string.."null"
			elseif type(self[attr]) == 'number' then
				string = string..self[attr]
			elseif type(self[attr]) == 'boolean' then
				string = string..tostring(self[attr])
			else
				string = string.."'"..db.escape(self[attr]).."'"
			end
			table.insert(updates,string)
		end
	end
	local update_string = table.concat (updates, ', ')
	local query = "update "..self.db.table.." set "..update_string.." where "..key.." = "..db.escape(self[key])..";"

	local u = (db.query(query) ~= 0)
	db.close()
	return u
end

-- Reads the cursor information after reading from db and turns it into an object
function model:fetch_object(cur)
	local row = cur:fetch ({}, "a")
	cur:close()
	if row then
		local obj = sailor.model(self["@name"]):new(row)
		return obj
	else
		return false
	end
end

-- (escaped) Finds objects with the given id
function model:find_by_id(id)
	if not id then return nil end
	db.connect()

	local cur = db.query("select * from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';")
	local f = self:fetch_object(cur)
	db.close()
	return f
end

-- (escaped) Finds objects with the given attributes
-- attributes: table, Example {name='joao',age = 26}
-- Might need a refactor to include other comparisons such as LIKE, > etc.
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

-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
-- Finds an object based on the given part of the SQL query after the WHERE
-- Returns the object found or nil
function model:find(where_string)
	db.connect()
	local cur = db.query("select * from "..self.db.table.." where "..where_string..";")
	local f = self:fetch_object(cur)
	db.close()
	return f
end

-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
-- Finds all objects based on the given part of the SQL query after the WHERE
-- Returns a table containing all objects found or empty table
function model:find_all(where_string)
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
		for _,n in pairs(self.attributes) do 
			for attr,_ in pairs(n) do
				obj[attr] = row[attr]
			end
		end
		table.insert(res,self:new(obj))
		row = cur:fetch (row, "a")
	end
	cur:close()
	db.close()
	return res
end

-- (escaped) Deletes our object on db
function model:delete()
	db.connect()
	local id = self[self.db.key]
	--if id and self:find_by_id(id) then
		local d = (db.query("delete from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';") ~= 0)
		db.close()
		return d
	--end
	--db.close()
	--return false
end

-- Verifies if object attributes comply to specified rules on model
function model:validate()
	local check = true
	local errs = {}

	for _,n in pairs(self.attributes) do 
		for attr,rules in pairs(n) do
			if rules and rules ~= "safe" then 
				local res, err = rules(self[attr])

				check = check and res
				if not res then
					errs[attr] = attr.." "..tostring(err)
				end
			end
		end
	end
	self.errors = errs
	return check,errs
end

-- Will read POST and search for information sent via sailor's form model and applies to object
function model:get_post(POST)
	local sub = string.gsub
	local value = nil
	local function apply(attr)
		self[attr] = value
	end
	if not POST or not next(POST) then return false end
	for k,v in pairs(POST) do
		if type(v) == "table" then
			value = v[#v]
		elseif tonumber(v) ~= nil then
			value = tonumber(v)
		elseif v ~= "" then
			value = tostring(v)
		else
			value = nil
		end
   		sub(k,self["@name"]..":(.*)",apply)
   	end
   	return true
end

-- Generates a CRUD based on the given model, model must already exist
-- model_name: string, the name of the model
function model.generate_crud(model_name)
	local f=io.open(sailor.path.."/models/"..model_name..".lua","r")
	if f == nil then 
   		error("The model '"..model_name.."'does not exist") 
   		return false 
   	else
   		io.close(f)

		local success = true
		local model = sailor.model(model_name)
		success = success and autogen.generate_controller(model)
		success = success and autogen.generate_index(model)
		success = success and autogen.generate_view(model)
		success = success and autogen.generate_create(model)
		success = success and autogen.generate_update(model)

		return success
	end
end

-- Generates a model based on a given table
-- table_name, the name of the table
function model.generate_model(table_name)
	db.connect()
	local check_query = [[SHOW TABLES LIKE ']]..table_name..[[';]]
	local cur = db.query(check_query)
	local row = cur:fetch ({}, "a")
	if not row then
		db:close()
		cur:close()
		error("The table '"..table_name.."' does not exist.")
		return false
   	else
		local query = [[SELECT *
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_name = ']]..table_name..[[';]]

		local code = [[-- Uncomment this to use validation rules
-- local val = require "valua"
local M = {}

-- Attributes and their validation rules
M.attributes = {
	-- {<attribute> = <validation function, valua required>}
	-- Ex. {id = val:new().integer()}
]]

		
		local key
		cur = db.query(query)
		local res = {}
		row = cur:fetch ({}, "a")
		while row do
			if row.COLUMN_KEY == "PRI" then
				key = row.COLUMN_NAME
			end
			code = code..[[
	{ ]]..row.COLUMN_NAME..[[ = "safe" },
]]
			row = cur:fetch (row, "a")
		end
		code = code..[[
}

M.db = {
	key = ']]..key..[[',
	table = ']]..table_name..[['
}

M.relations = {}

return M

]]
		cur:close()
		db.close()
		local file = io.open("models/"..table_name..".lua", "w")
		if file:write(code) then
			file:close()
			return true
		end
		return false
	end
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
