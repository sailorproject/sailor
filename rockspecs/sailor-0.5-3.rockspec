package = "Sailor"
version = "0.5-3"
source = {
   url = "git://github.com/sailorproject/sailor",
   tag = "v0.5-alpha"
}
description = {
   summary = "A Lua MVC Framework",
   detailed = [[
      Sailor is a web framework written in Lua that follows the MVC design pattern.
   ]],
   homepage = "http://sailorproject.org", 
   license = "MIT"
}
dependencies = {
   "lua >= 5.1, < 5.3",
   'datafile >= 0.1',
   'luafilesystem >= 1.6.2',
   'valua >= 0.2.2',
   'lbase64 >= 20120807',
   'cgilua >= 5.1.4, < 5.2',
   'xavante >= 2.3',
   'wsapi-xavante >= 1.6.1',
   'busted >= 2.0.rc9' 
}
build = {
   type = "builtin",
   modules = {
      latclient = "src/latclient.lua",
      ['latclient.common'] = "src/latclient/common.lua",
      ['latclient.conf'] = "src/latclient/conf.lua",
      ['latclient.lp_handler'] = "src/latclient/lp_handler.lua",
      ['latclient.lua51js'] = "src/latclient/lua51js.lua",
      ['latclient.luavmjs'] = "src/latclient/luavmjs.lua",
      ['latclient.moonshine'] = "src/latclient/moonshine.lua",
      ['latclient.starlight'] = "src/latclient/starlight.lua",
      remy = "src/remy.lua",
      ['remy.cgilua'] = "src/remy/cgilua.lua",
      ['remy.mod_magnet'] = "src/remy/mod_magnet.lua",
      ['remy.mod_plua'] = "src/remy/mod_plua.lua",
      ['remy.nginx'] = "src/remy/nginx.lua",
      ['remy.lwan'] = "src/remy/lwan.lua",
      ['remy.nginx'] = "src/remy/nginx.lua",
      sailor = "src/sailor.lua",
      ['sailor.access'] = "src/sailor/access.lua",
      ['sailor.autogen'] = "src/sailor/autogen.lua",
      ['sailor.cookie'] = "src/sailor/cookie.lua",
      ['sailor.db'] = "src/sailor/db.lua",
      ['sailor.db.resty_mysql'] = "src/sailor/db/resty_mysql.lua",
      ['sailor.db.luasql_common'] = "src/sailor/db/luasql_common.lua",
      ['sailor.blank-app.conf.conf'] = "src/sailor/blank-app/conf/conf.lua",
      ['sailor.blank-app.start-server'] = "src/sailor/blank-app/start-server.lua",
      ['sailor.blank-app.controllers.main'] = "src/sailor/blank-app/controllers/main.lua",
      ['sailor.blank-app.tests.bootstrap'] = "src/sailor/blank-app/tests/bootstrap.lua",
      ['sailor.blank-app.tests.bootstrap_resty'] = "src/sailor/blank-app/tests/bootstrap_resty.lua",
      ['sailor.blank-app.tests.helper'] = "src/sailor/blank-app/tests/helper.lua",
      ['sailor.blank-app.tests.unit.dummy'] = "src/sailor/blank-app/tests/unit/dummy.lua",
      ['sailor.blank-app.tests.functional.dummy'] = "src/sailor/blank-app/tests/functional/dummy.lua",
      ['sailor.blank-app.index'] = "src/sailor/blank-app/index.lua",
      ['sailor.blank-app.index-magnet'] = "src/sailor/blank-app/index-magnet.lua",
      ['sailor.form'] = "src/sailor/form.lua",
      ['sailor.model'] = "src/sailor/model.lua",
      ['sailor.session'] = "src/sailor/session.lua",
      ['sailor.page'] = "src/sailor/page.lua",
      ['sailor.test'] = "src/sailor/test.lua",
      ['web_utils.lp'] = "src/web_utils/lp.lua",
      ['web_utils.lp_ex'] = "src/web_utils/lp_ex.lua",
      ['web_utils.serialize'] = "src/web_utils/serialize.lua",
      ['web_utils.session'] = "src/web_utils/session.lua",
      ['web_utils.utils'] = "src/web_utils/utils.lua"
   },
   install = {
      lua = {
         ["sailor.blank-app.htaccess"] = "src/sailor/blank-app/.htaccess",
         ["sailor.blank-app.conf.htaccess"] = "src/sailor/blank-app/conf/.htaccess",
         ["sailor.blank-app.conf.mime"] = "src/sailor/blank-app/conf/mime.types",
         ["sailor.blank-app.conf.nginx"] = "src/sailor/blank-app/conf/nginx.conf",
         ["sailor.blank-app.controllers.htaccess"] = "src/sailor/blank-app/controllers/.htaccess",
         ["sailor.blank-app.models.htaccess"] = "src/sailor/blank-app/models/.htaccess",
         ["sailor.blank-app.runtime.htaccess"] = "src/sailor/blank-app/runtime/.htaccess",
         ["sailor.blank-app.runtime.tmp.htaccess"] = "src/sailor/blank-app/runtime/tmp/.htaccess",
         ["sailor.blank-app.tests.fixtures.htaccess"] = "src/sailor/blank-app/tests/fixtures/.htaccess",
         ["sailor.blank-app.tests.htaccess"] = "src/sailor/blank-app/tests/.htaccess",
         ["sailor.blank-app.views.main.index"] = "src/sailor/blank-app/views/main/index.lp",
         ["sailor.blank-app.views.error.404"] = "src/sailor/blank-app/views/error/404.lp",
         ["sailor.blank-app.views.error.inspect"] = "src/sailor/blank-app/views/error/inspect.lp",
         ["sailor.blank-app.pub.starlight.browser"] = "src/sailor/blank-app/pub/starlight/browser.5.8.34.min.js",
         ["sailor.blank-app.pub.starlight.starlight"] = "src/sailor/blank-app/pub/starlight/starlight.js",
         ["sailor.blank-app.themes.default.css.bootstrap-theme"] = "src/sailor/blank-app/themes/default/css/bootstrap-theme.css",
         ["sailor.blank-app.themes.default.css.bootstrap-theme"] = "src/sailor/blank-app/themes/default/css/bootstrap-theme.css",
         ["sailor.blank-app.themes.default.css.bootstrap"] = "src/sailor/blank-app/themes/default/css/bootstrap.css",
         ["sailor.blank-app.themes.default.css.bootstrap-thememin"] = "src/sailor/blank-app/themes/default/css/bootstrap-theme.min.css",
         ["sailor.blank-app.themes.default.css.bootstrapmin"] = "src/sailor/blank-app/themes/default/css/bootstrap.min.css",
         ["sailor.blank-app.themes.default.css.sticky-footer-navbar"] = "src/sailor/blank-app/themes/default/css/sticky-footer-navbar.css",
         ["sailor.blank-app.themes.default.js.jquery"] = "src/sailor/blank-app/themes/default/js/jquery-1.10.2.min.js",
         ["sailor.blank-app.themes.default.js.bootstrap"] = "src/sailor/blank-app/themes/default/js/bootstrap.js",
         ["sailor.blank-app.themes.default.js.bootstrapmin"] = "src/sailor/blank-app/themes/default/js/bootstrap.min.js",
         ["sailor.blank-app.themes.default.fonts.glysvg"] = "src/sailor/blank-app/themes/default/fonts/glyphicons-halflings-regular.svg",
         ["sailor.blank-app.themes.default.fonts.glyttf"] = "src/sailor/blank-app/themes/default/fonts/glyphicons-halflings-regular.ttf",
         ["sailor.blank-app.themes.default.fonts.glyeot"] = "src/sailor/blank-app/themes/default/fonts/glyphicons-halflings-regular.eot",
         ["sailor.blank-app.themes.default.fonts.glywoff"] = "src/sailor/blank-app/themes/default/fonts/glyphicons-halflings-regular.woff",
         ["sailor.blank-app.themes.default.config"] = "src/sailor/blank-app/themes/default/config.json",
         ["sailor.blank-app.themes.default.main"] = "src/sailor/blank-app/themes/default/main.lp",

      },
      bin = {
         sailor = "sailor"
      }
   }
}
