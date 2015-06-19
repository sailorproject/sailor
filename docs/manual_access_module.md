##Reference Manual
###The access module
The access module is useful if you want to have a login system and pages that are not visible to guests. It needs to be required from either the controller or view: `local access = require "sailor.access"`. If you want to use a User model, it must have the fields username, password and salt. Otherwise you need to set default login and password strings.

####access.default
Default login string. If set, deactivates looking up for a User model.

Example: ` access.default = 'demo'`

####access.default_pass
Default password string.

Example: ` access.password = 'IamGod'`

####access.is_guest()
Verifies if there is session data and returns a boolean.

Example: ` if access.is_guest( ) return 404 end `

####access.login( username,password )
Tries to login with the given username and password (raw). If using a User model, it will encrypt the given password string before making the comparison. Returns a boolean and an error string. 

Example 1: `local ok, err = access.login('demo','IamNOTGod') -- false, Invalid username or password.`

Example 2: `local ok, err = access.login('demo','IamGod') -- true, nil`

####access.logout()
Logs user out and erases session.

Example: `access.logout()`
