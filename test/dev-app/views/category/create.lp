<?lua local form = require "sailor.form" ?>
<h2>Create category</h2>
<?lua if saved == false then ?>
	There was an error while saving.
<?lua end ?>
<form method="post">
	<div class="form-group">
		<label>id:</label>
		<%= form.text(category,'id', 'class="form-control" placeholder="id"') %>
		<span class="help-block"> <%= category.errors.id or '' %> </span>
	</div>
	<div class="form-group">
		<label>name:</label>
		<%= form.text(category,'name', 'class="form-control" placeholder="name"') %>
		<span class="help-block"> <%= category.errors.name or '' %> </span>
	</div>
	<input type="submit" class="btn btn-primary"/>
</form>
<br/>
<a href="<%= page:make_url('category/index') %>"><- Back to View All</a>
