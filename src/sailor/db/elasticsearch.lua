-------------------------------------------------------------------------------------------
-- elasticsearch.lua: DB module for connecting, querying and serching through elasticsearch
-- This file is a part of Sailor project
-- Copyright (c) 2016 Nikhil. R <rnikhil96@outlook.com>
-- License: MIT
-- http://sailorproject.org
-------------------------------------------------------------------------------------------

local elasticsearch = require "elasticsearch"
local main_conf = require "conf.conf"
local elastic_conf = main_conf.search[main_conf.sailor.search_engine]
local es = {}

local client = elasticsearch.client{
	hosts=elastic_conf.hosts,
	params = elastic_conf.params
}

-- Function for indexing data into elasticsearch
function es.index(type, id, doc, params, index)
	params = params or {}
	local data, err = client:index{
		index = index or elastic_conf.index,
		type = type,
		id = id,
		body = doc,
		routing = params.routing,
		op_type = params.op_type,
		consistency = params.consistency,
		parent = params.parent,
		refresh = params.refresh,
		percolate = params.percolate,
		replication = params.replication,
		timeout = params.timeout,
		version = params.version,
		version_type = params.version_type
	
	}
	if data == nil then
		return err
	else
		return data, err

	end
end
-- Function for getting data from ES
function es.get(type, id, params, index)
	params = params or {}
	local data, err = client:get{
	  	index = index or elastic_conf.index,
	  	type = typeq,
	  	id = idq,
	  	ignore_missing = params.ignore_missing,
	  	fields = params.fields,
	  	parent = params.parent,
	  	preference = params.preference,
	  	realtime = params.realtime,
	  	refresh = params.refresh,
	  	routing = params.routing,
	  	_source = params._source,
	  	_source_exclude = params._source_exclude,
	  	_source_include = params._source_include

	}
	if data == nil then
		return err
	else
		return data, err
	end
end
-- Function for searching through ES 
function es.search(type, query, doc, params, index)
	params = params or {}
	doc = doc or nil
	local data, err = client:search{
  		index = index or elastic_conf.index,
  		type = type,
  		q = query,
  		body = doc,
  		_source = params._source,
	  	_source_exclude = params._source_exclude,
	  	_source_include = params._source_include,
	  	analyzer = params.analyzer,
	  	analyze_wildcard = params.analyze_wildcard,
	  	default_operator = params.default_operator,
	  	df = params.df,
	  	explain = params.explain,
	  	fields = params.fields,
	  	from = params.from,
	  	ignore_indices = params.ignore_indices,
	  	indices_boost = params.indices_boost,
	  	lenient = params.lenient,
	  	lowercase_expanded_terms = params.lowercase_expanded_terms,
	  	preference = params.preference,
	  	routing = params.routing,
	  	scroll = params.scroll,
	  	search_type = params.search_type,
	  	size = params.size,
	  	sort = params.sort,
	  	source = params.source,
	  	stats = params.stats,
	  	suggest_field = params.suggest_field,
	  	suggest_mode = params.suggest_mode,
	  	suggest_size = params.suggest_size,
	  	suggest_text = params.suggest_text,
	  	timeout = params.timeout,
	  	version = params.version

		}
	if data == nil then
		return err
	else
		return data,err

	end
end
-- Function for deleting documents in ES
function es.delete(type, id, params, index)
	params = params or {}
	local data, err = client:delete{
	  	index = index or elastic_conf.index,
	  	type = type,
	  	id = id,
	  	consistency = params.consistency,
		parent = params.parent,
		refresh = params.refresh,
		replication = params.replication,
		routing = params.routing,
		timeout = params.timeout,
		version_type = params.version_type
	}
	if data == nil then
		return err
	else
		return data, err

	end

end
-- Function for updating documents in ES
function es.update(type, id, doc, params, index)
	params = params or {}
	local data, err = client:update{
		index = index or elastic_conf.index,
		type = type,
		id = id,
		consistency = params.consistency,
		fields = params.fields,
		lang = params.lang,
		parent = params.parent,
		percolate = params.percolate,
		refresh = params.refresh,
		replication = params.replication,
		retry_on_conflict = params.retry_on_conflict,
		routing = params.routing,
		script = params.script,
		timeout = params.timeout,
		version_type = params.version_type,
		body = {
			doc = doc
  }
}

	if data == nil then
		return err
	else
		return data, err

	end

end

return es