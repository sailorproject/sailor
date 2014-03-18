<?lua@client
 require('js')
 
 print('Today is: '..os.date()..'<br>')
 print('Your User-Agent is: '..js.navigator.userAgent..'<br>')
 if js.navigator.cookieEnabled == true then
      print('Cookie support is enabled.<br>')
 else
      print('Cookie support is disabled.<br>')
 end
 
 function say_bye()
      print('Bye! :)')
 end
?>

<?lua@client
 say_bye()
?>

<br><br>
<font color="green">The text above was generated using client-side Lua.</font>