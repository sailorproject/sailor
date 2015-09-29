##Reference Manual

###Lua at client

With Sailor, you can not only write the backend of your app with Lua, but you can also write Lua code that will run on the browser. This is possible because Sailor will get this piece of code and give it to a Virtual Machine that will handle it and run Javascript behind the scenes. Sailor is compatible with different implementations of Lua-to-Javascript virtual machines. The default is starlight. In case you want to use a different VM, you will have to <a href="https://github.com/Etiene/sailor/tree/master/lua-to-js-vms" target="_blank">download</a> the folder with the libraries, put it inside the `pub` folder of your Sailor app and edit your `conf/conf.lua` to configure your app to use this VM instead.

Here is a small comparative table of the compatible VMs:

|                                                                           |       starlight       |       moonshine       |          lua51js         |          luavmjs         |
|---------------------------------------------------------------------------|:---------------------:|:---------------------:|:------------------------:|:------------------------:|
| The code is pre-processed on the server and bytecode is sent to the JS VM |                       |           ✓           |                          |                          |
| The code is sent as a string to the JS VM                                 |           ✓           |                       |             ✓            |             ✓            |
| Compatible Lua version of the client written code                         |          5.1          |          5.1          |            5.1           |           5.2.3          |
| Works with Sailor on LuaJIT based servers, such as openresty              |           ✓           |                       |             ✓            |             ✓            |
| DOM manipulation                                                          |           ✓           |           ✓           |        incomplete        |             ✓            |
| Can require Lua modules                                                   |           ✓           |           ✓           |      Only on Apache      |                          |
| Supports Lua callbacks                                                    |           ✓           |           ✓           |             x            |             ✓            |
| Can call JS methods like eval() from Lua                                  |           ?           |           ?           |             x            |             ✓            |
| Supports the Lua C API                                                    |           x           |           x           |             ✓            |        incomplete        |
| How to print "hello" to the console                                       |     print("hello")    |     print("hello")    |      print("hello")      |      print("hello")      |
| How to pop an alert message with "hello"                                  | window:alert("hello") | window:alert("hello") | js.window:alert("hello") | js.global:alert("hello") |


You can find more information about them here:

Starlight: <a href="https://github.com/felipedaragon/lua_at_client/blob/master/docs/LUA_AT_CLIENT.starlight.md" target="_blank">Examples</a>, <a href="https://github.com/paulcuth/starlight" target="_blank">Github Repo</a> 

Moonshine: <a href="http://moonshinejs.org/" target="_blank">Official website</a>, <a href="https://github.com/gamesys/moonshine" target="_blank">Github Repo</a> 

Lua5.1.js: <a href="https://github.com/felipedaragon/lua_at_client/blob/master/docs/LUA_AT_CLIENT.lua51js.md" target="_blank">Examples</a>, <a href="https://github.com/logiceditor-com/lua5.1.js" target="_blank">Github Repo</a>

Lua.vm.js: <a href="https://github.com/felipedaragon/lua_at_client/blob/master/docs/LUA_AT_CLIENT.luavmjs.md" target="_blank">Examples</a>, <a href="https://kripken.github.io/lua.vm.js/lua.vm.js.html" target="_blank">Official website</a>, <a href="https://github.com/kripken/lua.vm.js" target="_blank">Github Repo</a> 


