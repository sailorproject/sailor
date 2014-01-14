local form = {}

function form.input_text(model,attribute,htmlOptions)
	local value = model[attribute] or ''
	local htmlOptions = htmlOptions or ''
	local html = '<input type="text" value="'..value..'" name="'..model._name..'_'..attribute..'" '..htmlOptions..' />'
	return html
end

return form
