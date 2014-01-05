sailor
======

A Lua MVC Framework.


### Installation for debian-like systems
Install apache2.4
```
apt-get isntall apache2
```
Some systems install apache2.2 by default, as ubuntu, for example. You can get 2.4 by
```
apt-add-repository ppa:ptn107/apache
apt-get update
apt-get install apache2
```
Then you can finally install mod lua for apache.
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
Install LuaRocks and get some other modules so we are able to send stuff via smtp
```
apt-get install luarocks
luarocks install LuaSocket
luarocks install LuaSec
```
LuaSec requires openssl as a dependency, if you don't already have it please install these and try getting luasec again
```
apt-get install openssl libssql-dev
```
If luasec can't find your openssl dir, try using these flags, depending on your sistem's architecture
```
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
or
luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
```
