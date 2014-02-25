Sailor
======

A Lua MVC Framework. www.sailorproject.org

### Development progress
So far I have integrated with @mascarenhas's Lua Pages as a nice templater for views, we also have controllers, a mailer module,  routes, basic models, db connection, a validation module and some other stuff. I'm now working on researching and refactoring the foundations since mod_lua turned out to be very limited so I can work on sessions. After that is done I'll go back to work on forms generation and organizing the whole thing for an easy build.

More about this project's motivation can be found here: http://etiene.net/sailor-building-a-lua-based-mvc-framework/

### Directory tree info
* /conf - configuration files, open and edit them.
* /controllers - controllers you will make!
* /doc - this one is supposed to have documentation
* /models - models you will make!
* /src - Lua modules with nice stuff from sailor and other places.
* /views - this is where your lua pages in .lp will go

### Installation for Debian-like systems
If you don't have it already, install Lua. Sailor is compatible with both 5.1 and 5.2.
```
apt-get install lua5.2
```

Install apache2.4
```
apt-get install apache2
```
Some systems install apache2.2 by default, as Ubuntu, for example. You can get 2.4 by
```
apt-add-repository ppa:ptn107/apache
apt-get update
apt-get install apache2
```
Then you can finally install mod_lua for Apache.
```
a2enmod lua
```
Open /etc/apache2/mods-enabled/lua.load and add at the end of file
```
AddHandler lua-script .lua
```
Now you are ready to go!
```
service apache2 restart
```
Clone the contents of this repository to /var/www and access it at localhost/sailor

#### Dependencies for persisting models
If you want to save your models in a database, you will need LuaSQL. I believe it should work with every db LuaSQL supports but so far I have only tested with MySQL. Install luarocks and get these rocks. LuaSQL-MySQL requires you to have mysql installed.
```
apt-get install luarocks
luarocks install LuaSQL-MySQL
```
If LuaSQL-MySQL can't find its dir, try using these flags and specify MySQL dir.
```
luarocks install LuaSQL-MySQL MYSQL_INCDIR=/usr/include/mysql
```

#### Dependencies for the mailer module
If you want to use our mailer module, however, you will need a couple more of tricks.
Get these rocks with luarocks so we are able to send stuff via SMTP.
```
luarocks install LuaSocket
luarocks install LuaSec
```
LuaSec requires openssl as a dependency, if you don't already have it please install these and try getting luasec again
```
apt-get install openssl libssl-dev
```
If LuaSec can't find your openssl dir, try using these flags, depending on your system's architecture.
```
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
or
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
```

### Using Sailor
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
