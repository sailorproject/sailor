<?lua@client

 js.document:write('Today is: '..os.date()..'<br>')
 js.document:write('Your User-Agent is: '..js.navigator.userAgent..'<br>')
 if js.navigator.cookieEnabled == true then
      js.document:write('Cookie support is enabled.<br>')
 else
      js.document:write('Cookie support is disabled.<br>')
 end
 
 function say_bye()
      js.document:write('Bye! :)')
 end
 
?>

<?lua@client
 say_bye()
?>

<br><br>
<font color="green">The text above was generated using client-side Lua.</font>