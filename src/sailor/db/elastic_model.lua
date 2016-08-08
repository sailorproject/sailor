local es = require "sailor.db.elasticsearch"
local es_model = {}


es_model.new = function(model_name)
	
	local self = {}
	local ob = require("models."..model_name)
	Etype = ob.type
	keys = ob.keys	
	local parameters={}
	-- This method should be used when you are saving the parameters. If second parameter is present,
	-- it will write that value into ES
	self.save = function(id, ...)
		if ... ~= nil and type(...) == "table" then 
			return es.index(Etype, id , ...)
		else
			return es.index(Etype, id, parameters)
		end
	end

	-- Get a document using ID
	self.get = function(id)
		return es.get(Etype, id)
	end
	-- Delete a document using ID
	self.delete = function(id)
		return es.delete(Etype,id)
	end
	self.search = function(word)
		return es.search(Etype, word)
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
return es_model
