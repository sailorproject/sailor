##Views
Sailor's views are Lua Page files (.lp) contained inside your `/views`folder. They are valid HTML files in all aspects, except for the .lp extension and the fact that you can also use `<?lua >` tags inside it to execute lua scripts. 

Let's create our `/views/main/index.lp`: 

    This is valid HTML! You can: <br/>

    * Use regular HTML <b>tags</b>. <br/>

    * Run Javascript on your browser <script> alert("hi");</script><br/>

    * Run Lua scripts from your server 
    <?lua 
      page:print(msg) 
    ?> <!--If this came from the controller we just created in the last section of our tutorial, this will print 'Hello'--> 
    <%= msg %> <!--This will do the same thing -->
    <br/>

    * Intercalate Lua code with HTML
    <?lua
    for i=1,10 do ?>
    This message will appear 10 times! This is number <%= i %>.
    <?lua end ?>

    * Use the page object and all its functions, for example, page:include().
    <?lua page:include("/path/to/my/.lp/file/without/extension") ?>
    <?lua page:include("views/docs/_menu") ?>


You can also write Lua code that will run on the browser, if you want to. This is possible because Sailor will get this piece of code and give it to a Virtual Machine that will handle it and run Javascript behind the scenes. There are different Virtual Machines available, however, `starlight` is the default. Other options are `moonshine`, `lua51js` and `luavmjs`. They have slight differences on features, performance and how they handle DOM manipulation. Since starlight is the default, the following example will work on it, but also on moonshine. You can find more details about these differences on the reference manual.


To write Lua code on a view that will run on the browser, you need to annotate your `<?lua ?>` tag. So, code inside `<?lua@client ?>` will run on the browser, inside `<?lua@both ?>` will run both on the server side and on the browser and inside `<?lua@server ?>`, which can be simply written as `<?lua ?>`, is the default and will run on the server side.

Here are some examples of Lua code that will run on the browser using the `starlight` virtual machine:

 * Manipulation of the DOM

    <div id="app"></div>
    <?lua@client

    local app = window.document:getElementById('app')
    print(app.textContent)
    app.textContent = 'lets go'

    window:alert('This code was written in Lua')

    ?>


* Accessing Javascript functions and passing callbacks


    <script>
    function myJSFunction(msg){
        console.log(msg);
    }

    function myJSFunctionReceivesCallback(callback){
        callback();
    }
    </script>

    <?lua@client
    window:myJSFunction('Calling a Javascript function from Lua')

    local function lua_callback()
        print('This is being printed from a Lua function being called in JS')
    end
    
    window:myJSFunctionReceivesCallback(callback)
    
    ?>

* Exporting Lua modules to the browser

Remember that this code will run on the browser and some Lua modules won't make sense being used in this context! Attention: this feature is still under tests.


    <?lua@client
    local valua = require "valua"
    -- If you installed Sailor, valua, our valuation module, was installed as a dependency
    
    local v = valua:new().len(3,10)
    print(v('Geronimo'))
    -- true
    ?>

* Accessing Javascript modules such as JQuery

    <script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
    <script>
    function JQObj(s){
        return $(s);
        // This is necessary because the $() syntax will error on Lua
    }
    </script>

    <div id="app"></div>

    <?lua@client
    local app = window:JQObj('#app')
    app:html('This will be the new content of the div') 
    -- .html() is a JQuery function. Please observe that in Lua we will use the ':' notation
    ?>

