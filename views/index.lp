<html>
	<head>
		<title>SAILOR!</title>
	</head>
	<body>
		<br>
		hi! This comes from index.lp. cgilua is not installed
		<br>
		<? 
			test = true 
			var = 'this will print if "test" variable is true'
		?>
		<br>
		<? if POST['email'] ~= nil then	
			local email = POST['email']
		?>
		<%=email%>
		<? end ?>
		<br>
		<form method="post">
			<input name='email' type text></input>
			<input type=submit>
		</form>
		<? if test==true then ?>
			<?=var?>
		<? else ?>
			it will never get here
		<? end ?>
		<br/>
		<? for i = 0, 10, 1 do ?>
			this is in a loop <%=i%> <br/>
		<? end ?>
		<?= stringVariable ?>
		<?= anotherVar ?>
	</body>
</html>
 