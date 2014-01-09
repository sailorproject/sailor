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
	--todo
end

function model:find_all()
	local key = self.db.key
	local cur = db.query("select * from "..self.db.table..";")
	local res = {}
	local row = cur:fetch ({}, "a")
	while row do
		res[row[key]] = {}
		for attribute,_ in pairs(self.attributes) do 
			res[row[key]][attribute] = row[attribute]
		end
		row = cur:fetch (row, "a")
	end
	cur:close()
	return res
end

return model


