-------------------------------------------------------------------------------------------
-- es_model.lua: DB module for connecting, querying and serching through elasticsearch
-- This file is a part of Sailor project
-- Copyright (c) 2016 Nikhil. R <rnikhil96@outlook.com>
-- License: MIT
-- http://sailorproject.org
-------------------------------------------------------------------------------------------

local es_model = {}
local elasticsearch = require "elasticsearch"
local main_conf = require "conf.conf"
local elastic_conf = main_conf.search[main_conf.sailor.search_engine]

local client = elasticsearch.client{
	hosts=elastic_conf.hosts,
	params = elastic_conf.params
}

es_model.new = function(model_name)
	
	local self = {}
	local ob = require("models."..model_name)
	es_type = ob.type
	keys = ob.keys 
	local attributes={}

	-- Function for indexing data into ES. If doc is not set, then attributes is saved into the index. 
	-- It uses named arguments to support optional parameters
	self.save = function(arg)
		arg.index = arg.index or elastic_conf.index
		arg.type = es_type
		if arg.body == nil then 
			arg.body = attributes	
			return client:index(arg)
		else
			return client:index(arg)
		end
	end
	--  Function for getting data from ES
	self.get = function(arg)
		arg.index = arg.index or elastic_conf.index
		arg.type = es_type
		return client:get(arg)
	end
	-- Function for searching ES
	self.search = function(arg)
		arg.index = arg.index or elastic_conf.index
		arg.type = es_type
		return  client:search(arg)
	end
	-- Function for delete documents in ES
	self.delete = function(arg)
		arg.index = arg.index or elastic_conf.index
		arg.type = es_type
		return  client:delete(arg)
	end
	-- Function for updating documents in ES
	self.update = function(arg)
		arg.index = arg.index or elastic_conf.index
		arg.type = es_type
		return client:update(arg)
	end
	
	setmetatable(self, {
	
	__newindex = function(table, key, value)
		local found = false
		for _,attrs in pairs(keys) do 
			if attrs == key then
				attributes[key] = value 
				found = true
			end
			if not found then
				error(tostring(key).." is not a valid attribute for this model.")
			end
		end -- check for allowed keys -> then store it in parameters table
	end,
		 
	__index = attributes

	})

	
	return self

end

return es_model
