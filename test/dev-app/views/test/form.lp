<form method="post">

	<?=form.text(user,'username','placeholder="Insert a name"')?>
	<br/><br/>
	<?=form.textarea(user,'username')?>
	<br/><br/>
	<?=form.dropdown(user,'username',{hey="hey",test="test",blah="Blah Blah"},"Please select...")?>
	<br/><br/>
	<?=form.password(user,'username')?>
	<br/><br/>
	<?=form.radio_list(user,'username',{hey="hey",test="test",blah="Blah Blah"})?>
	<br/><br/>
	<?=form.radio_list(user,'password',{hey="hey",test="test",blah="Blah Blah"},'hey','vertical')?>
	<br/><br/>
	<?=form.checkbox(user,'username')?>
	<br/><br/>
	<input type="submit"/>
</form>
