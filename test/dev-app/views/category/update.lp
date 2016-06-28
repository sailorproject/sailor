<?lua local form = require "sailor.form" ?>
<h2>Update category</h2>
<?lua if saved == false then ?>
	There was an error while saving.
<?lua end ?>
<form method="post">
	<div class="form-group">
		<label>id:</label>
		<%= form.text(category,'id', 'class="form-control" placeholder="id"') %>
	</div>
	<div class="form-group">
		<label>name:</label>
		<%= form.text(category,'name', 'class="form-control" placeholder="name"') %>
	</div>
	<input type="submit" class="btn btn-primary"/>
</form>
<br/>
<a href="<%= page:make_url('category/index') %>"><- Back to View All</a>
