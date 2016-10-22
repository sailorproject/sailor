##Reference Manual

###The Page object
The `page` object is being passed around controllers and views (implicitly) and it encapsulates several methods and attributes that may vary upon webservers. It can be used inside the actions of a controller and inside views.

####page:render( filename [*, parms*] )
Renders a view from a controller action, if there's a default layout configured, it will render the layout first and then render your view.

 * filename: string, filename without ".lp". The file must be inside /views/controller_name
 * parms: [optional] table, vars being passed ahead (env).

Example: `page:render( 'index', {msg = 'hello'} )`

####page:include( path [*, parms*] )
Includes a .lp file from a .lp file

 * path: string, full file path

 * parms: [optional] table, vars being passed ahead (env).

Example: `page:include( '/views/incs/_defaultmenu' )`

####page:redirect( route [*, args*] )
Redirects to another action if the route string doesn't start with 'http://' or another address if it does.

 * route: string, "controller_name/action_name" or some website address.

 * args: [optional] table, vars being passed as get parameters (only for internal redirect).

Example 1: `page:redirect( 'user/update', {id = 2} )`

Example 2: `page:redirect( 'http://google.com' )`

####page:json( data, [*, parms*] )
Serializes data as JSON and sends it to the response body.

* data: any serializable value (table, string, number)

* parms: [optional] table, vars being passed to the dkjson.encode function. Refer to the [dkjson documentation](http://dkolf.de/src/dkjson-lua.fsl/wiki?name=Documentation) for details. Useful parameters are (indent, keyorder, level).

####page:write( data )
Writes a single string to the response body.

 * data: string

Example 1: `page:write( "Hello world!")`

####page:print( data )
(Apache2): Sends one or more variables to the response body.

(Other webservers): Does the same as page:write does and writes a single string to the response body.

 * data: string

Example 1: `page:print( "Hello world!")`

Example 2 (Apache2): `page:print( "Hello", " world", "!")`

####page:inspect( var )
Will inspect a var and print the result on the bottom of the page. It can be toggled on/off by setting conf.debug.inspect to true/false. Very useful for seeing the contents of a table, for example.
* var: any type that you want to be stringfied.

Example 1: `page:inspect( page.POST )`

####page:enable_cors([headers] )
Sends [CORS headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#The_HTTP_response_headers) to the client. 

* headers: [optional] table, contains which headers to pass, if nil then `Access-Control-Allow-Origin = "*"` is used. They keys are (allow_origin, expose_headers, max_age, allow_credentials, allow_methods, allow_headers).

Example 1: `page:enable_cors()`

Example 2: `page:enable_cors({allow_origin = "http://sailorproject.org"})`

####page.POST
* table: contains the POST data, empty table if there is no POST data.

####page.GET
* table: contains the POST data, empty table if there is no POST data.

####page.title
* string *writeable*: By default it is set to the same as conf.sailor.app_name, but you can modify it before rendering a page, for example.

####page.theme
* string *writeable*: Sailor comes bundled with a default theme, using Bootstrap. This is the name of a folder inside /themes folder. You can modify the default theme of your application by edditing conf.sailor.theme. You can modify the theme of just one page by setting page.theme to something else on the controller action before rendering your page. You can set it to nil for displaying no theme at all, like for serving a JSON, for example.

####page.layout
 * string *writeable*: Sailor default's theme only comes with one layout, main. This refers to a .lp file inside the theme folder. You can create multiple layouts inside one same theme, like 1-column and 2-columns, for example.  You can modify the default layout of your application by edditing conf.sailor.layout. You can modify the layout of just one page by setting page.layout to something else on the controller action before rendering your page.

####page.r
 * userdata: request_rec structure that varies according to the webserver, comes with built-in functions.

(Apache2): [The request_rec structure](http://modlua.org/api/request).
