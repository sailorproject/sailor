
codes = true

std = 'max'
files['src/sailor/blank-app/tests'].std = 'max+busted'
files['test/dev-app/tests'].std = 'max+busted'

ignore = { '11./sailor',  -- global variable
           '113/lighty',  -- global variable
           '211',   -- unused variable
           '6..' }  -- formatting

files['src/sailor.lua'].ignore = { '111/handle',  -- setting non-standard global variable handle
                                   '113/apr_table',  -- accessing undefined variable apr_table
                                   '113/apache2',  -- accessing undefined variable apache2
                                   '231/GETMULTI',  -- variable GETMULTI is never accessed
                                   '321/res',  -- accessing uninitialized variable res
                                   '431/autogen' }  -- shadowing upvalue autogen
files['src/sailor/blank-app/index-magnet.lua'].ignore = { '122' }  -- setting read-only field tmpname of global os
files['src/sailor/model.lua'].ignore = { '431/model' }  -- shadowing upvalue model
files['src/sailor/page.lua'].ignore = { '212/self' }  -- unused argument self
files['src/sailor/db/luasql_common.lua'].ignore = { '212/key' }  -- unused argument key
files['test/dev-app/index-magnet.lua'].ignore = { '122' }  -- setting read-only field tmpname of global os
files['test/dev-app/tests/unit/model.lua'].ignore = { '431/u' }  -- shadowing upvalue u

