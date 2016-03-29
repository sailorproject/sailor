## v0.5 alpha - Pluto


#### Bug Fixes


* **autogen**  Fixes autogen page not opening ([5347acb3](https://github.com/sailorproject/sailor/commit/5347acb3))
* **db** Changes query for postgres compatibility on table_exists ([85cc1f59](https://github.com/sailorproject/sailor/commit/85cc1f59))
* **tests**  Adds posts fixtures to dev-app tests ([e53b0646](https://github.com/sailorproject/sailor/commit/e53b0646))
* **travis integration**  Using a different rockspec for travis ci ([cbd48b2b](https://github.com/sailorproject/sailor/commit/cbd48b2b))
* **latclient**  
  * Updates starlight version ([ff0d6642](https://github.com/sailorproject/sailor/commit/ff0d6642))
  * Changes string delimiters to multiline strings ([5fe91827](https://github.com/sailorproject/sailor/commit/5fe91827))
  * Load latclient settings from sailor.lua ([ec058470](https://github.com/sailorproject/sailor/commit/ec058470))
  * Make set_application_path() simple again ([d1bc6fb7](https://github.com/sailorproject/sailor/commit/d1bc6fb7))
  * Add compatibility with 4 different Lua to JS VMs for lua at client ([9d772384](https://github.com/sailorproject/sailor/commit/9d772384))
  * Makes latclient not load the same module again ([4d7cc852](https://github.com/sailorproject/sailor/commit/4d7cc852))
* **remy** 
	  * Make Lighttpd support work again ([e9190523](https://github.com/sailorproject/sailor/commit/e9190523))
	  * Fixes openresty environment issue ([42545098](https://github.com/sailorproject/sailor/commit/42545098))
* **core**
  * Allow hiding stack trace ([b75c9181](https://github.com/sailorproject/sailor/commit/b75c9181))
  *  Path fixes on set_application_path and make_url. ([7d4528d5](https://github.com/sailorproject/sailor/commit/7d4528d5))
  *  Fixing set application path ([9d9a1ab6](https://github.com/sailorproject/sailor/commit/9d9a1ab6))
  * Fixing route paths and status code for Xavante and Apache ([e2369138](https://github.com/sailorproject/sailor/commit/e2369138))
* **blank-app**  Adds test bootstraps to blank app ([eef903f9](https://github.com/sailorproject/sailor/commit/eef903f9))
* **page**  
  * Fixes typo on page.redirect ([2fe112eb](https://github.com/sailorproject/sailor/commit/2fe112eb))
  * Adjusts path on page.include ([27376166](https://github.com/sailorproject/sailor/commit/27376166))
  * Page inspect printing number of gsubs, Fixes #36 ([0c848a7c](https://github.com/sailorproject/sailor/commit/0c848a7c))
* **model**  Adds missing db.close on model:fild_all ([e07960fb](https://github.com/sailorproject/sailor/commit/e07960fb))

#### Features

* **page**  
  * Adds page:to_browser method ([bd5d95db](https://github.com/sailorproject/sailor/commit/bd5d95db))
  * Adds page:tostring() function ([77c8f848](https://github.com/sailorproject/sailor/commit/77c8f848))
* **transactions**  Supporting transactions for major databases ([27ccf960](https://github.com/sailorproject/sailor/commit/27ccf960))
* **autogen**  Adds autogen compatibility with sqlite3 and postgresql ([e0417418](https://github.com/sailorproject/sailor/commit/e0417418))
* **latclient**
  * Support Lua script tag when using starlight VM ([69402cfb](https://github.com/sailorproject/sailor/commit/69402cfb))
  * Improve latclient support in persistent environments ([92d5d579](https://github.com/sailorproject/sailor/commit/92d5d579))
* **binary** Adds sailor enable command on binary to install extensions ([9efa2a34](https://github.com/sailorproject/sailor/commit/9efa2a34))
* **controllers** Allows controller to set a custom view path ([dbddf85f](https://github.com/sailorproject/sailor/commit/dbddf85f))
* **remy** 
  * Adds suport to redirect when using openresty, Closes #47 ([ebb30c1e](https://github.com/sailorproject/sailor/commit/ebb30c1e))
  * Improves openresty compatibility ([3d4aebd0](https://github.com/sailorproject/sailor/commit/3d4aebd0))
* **tests**
  * Adds openresty simulation on automated tests ([a5f4cd06](https://github.com/sailorproject/sailor/commit/a5f4cd06))
* **db** Adds support to openresty internal MySQL API. ([7e0bd062](https://github.com/sailorproject/sailor/commit/7e0bd062))

### Breaking changes
  * `sailor` is no longer on global namespace, if you are accessing sailor attributes now you need to require
  
### Deprecations
  * sailor.make_url has been copied to page:make_url and will be removed on next versions
  * sailor.model has been copied to a call metamethod on the model module and will be removed on next version
