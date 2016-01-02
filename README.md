#Sailor

A Lua MVC Framework. www.sailorproject.org

[![Build Status](https://travis-ci.org/Etiene/sailor.svg?branch=master)](https://travis-ci.org/Etiene/sailor)
[![Issue Stats](http://issuestats.com/github/Etiene/sailor/badge/pr)](http://issuestats.com/github/Etiene/sailor)
[![Join the chat at https://gitter.im/Etiene/sailor](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/Etiene/sailor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE)
[![Support via Gratipay](http://img.shields.io/gratipay/Etiene.svg)](https://gratipay.com/Etiene) 
[![Bountysource](https://img.shields.io/bountysource/team/sailor/activity.svg)](https://www.bountysource.com/teams/sailor)

[![LuaRocks](https://img.shields.io/badge/LuaRocks-0.5.0-blue.svg)](https://luarocks.org/modules/etiene/sailor)
[![Lua](https://img.shields.io/badge/Lua-5.1%2C%20JIT%2C%205.2-blue.svg)](https://img.shields.io/badge/Lua-5.1%2C%20JIT%2C%205.2-blue.svg)
[![Twitter Follow](https://img.shields.io/twitter/follow/sailor_lua.svg?style=social)](https://twitter.com/sailor_lua)

### Features
  * Compatible with Lua 5.1, Lua 5.2 and LuaJIT
  * Luarocks setup
  * Runs over Apache2 (with mod_lua), NginX (openresty), Mongoose, Lighttpd, Xavante and Lwan web servers
  * Using Windows, Mac or Linux systems
  * Compatible with MySQL, PostgreSQL, SQLite and other databases supported by the luasql library
  * MVC structure
  * Parsing of Lua pages
  * Routing
  * Basic Object-relational mapping
  * Validation
  * Transactions
  * App comes already shipped with Bootstrap
  * Include, redirect
  * Sessions, cookies
  * Login module
  * Easy deployment (unix only) -> sailor create "app name" /dir/to/app
  * Form generation
  * Lua at client (possible through a Lua=>JS virtual machine deployed with the app)
  * Friendly urls
  * Inspect function for better debugging => similar to a var dump
  * Custom 404 pages
  * Relations
  * Model generation (reading from DB)
  * CRUD generation (reading from model)
  * Theme and layout (now you can have multiple layouts inside a theme. e.g. 1-column and 2-column)
  * Integration with Busted for unit and functional tests for your app


### Roadmap
* Integration with mod_lua's DB API and DB module refactor
* Improvements to the form and validation module

More about the motivation to build this project can be found here: http://etiene.net/10/sailor

### Directory tree info
* /docs - this one is supposed to have documentation
* /lua-to-js-vms - different Lua->Javascript virtual machines for use of Lua on the browser with Sailor
* /rockspecs - Rockspec files for LuaRocks install
* /src - Lua modules with nice stuff from sailor and other places.
 * /sailor - Sailor modules
 * /sailor/blank-app - blank Sailor web app, can be copy-pasted as base for your own apps
* /test - apps for testing and demonstration purposes

### Supported Environments

Sailor has been tested under Linux, Mac OS X and Windows and is currently compatible with Apache with [mod_lua](http://www.modlua.org/) or [mod_pLua](https://github.com/Humbedooh/mod_pLua), Nginx with [ngx_lua](https://github.com/openresty/lua-nginx-module), [Lwan](http://lwan.ws/), Lighttpd with [mod_magnet](http://redmine.lighttpd.net/projects/1/wiki/Docs_ModMagnet), or any CGI-enabled web server, like [Civetweb](https://github.com/civetweb/civetweb), [Mongoose](https://github.com/cesanta/mongoose) and [Xavante](http://keplerproject.github.io/xavante/), if [CGILua](https://github.com/keplerproject/cgilua) is present.

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
* /tests - unit and functional tests
* /views - this is where your lua pages in .lp will go

#### Creating Pages #
Go to /controllers and create your first controller! It should be a lua module. Name it whatever you want, our example is "site.lua". We will serve two pages, one accessible via <domain>/?r=site which will run site.index() by default and another one acessible via <domain>/?r=site/notindex.
```lua
local site = {}
local model = require "sailor.model"
function site.index(page)
  local foo = 'Hello world'
  local User = model("user")
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

### Documentation & Reference Manual
http://sailorproject.org/?r=docs


### Contributing
Contributions are welcome! Just make a pull request :) Please try to follow the code style of the rest of the repository.

If you made an extension for Sailor and would like to share, please get in contact so I can add it to the website.

### Thanks

This repository contains the following third-party MIT licensed code:

* LP Templates - http://keplerproject.github.io/cgilua/manual.html#templates
* Valua - https://github.com/Etiene/valua
* Lua at client - https://github.com/felipedaragon/lua_at_client
* Moonshine - http://moonshinejs.org/
* Lua5.1.js - https://github.com/logiceditor-com/lua5.1.js
* Lua.vm.js - https://kripken.github.io/lua.vm.js/lua.vm.js.html 
* Starlight - https://github.com/paulcuth/starlight


### Suggestions, questions & hugs
Hugs! Not bugs. For bugs, fill an issue! :)

dalcol@etiene.net

https://twitter.com/etiene_d

### Mail List & Support
[Join our google group for mail list and support](https://groups.google.com/forum/#!forum/sailor-l)


##### If you are having trouble to get Sailor working or if you got it working using different specs, please make contact so we can exchange info and I can improve the manual. Thanks!

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/Etiene/sailor/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
