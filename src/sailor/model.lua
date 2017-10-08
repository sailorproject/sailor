--------------------------------------------------------------------------------
-- model.lua, v0.10.4: basic model creator, uses db module
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local h = require "tests.helper"
local sailor = require "sailor"
local model = {}
local db = require("sailor.db")
local autogen = require ("sailor.autogen")
local util = require "web_utils.utils"

-- Creates a sailor model that can be instantiated in objects with :new()
-- There must be a .lua file with the model's name under /model
-- @param model_name: string, model's name.
-- Usage: local MyModel = require "sailor.model"('my_model')
local o = {__call = function(self,model_name)
	    local obj = require("models."..model_name)
	    obj["@name"] = model_name
	    obj.errors = {}

	    return self:new(obj)
	end
}
setmetatable(model,o)

-- Encapsulates db functions, does not call them if a transaction is going on
-- Assures correct counting of db.close on auto integrity tests
local function db_connect()
	if db.transaction then return end
	db.connect()
end
local function db_close()
	if db.transaction then return end
	db.close()
end

--Warning: this is a tech preview and this model class might or might not avoid SQL injections.
--Attention, OO stuff! Will produce our little pretty objects
function model:new(obj)
	obj = obj or {errors={}}
	obj = util.deepcopy(obj)

	setmetatable(obj,self)
	-- REWRITE
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
-- validate: boolean, default is true, set to false to deactivate validation before saving
function model:save(validate)
	validate = validate == nil or validate -- defaults validation to true
	if validate then
		local res,err = self:validate()
		if not res then
			return res,err
		end
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
		elseif relation.relation == "HAS_ONE" then
			local attributes = {}
			attributes[relation.attribute] = self[self.db.key]
			obj = Model:find_by_attributes( attributes )

		elseif relation.relation == "HAS_MANY" then
			local attributes = {}
			attributes[relation.attribute] = self[self.db.key]
			obj = Model:find_all_by_attributes( attributes )

		elseif relation.relation == "MANY_MANY" then
			db_connect()
			local res = db.query("select "..relation.attributes[2].." from "..relation.table.." where "..relation.attributes[1].."='"..self[self.db.key].."';")
			for _,row in ipairs(res) do
				table.insert(obj,Model:find_by_id(row[relation.attributes[2]]))
			end
			db_close()
		end

		self.loaded_relations[key] = obj
		return obj
	else
		return self.loaded_relations[key]
	end
end

-- (escaped) Inserts our model values in the db table!
function model:insert()
	db_connect()
	local key = self.db.key
	local attrs = {}
	local values = {}
	for _,n in pairs(self.attributes) do
		for attr,_ in pairs(n) do
			if attr ~= self.db.key then
				table.insert(attrs,attr)
				if self[attr] == nil then
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
	end
	local attr_string = table.concat (attrs, ',')
	local value_string = table.concat (values, ',')

	local query = "insert into "..self.db.table.."("..attr_string..") values ("..value_string..")"

	local id = db.query_insert(query,key)
	self[key] = id
	db_close()
	return true
end

-- (escaped) Updates our model values in the db table!
function model:update()
	db_connect()
	local key = self.db.key
	local updates = {}
	for _,n in pairs(self.attributes) do
		for attr,_ in pairs(n) do
			local string = attr.."="
			if self[attr] == nil then
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
	db_close()
	return u
end

-- (escaped) Finds objects with the given id
function model:find_by_id(id)
	if not id then return nil end
	db_connect()
	local res = db.query("select * from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';")
	db_close()

	if res and next(res) then return sailor.model(self["@name"]):new(res[1]) end
	return false
end

-- build 'where' part of query based on attribute table
local function build_attributes_query(attributes)
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

    return where
end

-- (escaped) Finds one object with the given attributes
-- attributes: table, Example {name='joao',age = 26}
-- Might need a refactor to include other comparisons such as LIKE, > etc.
function model:find_by_attributes(attributes)
	db_connect()
	local where = build_attributes_query(attributes)
    local res = db.query("select * from "..self.db.table..where.." limit 1;")
	db_close()

	if res and next(res) then return sailor.model(self["@name"]):new(res[1]) end
	return false
end

-- (escaped) Finds all objects with the given attributes
-- attributes: table, Example {name='joao',age = 26}
-- Might need a refactor to include other comparisons such as LIKE, > etc.
function model:find_all_by_attributes(attributes)
	db_connect()
	local where = build_attributes_query(attributes)
    local res = db.query("select * from "..self.db.table..where..";")
	db_close()

	if res and next(res) then
		local objects = {}
		for _,r in pairs(res) do
			objects[#objects+1] = sailor.model(self["@name"]):new(r)
		end
		return objects
	end
	return false
end

-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
-- Finds an object based on the given part of the SQL query after the WHERE
-- Returns the object found or nil
function model:find(where_string)
	db_connect()
	local res = db.query("select * from "..self.db.table.." where "..where_string..";")
	db_close()

	if res and next(res) then return sailor.model(self["@name"]):new(res[1]) end
	return false
end

-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
-- Finds all objects based on the given part of the SQL query after the WHERE
-- Returns a table containing all objects found or empty table
function model:find_all(where_string)
	db_connect()
	if where_string then
		where_string = " where "..where_string
	else
		where_string = ''
	end
	local res = db.query("select * from "..self.db.table..where_string..";")
	db_close()
	if not res then return {} end

	for k,_ in ipairs(res) do
		res[k] = sailor.model(self["@name"]):new(res[k])
	end
	return res
end

-- (escaped) Deletes our object on db
function model:delete()
	db_connect()
	local id = self[self.db.key]
	--if id and self:find_by_id(id) then
		local d = (db.query("delete from "..self.db.table.." where "..self.db.key.."='"..db.escape(id).."';") ~= 0)
		db_close()
		return d
	--end
	--db_close()
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
	local f=io.open("models/"..model_name..".lua","r")
	if f == nil then
   		error("The model '"..model_name.."'does not exist")
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
	db_connect()

	if not db.table_exists(table_name)  then
		db:close()
		error("The table '"..table_name.."' does not exist.")
   	else


		local code = [[-- Uncomment this to use validation rules
-- local val = require "valua"
local M = {}

-- Attributes and their validation rules
M.attributes = {
	-- {<attribute> = <validation function, valua required>}
	-- Ex. {id = val:new().integer()}
]]


		local collumns,key = db.get_columns(table_name)
		db_close()

		for _,col in ipairs(collumns) do

			code = code..[[
	{ ]]..col..[[ = "safe" },
]]
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

		local file = assert(io.open("models/"..table_name..".lua", "w"))
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

	db_connect()
	db.query(query)
	db_close()
end]]

-- Gets the amount of stored objects
function model:count()
	db_connect()
	local res = db.query_one("select count(*) from "..self.db.table..";")
	db_close()
	return tonumber(res)
end

return model
