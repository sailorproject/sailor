##Controllers

When you access a Sailor application, you will be routed to your page depending on the url. If there is nothing to route, sailor will load the default action specified in your conf.lua. Supose the accessed url is `localhost/your_application/?r=main/index` (no friendly urls) or `localhost/your_application/main/index` (friendly urls activated). That means Sailor will try to find an action named 'index' inside a controller named 'main' on your application and run that function.

A controller is a .lua file inside `/controllers` on your app's directory tree named after your controller's name.  This is the basic structure of our `main.lua`:

    local main = {} --a table 
    
    --Your actions are functions indexed by this table. They receive the 'page' object.
    function main.index(page)
        --Let's send a message to our view
        page:render("index", { msg = "Hello"})
    end

    return main --don't forget to return your controller at the end of the file.


You can have multiple actions inside your controller, all of them are functions indexed to a table you will return at the end of your controller. The action receives the 'page' object as an argument and this object contains attributes and methods for interacting with your page. The first method we will learn is `page:render()`. For other methods of the page object, please consult the reference manual.

The render method has two parameters, a string with the view file to be rendered and a table with the vars that are being passed ahead. Sailor will look for your view file inside `/views/controller_name/file_name.lp`. So, a `page:render('index',{msg="Hello"})` executed from the main controller will render `/views/main/index.lp` and from that view you will have access to a variable named 'msg' containing the string 'Hello' (and the page object, which is also passed ahead by default). If you have configured a theme and a layout or are using the default theme and layout, Sailor will first render the layout and then render your view wrapped inside it, otherwise it will render your view directly.
