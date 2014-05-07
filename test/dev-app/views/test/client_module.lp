<?lua@client?><!-- Serve the VM first-->

<!-- This Lua module will be automatically converted to JS if your server is properly configured -->
<script src="pub/lua/mymodule.lua"></script>

<?lua@client
 demo = require('pub.lua.mymodule')
 demo.printh1('Hello World!')
?>

<br><br>
Note: If you see a 'pub.lua.mymodule' not found error message you need to configure the LuaMapHandler directive - this is explained <a href="https://github.com/felipedaragon/lua_at_client#loading-modules" target="help">here</a>.