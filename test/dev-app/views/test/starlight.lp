<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>

<div id="app">
	<p>hey</p>
	<div></div>
</div>

<script>
function my_js_func(msg){
	console.log('this is JS');
	console.log(msg);
}
function my_js_func_receives_lua_func(func){
	func(); //ask about parameters here
}
function JQObj(s){
	return $(s);
}
</script>

<?lua@client

--DOM
window:alert('ho')
local app = window.document:getElementById('app')
print(app.textContent)
app.textContent = 'lets go'

--JS and JQ Bridge
window:my_js_func("this is Lua")
local app = window:JQObj('#app')
app:html('lalalala')
function this_is_lua() -- ask about parameters here?
	print('this is Lua being printed from a listener in JS')
end
window:my_js_func_receives_lua_func(this_is_lua)

--Require modules on server
local v = require "valua"
local val = v:new().len(3,5)
print(val('oi'))

?>
