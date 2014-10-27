## Installation for Mac

Sailor is compatible with a variety of operating systems and webservers. On this example, we will use OS X 10.9 Mavericks and Apache 2.4.

### Installing dependencies

Sailor is compatible with both Lua 5.1 and Lua 5.2. OS X 10.9 Mavericks already comes with Apache 2.2 by default, but you can't use Lua scripts on it.

We need to install Lua, luarocks and Apache 2.4.

    brew update
    brew install lua luarocks zlib homebrew/apache/httpd24

After installing those packages, you'll need to add a couple of directives to Apache's configuration file. The file will probably be located at `/usr/local/etc/apache2/2.4/httpd.conf`. First, you'll need to add or uncomment the following directive:

    LoadModule lua_module modules/mod_lua.so

Secondly, you need to register the following handler for *.lua files:

    <Files *.lua>
        SetHandler lua-script
    </Files>

Finally, you need to look for the `DirectoryIndex` setting and change it to `index.lua`.

Now, you should restart Apache. You can use the following command for that:

    sudo /usr/local/Cellar/httpd24/2.4.10/bin/apachectl restart

Keep in mind that the specific version of Apache (in this case 2.4.10) might change.

### Installing Sailor

You can either clone it directly from the repository, download the zip containing the master branch or download and install it through LuaRocks. We will go through LuaRocks since it will also download and install almost all the required dependencies, except for luasql-mysql (which is needed if you want to persist your models).

    luarocks install sailor

We are almost done! You can now use `sailor_create` to create your web applications. In this example, we will create an app called "Hey Arnold" on the directory Apache is reading from (usually /usr/local/var/www/htdocs). After you're done, you can open your browser and access it on http://localhost/hey_arnold .

    sailor_create 'Hey Arnold' /usr/local/var/www/htdocs


#### Dependencies

If you want to persist your models you'll need luasql. Sailor could work with other drivers but so far we've only tested with MySQL and don't offer support for others.

    luarocks install luasql-mysql

If you installed Sailor through LuaRocks, there is no need to worry, all next dependencies will be installed with it and you can ignore the rest of this section. If you just cloned the repository or downloaded the zip, you should install these dependencies:

Lua File System and valua are required.

    luarocks install luafilesystem
    luarocks install valua

If you want to save your models in a database, you will need LuaSQL. I believe it should work with every database LuaSQL supports, but so far I have only tested with MySQL. LuaSQL-MySQL requires you to have mysql installed.

    luarocks install LuaSQL-MySQL

If you want to use our mailer module, get these rocks so we are able to send stuff via SMTP.

    luarocks install LuaSocket
    luarocks install LuaSec

LuaSec requires OpenSSL as a dependency, if you don't have it already please install it and try getting LuaSec again. Remember to install "devel" packages, if your distro has them, to get the header files! If LuaSec can't find your OpenSSL dir, try using these flags, depending on your system's architecture (the examples below work on some Linux distros).

    luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
or

    luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
