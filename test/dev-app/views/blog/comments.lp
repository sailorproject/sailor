Comments from post "<%= post.body %>":
<br/><br/>

<?lua 
if next(post.comments) then
	for _,c in pairs(post.comments) do ?>
		<%= c.body %><br/>
		By: <%= c.author.username %><br/><br/>
<?lua end 
else ?> 
	No Comments
<?lua end ?>