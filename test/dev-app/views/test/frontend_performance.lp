<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<div id="app">Hello</div>
<div id="app2">Hello</div>
<script>
var x = 0;
function my_js_func(msg){
	//console.log(msg);
	x++;
}
function my_js_func_receives_lua_func(func){
	func(); //ask about parameters here
}
function JQObj(s){
	return $(s);
}
</script>
<?lua@client

local function timer(msg)
	local start = window.performance:now()
	print("Begin", msg)
	return function()
		local endtimer = window.performance:now()
		print("End", msg, endtimer-start)
	end
end

local t = timer("Function 1 JS")
for i=1,10000 do
	local app = window.document:getElementById('app')
	app.textContent = i
end
t()

t = timer("Function 2 JS")
for i=1,10000 do
	local app = window.document:getElementById('app')
	app.textContent = i
end
t()


t = timer("Function 3 JS")
for i=1,10000 do
	local app = window.document:getElementById('app2')
	app.textContent = i
end
t()

t = timer("Function 4 JQuery")
for i=1,10000 do
	local app = window:JQObj('#app')
	app:html('lalalala'..i)
end
t()


t = timer("Function 5 Lua-JS callbacks")
function this_is_lua() -- ask about parameters here?
	window:my_js_func('This is Lua being printed from a listener in JS')
end
for i=1,10000 do
	window:my_js_func_receives_lua_func(this_is_lua)
end
t()

t = timer("Function 6 Require")
local v = require "valua"
for i=1,10000 do
	local val = v:new().len(3,5)
	
	-- Something is increasing starlight time here in comparison to moonlight
	-- But its not the require itself since thats done one time
	-- val('oi')
	-- This function call is making a lot of difference
end
t()


t = timer("Function 7 Figuring out")
local function len(value,min,max)
	local len = string.len(value or '')
	if len < min or len >max then return false,"should have "..min.."-"..max.." characters" end
	return true
end
local test = {}
table.insert(test,len)
for i=1,10000 do	
	for k, v in ipairs(test) do
		v('oi',3,5)
	end
	-- Something is up with ipairs?
end
t()


t = timer("Function 8 Insert on table")
test = {}
for i=1,1000 do	
	test[i] = i
end
t()

t = timer("Function 9 Read from table using ipairs")
test = {}
for i=1,10000 do	
	for k, v in ipairs(test) do	
		test[k] = k + 1
	end
end
t()

t = timer("Function 10 Read from table using pairs")
test = {}
for i=1,10000 do	
	for k, v in ipairs(test) do	
		test[k] = k + 1
	end
end
t()
?>