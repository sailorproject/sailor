## Installation for Mac

Sailor is compatible with a variety of operating systems and webservers. On this example, we will use OS X 10.10 Yosemite

### Basic installation through LuaRocks (Xavante web server)

For the purpose of this guide, it will be assumed that you already have Homebrew installed. Sailor is compatible with both Lua 5.1 and Lua 5.2 and either of them can be installed through brew. 

Let's begin by installing Lua (by default brew will install the version 5.1) and LuaRocks. LuaRocks is a package manager for Lua modules and if you don't have it already you will find it very useful. If you already have these, you may skip this step.

    brew update
    brew install lua luarocks 


Now we need to install Sailor:

    luarocks install sailor

When installing Sailor through LuaRocks most of the dependencies will be installed with it, including Xavante, a lightweight webserver also written in Lua. However, libraries for manipulating data on a database will not be installed automatically because which database to use when developing a web application will be up to the developer. Once you have installed and configured your database of choice, you must also install the apropriate LuaSQL driver to allow your Sailor apps to communicate with it. So, supposed you are using MySQL, you must install LuaSQL-MySQL

    luarocks install luasql-mysql

Now everything is ready to create and run your app!

    sailor create "My app"
    cd my_app
    lua start-server.lua

You can view your app by opening your browser and navigating to `http://localhost:8080`.

If you wish to use different web servers, please, read on.


### Alternative setup with Apache 2.4 and mod_lua
    
This guide assumes that you have already completed Sailor's basic installation through LuaRocks. Now we need Apache, that can be installed view homebrew. The default apache build however, does not come with Lua module by default, so we must edit the brew install file. Also, Apache is not in the default repository of Homebrew formulas, nor are some dependencies, so we use the "brew tap" command to add other formula repositories.

	brew tap djl/homebrew-apache2
	brew install djl/apache2/apache24
    brew edit apache24

Find the list of enabled flags, after `args = [`, add `--enable-lua` and save the file. You can add other flags to the argument list if necessary. The file is ususally localted at "/usr/local/Library/Taps/djl/homebrew-apache2/apache24.rb".

    brew install apache24

Alternatively, if you are having issues downloading Apache via homebrew, you can download it directly from [apache.org](http://apache.org) and compile your own build. Remember to add the `--enable-lua` flag when running `./configure` along with other flags you may wish.

Now, you need to enable `mod_lua` in Apache's configuration file. The file will probably be located at `/usr/local/etc/apache2/httpd.conf`. Add or uncomment the following directive:

    LoadModule lua_module modules/mod_lua.so

Change the DirectoryIndex directive to:

    DirectoryIndex index.lua index.html
    
Add the SetHandler directive:

    <FilesMatch "\.lua$">
      SetHandler lua-script
    </FilesMatch>

It's also necessary to allow `.htaccess` files. Look for the `AllowOverride` directive in the configuration file and change from `None` (the default) to `All`. Now you can either add a VirtualHost for Apache to read from the directory of your previously created app or simply create your apps inside the directory Apache is reading from (for example /usr/local/var/www/htdocs). It is also necessary to 

    sailor create "My app" /usr/local/var/www/htdocs

Now, you should start Apache. You can use the following command for that:

    sudo apachectl start

You can view your app by opening your browser and navigating to `http://localhost/my_app`.

Keep in mind that this guide was made with a specific version of Apache (2.4.12) and in future releases some details might change. Other details like the location of apache's configuration files might also change according to the installation method used. It is recommended to always install the latest version of Apache.


### Alternative setup using Nginx and [OpenResty](http://openresty.org/)

This guide assumes that you have already completed Sailor's basic installation through LuaRocks. Now we need OpenResty. Please follow the guide at [openresty.org](http://openresty.org/#Download) to download and install it. It is recommended to always install the latest version.

Additionally, it might be necessary to add nginx binary to the PATH:

    PATH=/usr/local/openresty/nginx/sbin/:$PATH

Then you can create your app and run it!

    sailor create "My app"
    cd my_app
    nginx -p `pwd`/ -c conf/nginx.conf 

And a small useful information, if you want to restart the server, run this same last comment but with an additional reload command:

    nginx -p `pwd`/ -c conf/nginx.conf  -s reload

