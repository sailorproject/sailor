<html>
	<head>
		<title>SAILOR!</title>
	</head>
	<body>
		<br/>
			This comes from a .lp file. "LP" stands for Lua Page.
		<br/> 
			You can use lua scripts here inside tags, everything else looks like regular HTML.
		<br/>
			More info about it <a href="http://keplerproject.github.io/cgilua/manual.html#templates">here.</a>
		<br/>
		<!-- This opens a lua script --> 
		<?lua 
			test = true 
			var = 'this will print if "test" variable is true'

			--comment
			--[[Block
				comment]]

		?><!-- This closes --> 
		<br>
		
		<!-- This also opens a lua script --> 
		<? 
			if test==true then ?>
			<?=var?><!-- This prints var 'var' -->
		<? else ?>
			it will never print this
		<? end ?>
		<br/>
		<? for i = 0, 10, 1 do ?>
			this is in a loop <%= i %><!-- This also prints --> <br/>
		<? end ?>
		<?= stringVariable ?>
		<?= anotherVar ?>
	</body>
</html>
 
