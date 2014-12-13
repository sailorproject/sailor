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
		<tr onclick="location.href='?r=category/view&id=<?lua page:print( v.id ) ?>'" > 
			<td> <?lua page:print( v.id ) ?> </td> 
			<td> <?lua page:print( v.name ) ?> </td> 
		</tr>
	<?lua end ?> 
</table> 
<br/>
<a href="?r=category/create" class="btn btn-primary">Create new category</a>
