## Installation for Linux
Sailor is compatible with a variety of operating systems and webservers. On this example, we will use Arch Linux and Apache 2.4.12.

### Installing Lua

If you don't have it already, install Lua. Sailor is compatible with both 5.1 and 5.2.

    sudo pacman -Sy
    sudo pacman -S lua-{sec,socket}

### Installing Apache 2.4

Use the following command to install Apache 2.4.x:

    sudo pacman -S apache

Enable mod_lua

Edit httpd.conf and enable the mod_lua.so module:

    sudo yourtexteditor /etc/httpd/conf/httpd.conf

The following line must be uncommented:

    LoadModule lua_module modules/mod_lua.so
    
Change the DirectoryIndex directive to:

    DirectoryIndex index.lua index.html
    
Add the SetHandler directive:

    <FilesMatch "\.lua$">
      SetHandler lua-script
    </FilesMatch>

Enable Apache

    systemctl enable httpd.service
    
If it is already enabled, restart it:

    systemctl restart httpd.service

### Installing Sailor
You can either clone it directly from the repository, download the zip containing the master branch or download and install it through LuaRocks. We will go through LuaRocks since it will also download and install almost all the required dependencies except for luasql-mysql if you want to persist your models.

    sudo pacman -S luarocks
    sudo luarocks install sailor

We are almost done! You can now use `sailor` to create your web applications. In this example, we will create an app called "Hey Arnold" on the directory Apache is reading from (usually /var/www). After you're done, you can open your browser and access it on http://localhost/hey_arnold

    sailor create 'Hey Arnold' /srv/http

Alternatively, you can manually copy the files in the /src/sailor/blank-app directory of this repository to /srv/http/hey_arnold and access it at <http://localhost/hey_arnold> and if you didn't install sailor through LuaRocks, you must open .htaccess and replace {{path}} with the full path on your system to Sailor's src directory.

#### Dependencies
If you want to persist your models you need luasql. Sailor could work with other drivers but so far we've only tested with mysql and don't offer support for others.

    sudo luarocks install luasql-mysql

If you installed Sailor through LuaRocks, there is no need to worry, all next dependencies will be installed with it and you can ignore the rest of this section. If you just cloned the repository or downloaded the zip, you should install these dependencies:

Lua File System and valua are required.

    sudo luarocks install luafilesystem
    sudo luarocks install valua

If you want to save your models in a database, you will need LuaSQL. I believe it should work with every database LuaSQL supports, but so far I have only tested with MySQL. LuaSQL-MySQL requires you to have mysql installed.

    sudo luarocks install LuaSQL-MySQL

If you want to use our mailer module, get these rocks so we are able to send stuff via SMTP.

    sudo luarocks install LuaSocket
    sudo luarocks install LuaSec

LuaSec requires OpenSSL as a dependency, if you don't have it already please install it and try getting LuaSec again. Remember to install "devel" packages, if your distro has them, to get the header files! If LuaSec can't find your OpenSSL dir, try using these flags, depending on your system's architecture (the examples below work on some Linux distros).

    sudo luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/x86_64-linux-gnu
or

    sudo luarocks install LuaSec OPENSSL_LIBDIR=/usr/lib/i386-linux-gnu
