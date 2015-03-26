#Sailor
A Lua MVC Framework. www.sailorproject.org

[![HuBoard badge](http://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/Etiene/sailor)
[![Support via Gratipay](http://img.shields.io/gratipay/Etiene.svg)](https://gratipay.com/Etiene) 

### Features
* Up until last release 
  * Luarocks setup
  * Runs over Apache2, NginX or Mongoose webservers
  * Using Windows, Mac or Linux systems
  * Compatible with MySQL, PostgreSQL, SQLite and others
  * MVC structure
  * Parsing of Lua pages
  * Routing
  * Email sending
  * Basic Object-relational mapping
  * Validation
  * Layouts support 
  * App comes already shipped with Bootstrap
  * Include, redirect
  * Sessions, cookies
  * Login module
  * Easy deployment (unix only) -> sailor_create "app name" /dir/to/app
  * Form generation
  * Lua at client (possible through a Lua=>JS virtual machine deployed with the app)

* Features not yet released through Luarocks, but present in master branch
  * Friendly urls
  * Inspect function for better debugging => similar to a var dump
  * Custom 404 pages
  * Runs over Lighttpd, Xavante and Lwan web servers
  * Relations
  * Model generation (reading from DB)
  * CRUD generation (reading from model)
  * Theme and layout (now you can have multiple layouts inside a theme. e.g. 1-column and 2-column)


### Development progress
So far I have integrated with @mascarenhas's Lua Pages as a nice templater for views, we also have controllers, a mailer module,  routes, basic models, db connection, a validation module, integration with lua51.js so we can use Lua at client-side, basic form generation, sessions, basic authentication, auto generation for models and CRUDs and some other stuff. We are now working on researching, refactoring, and making documentation for releasing a version 0.3. After that is done the roadmap is rewriting the DB module for benefiting from mod_lua's API, improving the autogen and the form features.

More about this project's motivation can be found here: http://etiene.net/sailor-building-a-lua-based-mvc-framework/

### Directory tree info
* /docs - this one is supposed to have documentation
* /src - Lua modules with nice stuff from sailor and other places.
 * /sailor - Sailor modules
 * /sailor/demo-app - blank Sailor web app, can be copy pasted as base for your own apps
* /test - apps for testing and demonstration purposes

### Supported Environments

Sailor has been tested under Linux, Mac OS X and Windows and is currently compatible with Apache with [mod_lua](http://www.modlua.org/) or [mod_pLua](https://github.com/Humbedooh/mod_pLua), Nginx with [ngx_lua](https://github.com/chaoslawful/lua-nginx-module), Lighttpd with [mod_magnet](http://redmine.lighttpd.net/projects/1/wiki/Docs_ModMagnet), or any CGI-enabled web server, like [Civetweb](https://github.com/bel2125/civetweb), [Mongoose](https://github.com/cesanta/mongoose) and [Xavante](http://keplerproject.github.io/xavante/), if [CGILua](https://github.com/keplerproject/cgilua) is present.

### Installation

For Linux, see [INSTALL_LINUX.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_LINUX.md) (Ubuntu) or [INSTALL_LINUX_ARCH.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_LINUX_ARCH.md) (Arch Linux)

For Windows, see [INSTALL_WIN.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_WIN.md)

For Mac, see [INSTALL_MAC.md](https://github.com/Etiene/sailor/blob/master/docs/INSTALL_MAC.md)

### Using Sailor
A default Sailor app will have the following directory tree structure:
* /conf - configuration files, open and edit them.
* /controllers - controllers you will make!
* /themes - default theme files.
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

http://twitter.com/etiene_d


##### If you are having trouble to get it working or if you got it working using different specs, please contact me so we can exchange info and I can improve this manual. Thanks!
