local form = {}

function form.input_text(model,attribute,html_options)
	local value = model[attribute] or ''
	html_options = html_options or ''
	return '<input type="text" value="'..value..'" name="'..model['@name']..'_'..attribute..'" '..html_options..' />'
end

return form
