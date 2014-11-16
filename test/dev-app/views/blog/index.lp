<?lua for _,p in pairs(posts) do ?>
	<%= p.body %>
	<br/>
	By: <%= p.author.username %>  
	<br/>
	Categories: 
	<?lua for _,c in pairs(p.categories) do ?>
		<%= c.name %>; 
	<?lua end ?> 
	<br/>
	<a href="?r=blog/comments&pid=<%= p.id %>">
	Comments (<%= #p.comments %>)
	</a>
	<br/>
	<br/>
<?lua end ?>