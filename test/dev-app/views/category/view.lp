<h2>
	View category #<?lua page:print( category.id ) ?> 
	<small>(<a href="?r=category/update&id=<?lua page:print( category.id ) ?>" >update</a>)</small> 
	<small>(<a href="?r=category/delete&id=<?lua page:print( category.id ) ?>" >delete</a>)</small>
</h2>
<table class="table"> 
	<tr><td>id</td><td><?lua page:print( category.id ) ?> </td></tr> 
	<tr><td>name</td><td><?lua page:print( category.name ) ?> </td></tr> 
</table> 
<br/>
<a href="?r=category/index"><- Back to View All</a>
