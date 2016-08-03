-------------------------------------------------------------------------------------------
-- elasticsearch.lua: DB module for connecting, querying and serching through elasticsearch
-- This file is a part of Sailor project
-- Copyright (c) 2016 Nikhil. R <rnikhil96@outlook.com>
-- License: MIT
-- http://sailorproject.org
-------------------------------------------------------------------------------------------



local elasticsearch = require "elasticsearch"
local main_conf = require "conf.conf"
local elastic_conf = main_conf.db[main_conf.sailor.search_database]

local elastic = {}

	local client = elasticsearch.client{
	host={
		protocol = elastic_conf.protocol,
		host = elastic_conf.host,
		port = elastic_conf.port
	}
}

function elastic.getinfo()
	local data, err = client:info()
	if data==nil then
		return err
	else
		return data

	end
end

function elastic.index(typeq, idq, body)
	local data, err = client:index{
		index = elastic_conf.index,
		type = typeq,
		id = idq,
		body = body
	}
	if data==nil then
		return err
	else
		return data

	end
end

function elastic.get(typeq, idq)
	local data, err = client:get{
	  	index = elastic_conf.index,
	  	type = typeq,
	  	id = idq
	}
	if data==nil then
		return err
	else
		return data
	end
end

function elastic.search(typeq, query)
	local data, err = client:search{
  		index = elastic_conf.index,
  		type = typeq,
  		q = query
		}
	if data==nil then
		return err
	else
		return data

	end
end

function elastic.searchbody(typeq, body)
	local data, err = client:search{
	  index = elastic_conf.index,
	  type = typeq,
	  body = {
	    query = {
	      match = body
	    }
	  }
}
if data==nil then
		return err
	else
		return data

	end
end

function elastic.delete(typeq, idq)
	local data, err = client:delete{
	  index = elastic_conf.index,
	  type = typeq,
	  id = idq
}
	if data==nil then
		return err
	else
		return data

	end

end


function elastic.update(typeq, idq, body)
	local data, err = client:update{
		index = elastic_conf.index,
		type = typeq,
		id = idq,
			body = {
			doc = body
  }
}

	if data==nil then
		return err
	else
		return data

	end

end

return elastic