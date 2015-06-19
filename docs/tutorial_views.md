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

    * Run Lua scripts on your browser or both on the server and your browser:
    <?lua@both another_msg = 'Heya' ?>
    <?lua@server page:print(another_msg) ?>
    <?lua@client
      js.window.alert(another_msg)
    ?> 

