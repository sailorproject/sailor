<form method="post">
	Name: <?=form.text(user,'username','placeholder="Insert a name"')?><br/>
	Name: <?=form.textarea(user,'username')?><br/>
	Name: <?=form.dropdown(user,'username',{hey="hey",test="test",blah="Blah Blah"},"Please select...")?><br/>
	Name: <?=form.password(user,'username')?><br/>
	Name: <?=form.radio_list(user,'username',{hey="hey",test="test",blah="Blah Blah"})?><br/>
	<? user.username = 0 ?>
	Name: <?=form.checkbox(user,'username')?><br/>
	<input type="submit"/>
</form>
