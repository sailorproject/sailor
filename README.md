Sailor
======

A Lua MVC Framework. www.sailorproject.org

### Development progress
So far I have integrated with @mascarenhas's Lua Pages as a nice templater for views, we also have a mailer module and routes. I'm now working on improving controller routes, getting sailor to connect with databases and building the M of your MVC.

### Directory tree info
* /conf - configuration files, open and edit them.
* /controllers - controllers you will make!
* /doc - this one is supposed to have documentation
* /models - models you will make!
* /src - Lua modules with nice stuff from sailor and other places.
* /views - this is where your lua pages in .lp will go

### Installation for Debian-like systems
Install Lua 5.2
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


#### Dependencies for the mailer module
If you want to use our mailer module, however, you will need a couple more of tricks.
Install LuaRocks and get some other modules so we are able to send stuff via SMTP.
```
apt-get install luarocks
luarocks install LuaSocket
luarocks install LuaSec
```
LuaSec requires openssl as a dependency, if you don't already have it please install these and try getting luasec again
```
apt-get install openssl libssl-dev
```
If LuaSec can't find your openssl dir, try using these flags, depending on your system's architecture
```
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
or
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
```

### Using Sailor
Go to /controllers and create your first controller! It should be a lua module. Name it whatever you want, our example is "site.lua". We will serve two pages, one accessible via <domain>/?r=site which will run site.index() by default and another one acessible via <domain>/?r=site/notindex.
```
local site = {}
function site.index(page)
  local foo = 'Hello world'
  page:render('index',{foo=foo}) -- This will render /views/index.lp and pass the variable 'foo'
end
function site.notindex(page)
  page:write('<b>Hey you!</b>')
end
return site
```
Go to /views and create your first page, our example is index.lp
```
<html>
  <head><title>This is my first page!<title></head>
  <body>
    <%=foo%>
  </body>
</html>
```
For more information on what you can do with html and Lua Pages, visit http://keplerproject.github.io/cgilua/manual.html#templates 

### Suggestions or questions
dalcol@etiene.net
