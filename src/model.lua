local model = {}
local validation = require "src.validation"

--Warning: this is a tech preview and this model class might or might not avoid SQL injections.
function model:new(obj)
	obj = obj or {}
	setmetatable(obj,self)
	self.__index = self
	obj.__newindex = function (table, key, value)
		if key ~= '__newindex' then
			if  not obj.attributes[key] and not obj[key] then
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
	local db = require("src.db"):new()
	db:connect()
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
			table.insert(values,"'"..db:escape(self[attr]).."'")
		end
	end
	local attr_string = table.concat (attrs, ',')
	local value_string = table.concat (values, ',')

	local query = "insert into "..self.db.table.."("..attr_string..") values ("..value_string.."); "
	local id = db:query_insert(query)

	self[self.db.key] = id
	db:close()
	return true
end

function model:update()
	local db = require("src.db"):new()
	db:connect()
	local attributes = self.attributes
	local key = self.db.key
	local updates = {}
	for attr,_ in pairs(attributes) do
		local string = attr.."="
		if not self[attr] then
			string = sting.."null"
		elseif type(self[attr]) == 'number' then
			string = string..self[attr]
		else
			string = string.."'"..db:escape(self[attr]).."'"
		end
		table.insert(updates,string)
	end
	local update_string = table.concat (updates, ', ')
	local query = "update "..self.db.table.." set "..update_string.." where "..key.." = "..db:escape(self[key])..";"

	local u = (db:query(query) ~= 0)
	db:close()
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
	local db = require("src.db"):new()
	db:connect()
	local cur = db:query("select * from "..self.db.table.." where "..self.db.key.."='"..db:escape(id).."';")
	local f = self:fetch_object(cur)
	db:close()
	return f
end

function model:find_by_attributes(attributes)
	local db = require("src.db"):new()
	db:connect()

	local n = 0
    local where = ' where '
    for k,v in pairs(attributes) do
        if n > 0 then
            where = where..' and '
        end
        v = db:escape(v)
        where = where..k.." = '"..v.."' "
        n = n+1
    end

    local cur = db:query("select * from "..self.db.table..where..";")
	local f = self:fetch_object(cur)
	db:close()
	return f
	
end

function model:find(where_string)
	-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
	local db = require("src.db"):new()
	db:connect()
	local cur = db:query("select * from "..self.db.table.." where "..where_string..";")
	local f = self:fetch_object(cur)
	db:close()
	return f
end

function model:find_all(where_string)
	-- NOT ESCAPED, DONT USE IT UNLESS YOU WROTE THE WHERE STRING YOURSELF
	local db = require("src.db"):new()
	db:connect()
	local key = self.db.key
	if where_string then
		where_string = " where "..where_string
	else
		where_string = ''
	end
	local cur = db:query("select * from "..self.db.table..where_string..";")
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
	db:close()
	return res
end

function model:delete()
	local db = require("src.db"):new()
	db:connect()
	local id = self[self.db.key]
	if id and self:find(id) then
		local d = (db:query("delete from "..self.db.table.." where "..self.db.key.."='"..db:escape(id).."';") ~= 0)
		db:close()
		return d
	end
	db:close()
	return false
end

function model:validate()
	local check = true
	local errs = {}
	for attr,rules in pairs(self.attributes) do 
		local val = validation:new()
		for val_func,args in pairs(rules) do
			val = val[val_func](unpack(args))
		end
		local res, err = val(self[attr])
		check = check and res
		if not res then
			table.insert(errs,"'"..attr.."' "..err)
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

return model
