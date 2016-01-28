--------------------------------------------------------------------------------
-- form.lua, v0.4: generates html for forms
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
	text = true,
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
	local value = model[attribute] and ' value="'..tostring(model[attribute])..'"' or ' '
	local name = model['@name']..':'..attribute
	local id = ' id="'..name..'"'
	name = ' name="'..name..'"'
	html_options = html_options and ' '..html_options or ' '

	return name, id, html_options, value
end

-- Inputs that work exactly the same changing only the type
meta.__index = function(table,key)
	if generic_input_types[key] then
		return function(...)
				local name, id, html_options, value = defaults(...)
				return '<input type="'..key..'"'..value..name..id..html_options..' />'
			end
	end
	return nil
end

-- More form inputs
function form.textarea(model,attribute,html_options)
	local name, id, html_options = defaults(model,attribute,html_options)
	return '<textarea'..name..id..html_options..' />'..(model[attribute] or ' ')..'</textarea>'
end

function form.file(model,attribute,html_options)
	local name, id, html_options = defaults(model,attribute,html_options)
	return '<input type="file"'..name..id..html_options..'/>'
end

function form.dropdown(model,attribute,list,prompt,html_options)
	local name, id, html_options = defaults(model,attribute,html_options)
	local value = model[attribute]
	list = list or {}

	local html = {}
	tinsert(html,'<select '..name..id..html_options..' />')
	if prompt then
		tinsert(html,'<option value="" selected>'..prompt..'</option>')
	end
	for k,v in pairs(list) do
		local selected = ''
		if k == value then
			selected = ' selected'
		end
	tinsert(html,'<option value="'..k..'"'..selected..'>'..v..'</option>')
	end	
	tinsert(html,'</select>')

	return tconcat(html)
end



-- layout: horizontal(default) or vertical
function form.radio_list(model,attribute,list,default,layout,html_options)
	local name, _, html_options = defaults(model,attribute,html_options)
	local value = model[attribute]
	list = list or {}

	local html = {}
	for k,v in pairs(list) do
		local check = ' '
		if k == value  or (value == nil and k == default) then
			check = ' checked'
		end
		tinsert(html, '<input type="radio"'..name..'value="'..k..'"'..check..html_options..'/> '..v)
	end
	if layout == 'vertical' then
		return tconcat(html,'<br/>')
	end
	return tconcat(html,' ')
end

-- checked: boolean
function form.checkbox(model,attribute,label,checked,html_options)
	local name, id, html_options = defaults(model,attribute,html_options)
	local value = model[attribute]
	label = label or attribute

	local check = ''
	if (value ~= nil and value ~= '' and value ~= 0 and value ~= '0') or checked == true then
		check = ' checked '
	end

	return '<input type="checkbox" '..name..id..check..html_options..'/> '..label
end

function form.ify(data)
	local new_data = {}
	for k,v in pairs(data) do
		new_data[model_name .. ':' .. k] = v
	end
	return new_data
end

return form
