-------------------------------------------------------------------------------------------
-- elasticsearch.lua: DB module for connecting, querying and serching through elasticsearch
-- This file is a part of Sailor project
-- Copyright (c) 2016 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
-------------------------------------------------------------------------------------------



local elasticsearch = require "elasticsearch"
local main_conf = require "conf.conf"
local elastic_conf = main_conf.db[main_conf.sailor.search_database]
local client = elasticsearch.client{
	host={
		protocol = elastic_conf.protocol,
		host = elastic_conf.host,
		port = elastic_conf.port
	}
}


local elastic = {}




function elastic.getinfo()
	local data, err = client:info()
	if data==nil then
		return err
	else
		return data

	end
end

function elastic.index(indexq, typeq, idq, body)
	local data, err = client:index{
	index = indexq,
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

function elastic.get(indexq, typeq, idq)
	local data, err = client:get{
  	index = indexq,
  	type = typeq,
  	id = idq
}
	if data==nil then
		return err
	else
		return data
	end
end

function elastic.search(indexq, typeq, query)
		local data, err = client:search{
	  		index = indexq,
	  		type = typeq,
	  		q = query
			}
	if data==nil then
		return err
	else
		return data

	end
end

function elastic.searchbody(indexq, typeq, body)
	local data, err = client:search{
  index = indexq,
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

function elastic.delete(indexq, typeq, idq)
	local data, err = client:delete{
  index = indexq,
  type = typeq,
  id = idq
}
	if data==nil then
		return err
	else
		return data

	end

end


function elastic.update(indexq, typeq, idq, body)
	local data, err = client:update{
  		index = indexq,
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