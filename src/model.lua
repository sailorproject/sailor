local model = {}
local db = require "src.db"

function model:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	self.__index = self
	obj.__newindex = function (table, key, value)
		if key ~= '__newindex' then
			if  not obj.attributes[key] and not obj[key] then
				error(tostring(key).." is not a valid attribute for this model.")
			elseif type(value) ~= obj.attributes[key] and type(value) ~= type(obj[key]) then
				error("Attribute "..tostring(key).." should be of type "..tostring(obj.attributes[key])..".")
			end
		end
		rawset(table,key,value)
	end
	return obj
end

function model:save()
	local id = self[self.db.key]
	if not id or not self:find(id) then
		return self:insert()
	else
		return self:update()
	end
end

function model:insert()
	local key = self.db.key
	local attributes = self.attributes

	local attrs = {}
	local values = {}
	for attr,attr_type in pairs(attributes) do
		table.insert(attrs,attr)
		if not self[attr] then
			table.insert(values,"null")
		elseif attr_type == 'number' then
			table.insert(values,self[attr])
		else
			table.insert(values,"'"..self[attr].."'")
		end
	end
	local attr_string = table.concat (attrs, ',')
	local value_string = table.concat (values, ',')

	local query = "insert into "..self.db.table.."("..attr_string..") values ("..value_string.."); "
	local query_id = "select @@IDENTITY as id;"
	local cur = db.query_query(query,query_id)
	local row = cur:fetch ({},"a")
	cur:close()
	if row then
		if self.attributes[self.db.key] == 'number' then
			row.id = tonumber(row.id)
		end
		self[self.db.key] = row.id
	else
		return false
	end

	return true
end

function model:update()
	local attributes = self.attributes
	local key = self.db.key
	local updates = {}
	for attr,attr_type in pairs(attributes) do
		local string = attr.."="
		if not self[attr] then
			string = sting.."null"
		elseif attr_type == 'number' then
			string = string..self[attr]
		else
			string = string.."'"..self[attr].."'"
		end
		table.insert(updates,string)
	end
	local update_string = table.concat (updates, ', ')
	local query = "update "..self.db.table.." set "..update_string.." where "..key.." = '"..self[key].."';"

	return (db.query(query) ~= 0)
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
	local cur = db.query("select * from "..self.db.table.." where "..self.db.key.."='"..id.."';")
	return self:fetch_object(cur)
end

function model:find(where_string)
	local cur = db.query("select * from "..self.db.table.." where "..where_string..";")
	return self:fetch_object(cur)
end

function model:find_all(where_string)
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
	return res
end

return model


