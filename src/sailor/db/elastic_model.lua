local es = require "sailor.db.elasticsearch"
local es_model = {}


es_model.new = function(model_name)
	
	local self = {}
	local ob = require("models."..model_name)
	Etype = ob.type
	keys = ob.keys 
	local attributes={}
	-- Function for indexing data into ES. If doc is not set, then attributes is saved into the index. 
	-- It uses named arguments to support optional parameters
	self.save = function(arg)
		if arg.doc == nil then 
			return es.index(Etype, arg.id, attributes, arg.params, arg.index)
		else
			return es.index(Etype, arg.id, arg.doc, arg.params, arg.index)
		end
	end
	--  Function for getting data from ES
	self.get = function(arg)
		return es.get(Etype, arg.id, arg.params, arg.index)
	end
	-- Function for searching ES
	self.search = function(arg)
		return es.search(Etype, arg.query, arg.doc, arg.params, arg.index)
	end
	-- Function for delete documents in ES
	self.delete = function(arg)
		return es.delete(Etype, arg.id, arg.params, arg.index)
	end
	-- Function for updating documents in ES
	self.update = function(arg)
		return es.update(Etype, arg.id, arg.doc, arg.params, arg.index)
	end
	
	setmetatable(self, {
	
	__newindex = function(table, key, value)
		for k,v in ipairs(keys) do if key == v then attributes[key] = value end end -- check for allowed keys -> then store it in parameters table
		-- parameters[key] = value
	end,
		 
	__index = attributes

	})

	
	return self

end

return es_model
