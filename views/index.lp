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




<? if test==true then ?>
<?=var?>
<? else ?>
it will never get here
<? end ?>
<br/>
<? for i = 0, 10, 1 do ?>
	this is in a loop <%=i%> <br/>
<? end ?>

</body>
</html>
 <?= stringVariable ?>
  <?= anotherVar ?>
 