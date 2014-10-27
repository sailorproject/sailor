##Installation for Windows

### Installing Lua

First, download and install Lua for Windows. You can get it from:

<https://code.google.com/p/luaforwindows/>

Copy the files in the `src` directory of this repository to C:/Program Files/Lua/5.1/lua/

You will also need the LuaSec's ssl library, which is included in this ZIP:

<https://github.com/pkulchenko/ZeroBraneStudio/archive/0.35.zip>

Unzip it and copy the `ssl.dll` file in the bin\clibs directory of the archive to C:/Program Files/Lua/5.1/clibs/

Copy the `ssl.lua` file and the `ssl` subdir in the lualibs directory to C:/Program Files/Lua/5.1/lua/

Alternatively, you may want to try to install it via luarocks:

    luarocks install LuaSec

###Installation for Apache 2

Download Apache 2.4 according to your Windows version:

Windows 7, 8/8.1, Vista, Server 2008, Server 2012 - <http://www.apachelounge.com/download/>

Windows XP - <http://www.apachelounge.com/download/win32/>

Unzip the package (eg: httpd-2.4.9-win32.zip) to C:\Apache24\

Copy the files in the `src/sailor/demo-app` directory of this repository to C:/Apache24/htdocs/sailor/

####Configuring mod_lua

Edit `\conf\httpd.conf` and uncomment the following line to enable mod_lua:

    LoadModule lua_module modules/mod_lua.so

Change the DirectoryIndex directive to:

    DirectoryIndex index.lua index.html

Add the SetHandler directive:

    <FilesMatch "\.lua$">
      SetHandler lua-script
    </FilesMatch>

Optionally, tweak mod_lua for high performance:

    LuaScope thread
    LuaCodeCache stat

Add the LuaPackage* directives:

    <IfModule lua_module>
     LuaPackageCPath "C:/Program Files/Lua/5.1/clibs/?.dll"
     LuaPackagePath "C:/Program Files/Lua/5.1/lua/?.lua"
     LuaPackagePath "C:/Program Files/Lua/5.1/lua/?/init.lua"
     LuaPackagePath "C:/Apache24/htdocs/sailor/?.lua"
     LuaPackagePath "C:/Apache24/htdocs/sailor/?/init.lua"
    </IfModule>

####Alternative Installation with mod_plua

Download mod_plua from <http://sourceforge.net/projects/modplua/files/>

Install and configure it as explained at <http://sourceforge.net/p/modplua/wiki/Setting%20up%20mod_pLua/>

####Alternative Installation with CGILua

TODO

####Done!

Run bin\httpd.exe in the Apache24 directory.

Now go to <http://localhost/sailor/?r=main> in your browser. You should see the default Sailor page.

###Installation for Nginx

Download Nginx 1.5.12.1 from:

<http://nginx-win.ecsds.eu/>

If you've not done it yet, you may need to install the Visual C++ Redistributable Setup:

<http://nginx-win.ecsds.eu/vcredist_x86.exe>

Unzip the nginx ZIP to a directory of your choice.

Copy the `lua5.1.dll` and `lua51.dll` files from C:/Program Files/Lua/5.1/ to the root of the nginx directory, replacing lua51.dll from the original package.

Copy the files in the `src/sailor/demo-app` directory of this repository to the html/sailor directory of the nginx dir.

####Configuring Nginx

Rename the `conf\nginx-win.conf` file to `nginx.conf`.

Open the nginx.conf file and add to the http block:

    lua_package_path 'C:/Program Files/Lua/5.1/lua/?.lua;html/sailor/?.lua;';
    lua_package_cpath 'C:/Program Files/Lua/5.1/clibs/?.dll;';

You must also add to the server block:

    location ~ ^/sailor/(.+) {
        lua_need_request_body on;
        lua_code_cache off;
        content_by_lua_file html/sailor/$1;
        index  index.lua index.lp;
    }
    location ~* ^.+\.(?:css|eot|js|json|png|svg|ttf|woff)$ { }

####Done!

Now run nginx.exe and go to <http://localhost/sailor/index.lua?r=main> in your browser.
