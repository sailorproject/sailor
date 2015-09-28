<?lua@both
 msg = 'Houston, Tranquility Base here.'
 
 function getlastmsg()
  return 'The Eagle has landed.'
 end
?>

<h2><?=msg?></h2>
<h3><?=getlastmsg()?></h3>

<?lua@client
 js.window:alert(msg..' '..getlastmsg())
?>

<br><br>
<font color="green">This page mixes both client and server-side Lua code.</font>