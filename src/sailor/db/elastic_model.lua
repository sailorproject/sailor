local elastic = require "sailor.db.elasticsearch"
local Emodel = {}


Emodel.new = function(model_name)
	
	local self = {}
	local ob = require("models."..model_name)
	Etype = ob.type
	keys = ob.keys	
	local parameters={}
	-- This method should be used when you are saving the parameters. If second parameter is present,
	-- it will write that value into ES
	self.save = function(id, ...)
		if ... ~= nil and type(...) == "table" then 
			return elastic.index(Etype, id , ...)
		else
			return elastic.index(Etype, id, parameters)
		end
	end

	-- Get a document using ID
	self.get = function(id)
		return elastic.get(Etype, id)
	end
	-- Delete a document using ID
	self.delete = function(id)
		return elastic.delete(Etype,id)
	end
	-- Setting metatable so that you can assign/store normal keys too instead of only tables

	setmetatable(self, {
	
	__newindex = function(table, key, value)
		for k,v in ipairs(keys) do if key == v then parameters[key] = value end end
		-- parameters[key] = value
	end,
		 
	__index = parameters

	})

	
	return self

end
return Emodel
