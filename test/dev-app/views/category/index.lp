<style>
	.table td {
	    cursor: pointer;
	}
</style>
<h2>View all</h2>
<table class="table">
	<tr>
		<th>id</th>
		<th>name</th>
	</tr>
	<?lua for k,v in pairs(categorys) do ?>
		<tr onclick="location.href='<%= page:make_url('category/view',{id = v.id}) %>'" >
			<td> <%= v.id %> </td>
			<td> <%= v.name %> </td>
		</tr>
	<?lua end ?>
</table>
<br/>
<a href="<%= page:make_url('category/create') %>" class="btn btn-primary">Create new category</a>
