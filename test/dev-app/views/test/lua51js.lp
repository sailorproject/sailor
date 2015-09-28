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
	local start = os.time()
	js.console:log("Begin "  .. msg)
	return function()
		local endtimer = os.time()
		js.console:log("End " .. msg .. " " .. endtimer-start)
	end
end

local t = timer("Function 1 loop")
for i = 1, 10000000 do
	local a = i
end
t()

--[[ does not work yet
t = timer("Function 2 JS")
for i=1,10000 do
	local app = js.document:getElementById('app') -- DOES NOT EXIST
	app.textContent = i
end
t()
]]

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