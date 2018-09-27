--------------------------------------------------------------------------------
-- form.lua, v0.6: generates html for forms
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local form = {}
local tinsert, tconcat = table.insert, table.concat
local model_name

local meta = {}
meta.__call = function(_,mname)
	model_name = mname
	return form
end
setmetatable(form,meta)

local generic_input_types = {
	file = true,
	text = true,
	hidden = true,
	password = true,
	color = true,
	date = true,
	datetime = true,
	email = true,
	month = true,
	number = true,
	range = true,
	search = true,
	tel = true,
	time = true,
	url = true,
	week = true
}


local function defaults(model,attribute,html_options)
	local value = model[attribute] and 'value="'..tostring(model[attribute])..'"' 
	local name = model['@name']..':'..attribute
	local id = 'id="'..name..'"'
	name = 'name="'..name..'"'
	html_options = html_options 

	return name, id, html_options, value
end

local pack = function(...) 
	if not table.pack then
		return {n=select('#',...),...} 
	end
	return table.pack(...)
end

-- Inputs that work exactly the same changing only the type
meta.__index = function(_,key)
	if generic_input_types[key] then
		return function(...)
				local t = pack(defaults(...))
				tinsert(t,1,'<input')
				tinsert(t,2,'type="'..key..'"')
				tinsert(t,'/>')
				return tconcat(t,' ')
			end
	end
	return nil
end

-- More form inputs
function form.textarea(model,attribute,html_options)
	local t = pack(defaults(model,attribute,html_options))
	tinsert(t,1,'<textarea')
	tinsert(t,'>' .. (model[attribute] or '') .. '</textarea>')

	return tconcat(t,' ')
end

function form.dropdown(model,attribute,list,prompt,html_options)
	local html = pack(defaults(model,attribute,html_options))
	local value = model[attribute]
	list = list or {}

	tinsert(html,1,'<select')
	tinsert(html,'>')
	if prompt then
		local s = value and '' or 'selected'
		tinsert(html,'<option value="" '..s..'>'..prompt..'</option>')
	end
	for k,v in pairs(list) do
		local selected = ''
		if k == value then
			selected = 'selected'
		end
		tinsert(html,'<option value="'..k..'"'..selected..'>'..v..'</option>')
	end	
	tinsert(html,'</select>')

	return tconcat(html,' ')
end



-- layout: horizontal(default) or vertical
function form.radio_list(model,attribute,list,default,layout,html_options)
	local _
	_, _, html_options = defaults(model,attribute,html_options)
	local value = model[attribute]
	list = list or {}

	local t = {}
	for k,v in pairs(list) do
		local html = {}
		tinsert(html, '<input type="radio"')
		tinsert(html, 'value="'..k..'"')

		if k == value  or (value == nil and k == default) then
			tinsert(html, 'checked')
		end
		if html_options then 
			tinsert(html, html_options)
		end
		tinsert(html,'/>')
		tinsert(html,v)
		
		tinsert(t,tconcat(html,' '))
	end

	if layout == 'vertical' then
		return tconcat(t,' <br/>')
	end
	return tconcat(t,' ')
end

-- checked: boolean
function form.checkbox(model,attribute,label,checked,html_options)
	local t = pack(defaults(model,attribute,html_options))
	local value = model[attribute]
	
	tinsert(t,1,'<input type="checkbox"')
	if (value ~= nil and value ~= '' and value ~= 0 and value ~= '0') or checked == true then
		tinsert(t,'checked')
	end
	tinsert(t,'/>')
	tinsert(t,(label or attribute))

	return tconcat(t,' ')
end

function form.ify(data)
	local new_data = {}
	for k,v in pairs(data) do
		new_data[model_name .. ':' .. k] = v
	end
	return new_data
end

return form
