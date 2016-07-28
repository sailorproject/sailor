local elasticsearch = require "elasticsearch"
local client = elasticsearch.client()
local elastic = {}

function elastic.search(indexq, typeq, query)
		data, err = client:search{
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


return elastic