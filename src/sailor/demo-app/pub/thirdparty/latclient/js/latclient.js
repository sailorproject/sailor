/*
 Lua@Client - latclient.js
  A client-side executor for Lua
  Copyright (c) 2014 Felipe Daragon 
  
 License: MIT
 
*/

var C = Lua5_1.C;

var LuaCS =
{
 settings : {
  enableJS: true
 },
 ready : false,
 init : function ()
 {
  LuaCS.ready = true;
  LuaCS.C = C;
  LuaCS.L = C.lua_open();
  C.luaL_openlibs(LuaCS.L);
  LuaCS_Libs.load();
  if (LuaCS.settings.enableJS == true) {
   LuaCS_Browser.register(LuaCS.L);
   LuaCS.runLua(LuaCS.L,"require('js')");
  }
 },
 addFunction : function(L,func_name,func) 
 {
  C.lua_pushcfunction(L,Lua5_1.Runtime.addFunction(func));
  C.lua_setglobal(L, func_name);
 },
 runLua : function(L,script) {
  if (C.luaL_dostring(L, script) !== 0)
  {
    var err = C.lua_tostring(L, -1);
    C.lua_close(L);
    L = 0;
    LuaCS.printError(err);
    throw new Error("Lua error: " + err);
  }
 },
 runString : function (script)
 {
  if (LuaCS.ready == false) LuaCS.init();
  LuaCS.runLua(LuaCS.L,script);
 },
 runB64 : function (s)
 {
    LuaCS.runString(LuaCS_Utils.base64Decode(s));
 },
 runDiv : function (id)
 {
    var script = document.querySelector(id).innerHTML;
    script = LuaCS_Utils.unescapeHtml(script)
    LuaCS.runString(script);
 },
 runScripts : function ()
 {
    Array.prototype.forEach.call(document.querySelectorAll('script[language=\"lua\"]'), function(tag) {
      LuaCS.runString(tag.innerHTML)
    });
 },
 printError : function(msg)
 {
  msg = LuaCS_Utils.escapeHTML(msg);
  document.write("Lua error: " + msg);
 }
}

// TODO: Add type and count checks to better handle errors and mistakes
// while coding
var LuaCS_Browser = {
 print : function(L)
 {
  var str = C.luaL_checkstring(L, 1);
  document.write(str);
  return 0;
 },
 register : function(L)
 {
  LuaCS.addFunction(L,'print',LuaCS_Browser.print);
  LuaCS.addFunction(L,'js_getprop',LuaCS_Browser.jsGetProp);
  LuaCS.addFunction(L,'js_setprop',LuaCS_Browser.jsSetProp);
  LuaCS.addFunction(L,'js_method',LuaCS_Browser.jsMethod);
 },
 jsSetProp : function(L)
 {
  var o = C.luaL_checkstring(L, 1); // object name
  var p = C.luaL_checkstring(L, 2); // property name
  var v = C.luaL_checkstring(L, 3); // new value
  if (o == "window") {
    if (p == "defaultStatus") { window.defaultStatus = v; } else
    if (p == "name") { window.name = v; } else
    if (p == "status") { window.status = v; }
  } else
  if (o == "document") {
    if (p == "cookie") { document.cookie = v; }
  } else
  if (o == "location") {
    if (p == "hash") { location.hash = v; } else
    if (p == "host") { location.host = v; } else
    if (p == "hostname") { location.host = v; } else
    if (p == "href") { location.href = v; } else
    if (p == "pathname") { location.pathname = v; } else
    if (p == "port") { location.port = v; } else
    if (p == "protocol") { location.protocol = v; } else
    if (p == "search") { location.search = v; }
  } else
  if (o == "screen") {
    if (p == "bufferDepth") { screen.bufferDepth = v; } else
    if (p == "updateInterval") { screen.updateInterval = v; }
  }
 },
 jsGetProp : function(L)
 {
  var o = C.luaL_checkstring(L, 1); // object name
  var p = C.luaL_checkstring(L, 2); // property name
  if (o == "document") {
    if (p == "cookie") { C.lua_pushstring(L,document.cookie); } else
    if (p == "domain") { C.lua_pushstring(L,document.Domain); } else
    if (p == "lastModified") { C.lua_pushstring(L,document.lastModified); } else
    if (p == "referrer") { C.lua_pushstring(L,document.referrer); } else
    if (p == "title") { C.lua_pushstring(L,document.title); }
  } else
  if (o == "navigator") {
    if (p == "appCodeName") { C.lua_pushstring(L,navigator.appCodeName); } else
    if (p == "appMinorVersion") { C.lua_pushstring(L,navigator.appMinorVersion); } else
    if (p == "appName") { C.lua_pushstring(L,navigator.appName); } else
    if (p == "appVersion") { C.lua_pushstring(L,navigator.appVersion); } else
    if (p == "browserLanguage") { C.lua_pushstring(L,navigator.browserLanguage); } else
    if (p == "cookieEnabled") { C.lua_pushboolean(L,navigator.cookieEnabled); } else
    if (p == "cpuClass") { C.lua_pushstring(L,navigator.cpuClass); } else
    if (o == "onLine") { C.lua_pushboolean(L,navigator.onLine); } else
    if (p == "platform") { C.lua_pushstring(L,navigator.platform); } else
    if (p == "userAgent") { C.lua_pushstring(L,navigator.userAgent); } else
    if (p == "systemLanguage") { C.lua_pushstring(L,navigator.systemLanguage); } else
    if (p == "userLanguage") { C.lua_pushstring(L,navigator.userLanguage); }
  } else
  if (o == "window") {
    if (p == "defaultStatus") { C.lua_pushstring(L,window.defaultStatus); } else
    if (p == "closed") { C.lua_pushboolean(L,window.closed); } else
    if (p == "length") { C.lua_pushinteger(L,window.length); } else
    if (p == "name") { C.lua_pushstring(L,window.name); } else
    if (p == "outerHeight") { C.lua_pushinteger(L,window.outerHeight); } else
    if (p == "outerWidth") { C.lua_pushinteger(L,window.outerWidth); } else
    if (p == "pageXOffset") { C.lua_pushinteger(L,window.pageXOffset); } else
    if (p == "pageYOffset") { C.lua_pushinteger(L,window.pageYOffset); } else
    if (p == "status") { C.lua_pushstring(L,window.status); }
  } else
  if (o == "location") {
    if (p == "hash") { C.lua_pushstring(L,location.hash); } else
    if (p == "host") { C.lua_pushstring(L,location.host); } else
    if (p == "hostname") { C.lua_pushstring(L,location.hostname); } else
    if (p == "href") { C.lua_pushstring(L,location.href); } else
    if (p == "pathname") { C.lua_pushstring(L,location.pathname); } else
    if (p == "port") { C.lua_pushinteger(L,location.port); } else
    if (p == "protocol") { C.lua_pushstring(L,location.protocol); } else
    if (p == "search") { C.lua_pushstring(L,location.search); }
  } else
  if (o == "history") {
    if (p == "length") { C.lua_pushinteger(L,history.length); }
  } else
  if (o == "screen") {
    if (p == "availHeight") { C.lua_pushinteger(L,screen.availHeight); } else
    if (p == "availWidth") { C.lua_pushinteger(L,screen.availWidth); } else
    if (p == "bufferDepth") { C.lua_pushinteger(L,screen.bufferDepth); } else
    if (p == "colorDepth") { C.lua_pushinteger(L,screen.colorDepth); } else
    if (p == "deviceXDPI") { C.lua_pushinteger(L,screen.deviceXDPI); } else
    if (p == "deviceYDPI") { C.lua_pushinteger(L,screen.deviceYDPI); } else
    if (p == "fontSmoothingEnabled") { C.lua_pushboolean(L,screen.fontSmoothingEnabled); } else
    if (p == "height") { C.lua_pushinteger(L,screen.height); } else
    if (p == "logicalXDPI") { C.lua_pushinteger(L,screen.logicalXDPI); } else
    if (p == "logicalYDPI") { C.lua_pushinteger(L,screen.logicalYDPI); } else
    if (p == "pixelDepth") { C.lua_pushinteger(L,screen.pixelDepth); } else
    if (p == "updateInterval") { C.lua_pushinteger(L,screen.updateInterval); } else
    if (p == "width") { C.lua_pushinteger(L,screen.width); }
  }
  return 1;
 },
 jsMethod : function(L)
 {
  var ret = 0;
  var o = C.luaL_checkstring(L, 1); // object name
  var m = C.luaL_checkstring(L, 2); // property name
  if (o == 'document') {
    if (m == 'close') { document.close; } else
    if (m == 'open') { document.open; } else
    if (m == 'write') { document.write(C.luaL_checkstring(L, 3)); } else
    if (m == 'writeln') { document.writeln(C.luaL_checkstring(L, 3)); }; 
  } else
  if (o == 'navigator') {
    if (m == 'javaEnabled') { C.lua_pushboolean(L,navigator.javaEnabled()); ret = 1; } else
    if (m == 'taintEnabled') { C.lua_pushboolean(L,navigator.taintEnabled()); ret = 1; }
  } else
  if (o == 'window') {
    if (m == 'alert') { window.alert(C.luaL_checkstring(L, 3)); } else
    if (m == 'blur') { window.blur(); } else
    if (m == 'clearInterval') { window.clearInterval(C.luaL_checkinteger(L, 3)); } else
    if (m == 'clearTimeout') { window.clearTimeout(C.luaL_checkinteger(L, 3)); } else
    if (m == 'close') { window.close(); } else
    if (m == 'confirm') { return window.confirm(C.luaL_checkstring(L, 3)); } else
    if (m == 'focus') { window.focus(); } else
    if (m == 'moveBy') { window.moveBy(C.luaL_checkinteger(L, 3),C.luaL_checkinteger(L, 4)); } else
    if (m == 'moveTo') { window.moveTo(C.luaL_checkinteger(L, 3),C.luaL_checkinteger(L, 4)); } else
    if (m == 'open') { window.open(C.luaL_checkstring(L, 3),C.luaL_checkstring(L, 4),C.luaL_checkstring(L, 5)); } else
    if (m == 'print') { window.print(); } else
    if (m == 'prompt') { return window.prompt(C.luaL_checkstring(L, 3),C.luaL_checkstring(L, 4)); } else
    if (m == 'scrollBy') { window.scrollBy(C.luaL_checkinteger(L, 3),C.luaL_checkinteger(L, 4)); } else
    if (m == 'scrollTo') { window.scrollTo(C.luaL_checkinteger(L, 3),C.luaL_checkinteger(L, 4)); } else
    if (m == 'setInterval') { window.setInterval(C.luaL_checkstring(L, 3),C.luaL_checkinteger(L, 4)); } else
    if (m == 'setTimeout') { window.setTimeout(C.luaL_checkstring(L, 3),C.luaL_checkinteger(L, 4)); }
  } else
  if (o == 'location') {
    if (m == 'assign') { location.assign(C.luaL_checkstring(L, 3)); } else
    if (m == 'reload') { location.reload; } else
    if (m == 'replace') { location.replace(C.luaL_checkstring(L, 3)); }
  } else
  if (o == 'history') {
    if (m == 'back') { history.back(); } else
    if (m == 'forward') { history.forward(); } else
    if (m == 'go') { history.go(C.luaL_checkstring(L, 3)); }
  } else
  // TODO -
  // * Make the msg methods support the full syntax like:
  //  console.log(obj1 [, obj2, ..., objN);
  //  console.log(msg [, subst1, ..., substN);
  // * Implement dir()
  if (o == 'console') {
    if (m == 'count') { console.count(C.luaL_checkstring(L, 3)); } else
    if (m == 'debug') { console.debug(C.luaL_checkstring(L, 3)); } else
    if (m == 'error') { console.error(C.luaL_checkstring(L, 3)); } else
    if (m == 'exception') { console.exception(C.luaL_checkstring(L, 3)); } else
    if (m == 'group') { console.group(); } else
    if (m == 'groupCollapsed') { console.groupCollapsed(); } else
    if (m == 'groupEnd') { console.groupEnd(); } else
    if (m == 'info') { console.info(C.luaL_checkstring(L, 3)); } else
    if (m == 'log') { console.log(C.luaL_checkstring(L, 3)); } else
    if (m == 'time') { console.time(C.luaL_checkstring(L, 3)); } else
    if (m == 'timeEnd') { console.timeEnd(C.luaL_checkstring(L, 3)); } else
    if (m == 'trace') { console.trace(); } else
    if (m == 'warn') { console.warn(C.luaL_checkstring(L, 3)); }
  }
  return ret;
 }
}

var LuaCS_Utils = {
 base64Decode : function (data) 
 {
  // Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io) 
  // and Contributors (http://phpjs.org/authors)
  // License: MIT
  
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
        if (!data) {
            return data;
        }
        data += '';
        do 
        {
            // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            }
            else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            }
            else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        }
        while (i < data.length);
        dec = tmp_arr.join('');
        return dec;
 },
 escapeHTML : function (text) 
 {
        return text .replace(/&/g, "&amp;") .replace(/</g, "&lt;") .replace(/>/g, "&gt;") .replace(/"/g, 
        "&quot;") .replace(/'/g, "&#039;");
 },
 unescapeHtml: function (unsafe) {
    return unsafe
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#039;/g, "'");
 }
}

var LuaCS_Libs = {
 load : function() {
 
// Generated by lua5.1.js-file-packer
Lua5_1.provide_file("/", "getset.lua",
 "--[[\n"
+"getset.lua\n"
+"A library for adding getters and setters to Lua tables.\n"
+"Copyright (c) 2011 Josh Tynjala\n"
+"Licensed under the MIT license.\n"
+"]]--\n"
+"\nlocal function throwReadOnlyError(table, key)\n"
+"\terror(\"Cannot assign to read-only property '\" .. key .. \"' of \" .. tostring(table) .. \".\");\n"
+"end\n"
+"\nlocal function throwNotExtensibleError(table, key)\n"
+"\terror(\"Cannot add property '\" .. key .. \"' because \" .. tostring(table) .. \" is not extensible.\")\n"
+"end\n"
+"\nlocal function throwSealedError(table, key)\n"
+"\terror(\"Cannot redefine property '\" .. key .. \"' because \" .. tostring(table) .. \" is sealed.\")\n"
+"end\n"
+"\nlocal function getset__index(table, key)\n"
+"\tlocal gs = table.__getset\n"
+"\n\t-- try to find a descriptor first\n"
+"\tlocal descriptor = gs.descriptors[key]\n"
+"\tif descriptor and descriptor.get then\n"
+"\t\treturn descriptor.get()\n"
+"\tend\n"
+"\n\t-- if an old metatable exists, use that\n"
+"\tlocal old__index = gs.old__index\n"
+"\tif old__index then\n"
+"\t\treturn old__index(table, key)\n"
+"\tend\n"
+"\n\treturn nil\n"
+"end\n"
+"local function getset__newindex(table, key, value)\n"
+"\tlocal gs = table.__getset\n"
+"\n\t-- check for a property first\n"
+"\tlocal descriptor = gs.descriptors[key]\n"
+"\tif descriptor then\n"
+"\t\tif not descriptor.set then\n"
+"\t\t\tthrowReadOnlyError(table, key)\n"
+"\t\tend\n"
+"\t\tdescriptor.set(value)\n"
+"\t\treturn\n"
+"\tend\n"
+"\n\t-- use the __newindex from the previous metatable next\n"
+"\t-- if it exists, then isExtensible will be ignored\n"
+"\tlocal old__newindex = gs.old__newindex\n"
+"\tif old__newindex then\n"
+"\t\told__newindex(table, key, value)\n"
+"\t\treturn\n"
+"\tend\n"
+"\n\t-- finally, fall back to rawset()\n"
+"\tif gs.isExtensible then\n"
+"\t\trawset(table, key, value)\n"
+"\telse\n"
+"\t\tthrowNotExtensibleError(table, key)\n"
+"\tend\n"
+"end\n"
+"\n-- initializes the table with __getset field\n"
+"local function initgetset(table)\n"
+"\tif table.__getset then\n"
+"\t\treturn\n"
+"\tend\n"
+"\n\tlocal mt = getmetatable(table)\n"
+"\tlocal old__index\n"
+"\tlocal old__newindex\n"
+"\tif mt then\n"
+"\t\told__index = mt.__index\n"
+"\t\told__newindex = mt.__newindex\n"
+"\telse\n"
+"\t\tmt = {}\n"
+"\t\tsetmetatable(table, mt)\n"
+"\tend\n"
+"\tmt.__index = getset__index\n"
+"\tmt.__newindex = getset__newindex\n"
+"\trawset(table, \"__getset\",\n"
+"\t{\n"
+"\t\told__index = old__index,\n"
+"\t\told__newindex = old__newindex,\n"
+"\t\tdescriptors = {},\n"
+"\t\tisExtensible = true,\n"
+"\t\tisOldMetatableExtensible = true,\n"
+"\t\tisSealed = false\n"
+"\t})\n"
+"\treturn table\n"
+"end\n"
+"\nlocal getset = {}\n"
+"\n--- Defines a new property or modifies an existing property on a table. A getter\n"
+"-- and a setter may be defined in the descriptor, but both are optional.\n"
+"-- If a metatable already existed, and it had something similar to getters and\n"
+"-- setters defined using __index and __newindex, then those functions can be \n"
+"-- accessed directly through table.__getset.old__index() and\n"
+"-- table.__getset.old__newindex(). This is useful if you want to override with\n"
+"-- defineProperty(), but still manipulate the original functions.\n"
+"-- @param table\t\t\tThe table on which to define or modify the property\n"
+"-- @param key\t\t\tThe name of the property to be defined or modified\n"
+"-- @param descriptor\tThe descriptor containing the getter and setter functions for the property being defined or modified\n"
+"-- @return \t\t\t\tThe table and the old raw value of the field\n"
+"function getset.defineProperty(table, key, descriptor)\n"
+"\tinitgetset(table)\n"
+"\n\tlocal gs = table.__getset\n"
+"\n\tlocal oldDescriptor = gs.descriptors[key]\n"
+"\tlocal oldValue = table[key]\n"
+"\n\tif gs.isSealed and (oldDescriptor or oldValue) then\n"
+"\t\tthrowSealedError(table, key)\n"
+"\telseif not gs.isExtensible and not oldDescriptor and not oldValue then\n"
+"\t\tthrowNotExtensibleError(table, key)\n"
+"\tend\n"
+"\n\tgs.descriptors[key] = descriptor\n"
+"\n\t-- we need to set the raw value to nil so that the metatable works\n"
+"\trawset(table, key, nil)\n"
+"\n\t-- but we'll return the old raw value, just in case it is needed\n"
+"\treturn table, oldValue\n"
+"end\n"
+"\n--- Prevents new properties from being added to a table. Existing properties may\n"
+"-- be modified and configured.\n"
+"-- @param table\t\tThe table that should be made non-extensible\n"
+"-- @return\t\t\tThe table\n"
+"function getset.preventExtensions(table)\n"
+"\tinitgetset(table)\n"
+"\n\tlocal gs = table.__getset\n"
+"\tgs.isExtensible = false\n"
+"\treturn table\n"
+"end\n"
+"\n--- Determines if a table is extensible. If a table isn't initialized with\n"
+"-- getset, this function returns true, since regular tables are always\n"
+"-- extensible. If a previous __newindex metatable method was defined before\n"
+"-- this table was initialized with getset, then isExtensible will be ignored\n"
+"-- completely.\n"
+"-- @param table\t\tThe table to be checked\n"
+"-- @return\t\t\ttrue if extensible, false if non-extensible\n"
+"function getset.isExtensible(table)\n"
+"\tlocal gs = table.__getset\n"
+"\tif not gs then\n"
+"\t\treturn true\n"
+"\tend\n"
+"\treturn gs.isExtensible\n"
+"end\n"
+"\n--- Prevents new properties from being added to a table, and existing properties \n"
+"-- may be modified, but not configured.\n"
+"-- @param table\t\tThe table that should be sealed\n"
+"-- @return\t\t\tThe table\n"
+"function getset.seal(table)\n"
+"\tinitgetset(table)\n"
+"\tlocal gs = table.__getset\n"
+"\tgs.isExtensible = false\n"
+"\tgs.isSealed = true\n"
+"\treturn table\n"
+"end\n"
+"\n--= Determines if a table is sealed. If a table isn't initialized with getset,\n"
+"-- this function returns false, since regular tables are never sealed.\n"
+"-- completely.\n"
+"-- @param table\t\tThe table to be checked\n"
+"-- @return\t\t\ttrue if sealed, false if not sealed\n"
+"function getset.isSealed(table)\n"
+"\tlocal gs = table.__getset\n"
+"\tif not gs then\n"
+"\t\treturn false\n"
+"\tend\n"
+"\treturn gs.isSealed\n"
+"end\n"
+"\nreturn getset",
true, false);
// End of /getset.lua

 }
}
