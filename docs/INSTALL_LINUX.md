## Installation for Debian-like systems

### Installing Lua

If you don't have it already, install Lua. Sailor is compatible with both 5.1 and 5.2.

    apt-get install lua5.2
    
#### Dependencies for persisting models
If you want to save your models in a database, you will need LuaSQL. I believe it should work with every db LuaSQL supports but so far I have only tested with MySQL. Install luarocks and get these rocks. LuaSQL-MySQL requires you to have mysql installed.

    apt-get install luarocks
    luarocks install LuaSQL-MySQL

If LuaSQL-MySQL can't find its dir, try using these flags and specify MySQL dir.

    luarocks install LuaSQL-MySQL MYSQL_INCDIR=/usr/include/mysql

#### Dependencies for the mailer module
If you want to use our mailer module, however, you will need a couple more of tricks.
Get these rocks with luarocks so we are able to send stuff via SMTP.

    luarocks install LuaSocket
    luarocks install LuaSec

LuaSec requires openssl as a dependency, if you don't already have it please install these and try getting luasec again

    apt-get install openssl libssl-dev

If LuaSec can't find your openssl dir, try using these flags, depending on your system's architecture.

    luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
    or
    luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
    
### Installation for Apache 2

Install apache2.4

    apt-get install apache2

Some systems install apache2.2 by default, as Ubuntu, for example. You can get 2.4 by

    apt-add-repository ppa:ptn107/apache
    apt-get update
    apt-get install apache2
    
#### Configuring mod_lua

Then you can finally install mod_lua for Apache.

    a2enmod lua

Open /etc/apache2/mods-enabled/lua.load and add at the end of file

    <FilesMatch "\.lua$">
    AddHandler lua-script .lua
    </FilesMatch>
    
#### Done!

Now you are ready to go!

    service apache2 restart

Use `sailor_create.lua` to create your app

Alternatively, you can manually copy the files in the /src/sailor/demo-app directory of this repository to /var/www/sailor and access it at <http://localhost/sailor>

###Installation for Nginx

TODO

