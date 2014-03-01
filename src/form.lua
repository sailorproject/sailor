local form = {}

local function defaults(model,attribute,html_options)
	return model[attribute] or '', model['@name']..':'..attribute, html_options or ''
end

function form.text(model,attribute,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	return '<input type="text" value="'..value..'" name="'..name..'" '..html_options..' />'
end

function form.textarea(model,attribute,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	return '<textarea name="'..name..'" '..html_options..'>'..value..'</textarea>'
end

function form.dropdown(model,attribute,list,prompt,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	list = list or {}

	local html = '<select name="'..name..'" '..html_options..'>'
	if prompt then
		html = html..'<option value="" selected>'..prompt..'</option>'
	end
	for k,v in pairs(list) do
		local selected = ''
		if k == value then
			selected = ' selected'
		end
	html = html..'<option value="'..k..'"'..selected..'>'..v..'</option>'
	end	
	html = html..'</select>'

	return html
end

function form.password(model,attribute,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	return '<input type="password" value="'..value..'" name="'..name..'" '..html_options..' />'
end

--layout: horizontal(default) or vertical
function form.radio_list(model,attribute,list,default,layout,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	list = list or {}

	local html = ''
	for k,v in pairs(list) do
		local check = ''
		if k == value  or (value == '' and k == default) then
			check = ' checked'
		end
		html = html..'<input type="radio" name="'..name..'" '.. 
			'value="'..k..'" '..check..html_options..'/> '..v..' '
		if layout == 'vertical' then
			html = html..'<br/>'
		end
	end

	return html
end

-- checked: boolean
function form.checkbox(model,attribute,label,checked,html_options)
	local value, name, html_options = defaults(model,attribute,html_options)
	label = label or attribute

	local check = ''
	if (value ~= nil and value ~= 0 and value ~= '0') or checked == true then
		check = ' checked '
	end

	return '<input type="checkbox" name="'..name..'"'..check..html_options..'/> '..label
end
return form
