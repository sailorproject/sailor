local elastic = require "sailor.db.elasticsearch"
local Emodel = {}


Emodel.new = function(model_name)
	
	local self = {}
	local ob = require("models."..model_name)
	Etype = ob.type
	
	self.index = function (id, data)
		return elastic.index(Etype, id , data)
	end

	self.delete = function(id)
		return elastic.delete(Etype,id)
	end
	return self
end

return Emodel
