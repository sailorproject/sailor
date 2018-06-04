###Reference Manual

###Sailor built-in functions
Can be used anywhere in a Sailor web application.

####sailor.make_url( route [*, params*] )
Creates a url for an internal app route depending on friendly url configuration.
 
 * route: string, controller/action or controller.

 * params: [optional] table, vars and values to be sent via GET.

Example 1: `sailor.make_url( 'post/view', {id = 5, title = 'Manual'} )`

####sailor.model( model_name )
Creates a sailor model that can be instantiated in objects with :new(). 

 * model_name: string, model's name. There must be a .lua file with the model's name under /model.

Example 1: 

    -- In this case there must be a file inside /model called user.lua
    local User = sailor.model( 'user' ) 
    local u = User:new( )