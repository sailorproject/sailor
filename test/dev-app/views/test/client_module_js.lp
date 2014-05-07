<?lua@client?><!-- Serve the VM first-->

<!-- This will load a Lua module that has been manually packed to JS -->
<script src="pub/lua/mymodule.js"></script>

<?lua@client
 demo = require('pub.lua.mymodule')
 demo.printh1('Hello World!')
?>