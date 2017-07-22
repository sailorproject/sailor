<h2>
	View category #<%= category.id %>
	<small>(<a href="<%= page:make_url('category/update', {id = category.id} ) %>" >update</a>)</small>
	<small>(<a href="<%= page:make_url('category/delete', {id = category.id} ) %>" >delete</a>)</small>
</h2>
<table class="table">
	<tr><td>id</td><td><%= category.id %> </td></tr>
	<tr><td>name</td><td><%= category.name %> </td></tr>
</table>
<br/>
<a href="<%= page:make_url('category/index') %>"><- Back to View All</a>
