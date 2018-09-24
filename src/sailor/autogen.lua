--------------------------------------------------------------------------------
-- autogen.lua, v0.3.1: has codes in strings for autogenerating CRUDS based on sailor models
-- This file is a part of Sailor project
-- Copyright (c) 2014 Etiene Dalcol <dalcol@etiene.net>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------
local lfs = require "lfs"

local M = {}

-- The code for the generated controller
-- model: the model from which the generated CRUD will refer to
function M.generate_controller(model)
	local code = [[
local M = {}

function M.index(page)
	local ]]..model["@name"]..[[s = require "sailor.model"("]]..model["@name"]..[["):find_all()
	page:render('index',{]]..model["@name"]..[[s = ]]..model["@name"]..[[s})
end

function M.create(page)
	local ]]..model["@name"]..[[ = require "sailor.model"("]]..model["@name"]..[["):new()
	local saved
	if next(page.POST) then
		]]..model["@name"]..[[:get_post(page.POST)
		saved = ]]..model["@name"]..[[:save()
		if saved then
			page:redirect(']]..model["@name"]..[[/index')
		end
	end
	page:render('create',{]]..model["@name"]..[[ = ]]..model["@name"]..[[, saved = saved})
end

function M.update(page)
	local ]]..model["@name"]..[[ = require "sailor.model"("]]..model["@name"]..[["):find_by_id(page.GET.id)
	if not ]]..model["@name"]..[[ then
		return 404
	end
	local saved
	if next(page.POST) then
		]]..model["@name"]..[[:get_post(page.POST)
		saved = ]]..model["@name"]..[[:update()
		if saved then
			page:redirect(']]..model["@name"]..[[/index')
		end
	end
	page:render('update',{]]..model["@name"]..[[ = ]]..model["@name"]..[[, saved = saved})
end

function M.view(page)
	local ]]..model["@name"]..[[ = require "sailor.model"("]]..model["@name"]..[["):find_by_id(page.GET.id)
	if not ]]..model["@name"]..[[ then
		return 404
	end
	page:render('view',{]]..model["@name"]..[[ = ]]..model["@name"]..[[})
end

function M.delete(page)
	local ]]..model["@name"]..[[ = require "sailor.model"("]]..model["@name"]..[["):find_by_id(page.GET.id)
	if not ]]..model["@name"]..[[ then
		return 404
	end

	if ]]..model["@name"]..[[:delete() then
		page:redirect(']]..model["@name"]..[[/index')
	end
end

return M
]]


	local file = assert(io.open("controllers/"..model["@name"]..".lua", "w"))
	if file:write(code) then
		file:close()
		return true
	end
	return false
end

-- The code for the generated index page of the CRUD
-- model: the model from which the generated CRUD will refer to
function M.generate_index(model)
	local code = [[
<style&gt;
	.table td {
	    cursor: pointer;
	}
</style&gt;
<h2&gt;View all</h2&gt;
<table class="table"&gt;
	<tr&gt;
]]

	for _,attributes in pairs (model.attributes) do
		for attr in pairs(attributes) do
			code = code .. [[		<th&gt;]] .. attr ..  [[</th&gt;
]]
		end
	end

	code = code .. [[
	</tr&gt;
	<?lua for k,v in pairs(]]..model["@name"]..[[s) do ?&gt;
		<tr onclick="location.href='<%= page:make_url(']]..model["@name"]..[[/view',{id = v.id}) %&gt;'" &gt;
]]

	for _,attributes in pairs (model.attributes) do
		for attr in pairs(attributes) do
			code = code .. [[			<td&gt; <%= v.]]..attr..[[ %&gt; </td&gt;
]]
		end
	end

	code = code ..[[
		</tr&gt;
	<?lua end ?&gt;
</table&gt;
<br/&gt;
<a href="<%= page:make_url(']]..model["@name"]..[[/create') %&gt;" class="btn btn-primary"&gt;Create new ]]..model["@name"]..[[</a&gt;
]]

	code = string.gsub(code,"&gt;",">")
	lfs.mkdir("views/"..model["@name"])
	local file = assert(io.open("views/"..model["@name"].."/index.lp", "w"))
	if file:write(code) then
		file:close()
		return true
	end
	return false
end

-- The code for the generated read page of the CRUD
-- model: the model from which the generated CRUD will refer to
function M.generate_view(model)
	local code = [[
<h2&gt;
	View ]]..model["@name"]..[[ #<%= ]]..model["@name"]..[[.id %&gt;
	<small>(<a href="<%= page:make_url(']]..model["@name"]..[[/update', {id = ]]..model["@name"]..[[.id} ) %&gt;" >update</a&gt;)</small&gt;
	<small>(<a href="<%= page:make_url(']]..model["@name"]..[[/delete', {id = ]]..model["@name"]..[[.id} ) %&gt;" >delete</a&gt;)</small&gt;
</h2&gt;
<table class="table"&gt;
]]
	for _,attributes in pairs (model.attributes) do
		for attr in pairs(attributes) do
			code = code .. [[	<tr&gt;<td&gt;]]..attr..[[</td&gt;<td&gt;<%= ]]..model["@name"].."."..attr..[[ %&gt; </td&gt;</tr&gt;
]]
		end
	end
	code = code ..[[
</table&gt;
<br/&gt;
<a href="<%= page:make_url(']]..model["@name"]..[[/index') %&gt;"&gt;<- Back to View All</a&gt;
]]

	code = string.gsub(code,"&gt;",">")
	local file = assert(io.open("views/"..model["@name"].."/view.lp", "w"))
	if file:write(code) then
		file:close()
		return true
	end
	return false
end

-- The code for the generated create page of the CRUD
-- model: the model from which the generated CRUD will refer to
function M.generate_create(model)
	local code = [[
<?lua local form = require "sailor.form" ?&gt;
<h2&gt;Create ]]..model["@name"]..[[</h2&gt;
<?lua if saved == false then ?&gt;
	There was an error while saving.
<?lua end ?&gt;
<form method="post"&gt;
]]
	for _,attributes in pairs (model.attributes) do
		for attr in pairs(attributes) do
			code = code ..[[	<div class="form-group"&gt;
		<label&gt;]]..attr..[[:</label&gt;
		<%= form.text(]]..model["@name"]..",'"..attr..[[', 'class="form-control" placeholder="]]..attr..[["') %&gt;
		<span class="help-block"&gt; <%= ]]..model["@name"]..".errors."..attr..[[ or '' %&gt; </span&gt;
	</div&gt;
]]
		end
	end
	code = code ..[[
	<input type="submit" class="btn btn-primary"/&gt;
</form&gt;
<br/&gt;
<a href="<%= page:make_url(']]..model["@name"]..[[/index') %&gt;"&gt;<- Back to View All</a&gt;
]]

	code = string.gsub(code,"&gt;",">")
	local file = assert(io.open("views/"..model["@name"].."/create.lp", "w"))
	if file:write(code) then
		file:close()
		return true
	end
	return false
end

-- The code for the generated update page of the CRUD
-- model: the model from which the generated CRUD will refer to
function M.generate_update(model)
	local code = [[
<?lua local form = require "sailor.form" ?&gt;
<h2&gt;Update ]]..model["@name"]..[[</h2&gt;
<?lua if saved == false then ?&gt;
	There was an error while saving.
<?lua end ?&gt;
<form method="post"&gt;
]]
	for _,attributes in pairs (model.attributes) do
		for attr in pairs(attributes) do
			code = code ..[[	<div class="form-group"&gt;
		<label&gt;]]..attr..[[:</label&gt;
		<%= form.text(]]..model["@name"]..",'"..attr..[[', 'class="form-control" placeholder="]]..attr..[["') %&gt;
	</div&gt;
]]
		end
	end
	code = code ..[[
	<input type="submit" class="btn btn-primary"/&gt;
</form&gt;
<br/&gt;
<a href="<%= page:make_url(']]..model["@name"]..[[/index') %&gt;"&gt;<- Back to View All</a&gt;
]]

	code = string.gsub(code,"&gt;",">")
	local file = assert(io.open("views/"..model["@name"].."/update.lp", "w"))
	if file:write(code) then
		file:close()
		return true
	end
	return false
end

return M
