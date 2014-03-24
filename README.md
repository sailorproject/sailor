Sailor
======

A Lua MVC Framework. www.sailorproject.org

### Development progress
So far I have integrated with @mascarenhas's Lua Pages as a nice templater for views, we also have controllers, a mailer module,  routes, basic models, db connection, a validation module and some other stuff. I'm now working on researching and refactoring the foundations since mod_lua turned out to be very limited so I can work on sessions. After that is done I'll go back to work on forms generation and organizing the whole thing for an easy build.

More about this project's motivation can be found here: http://etiene.net/sailor-building-a-lua-based-mvc-framework/

### Directory tree info
* /docs - this one is supposed to have documentation
* /src - Lua modules with nice stuff from sailor and other places.
 * /sailor - Sailor modules
 * /sailor/demo-app - default Sailor web app
* /test - apps for testing and demonstration purposes

### Supported Environments

Sailor is currently compatible with the environments listed below and was tested under Linux, Windows and Mac OS X.

* Apache with mod_lua <http://www.modlua.org/>
* Apache with mod_plua <https://github.com/Humbedooh/mod_pLua>
* Nginx with ngx_lua (HttpLuaModule) <https://github.com/nginx/nginx>
* Any web server with CGILua <https://github.com/keplerproject/cgilua> Tested with:
 * Apache
 * Civetweb <https://github.com/sunsetbrew/civetweb>
 * Mongoose <https://github.com/cesanta/mongoose>

Lighttpd is planned for the future.

### Installation

For Linux, see [INSTALL_LINUX.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_LINUX.md)

For Windows, see [INSTALL_WIN.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_WIN.md)

### Using Sailor
A default Sailor app will have the following directory tree structure:
* /conf - configuration files, open and edit them.
* /controllers - controllers you will make!
* /layouts - default layout files. 
* /models - models you will make!
* /pub - publicly accessible files (js libraries, for example)
* /runtime - temporary files generated during runtime.
* /views - this is where your lua pages in .lp will go

#### Creating Pages #
Go to /controllers and create your first controller! It should be a lua module. Name it whatever you want, our example is "site.lua". We will serve two pages, one accessible via <domain>/?r=site which will run site.index() by default and another one acessible via <domain>/?r=site/notindex.
```lua
local site = {}
function site.index(page)
  local foo = 'Hello world'
  local User = sailor.model("user")
  local u = User:new()
  u.username = "etiene"
  u.password = "a_password"
  local valid, err = u:validate() -- validate() will check if your attributes follow the rules!
  if not valid then
    foo = "Boohoo :("
  end

  -- Warning: this is a tech preview and some methods of model class do not avoid SQL injections yet.
  page:render('index',{foo=foo,name=u.username}) -- This will render /views/site/index.lp and pass the variables 'foo' and 'name'
end
function site.notindex(page)
  page:write('<b>Hey you!</b>')
end
return site
```
Go to /views, create a dir named 'site' to match your controller name and create your first page, our example is index.lp

```html
<?=foo?>
<p>
  Hi, <?=name?>
</p>
```
For more information on what you can do with html and Lua Pages, visit http://keplerproject.github.io/cgilua/manual.html#templates 

For more examples, you can check the test controller (/controllers/test.lua), the test views (/views/test/*) and the User model (/models/user.lua)

### Suggestions or questions
dalcol@etiene.net

http://twitter.com/MulherCerebro


##### If you are having trouble to get it working or if you got it working using different specs, please contact me so we can exchange info and I can improve this manual. Thanks!
