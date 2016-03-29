##Reference Manual
###The access module
The access module is useful if you want to have a login system and pages that are not visible to guests. It needs to be required from either the controller or view: `local access = require "sailor.access"`. If you want to deactive the default login and password, you must setup a model to act as a User model. 

This is the default configuration of the access module

    local settings = {
    	default_login = 'admin',	    -- Default login details
      	default_password = 'demo',
      	grant_time = 604800, 			-- 1 week
      	model = nil,					-- Setting this field will deactivate default login details and activate below fields
      	login_attributes = {'username'},-- Allows multiple options, for example, username or email. The one used in the hash of the password should come first.
      	password_attribute = 'password',
      	salt_attribute = 'salt',
      	hashing = true 	-- setting to false will deactivate hashing passwords
    }



####access.is_guest()
Verifies if there is session data and returns a boolean.

Example: ` if access.is_guest( ) return 404 end `


####access.login( username, password )
Tries to login with the given username and password (raw). If using a User model, it will encrypt the given password string before making the comparison. Returns a boolean and an error string. 

  * username, string.
  * password, string.

Example 1: `local ok, err = access.login('admin','notdemo') -- false, Invalid username or password.`

Example 2: `local ok, err = access.login('admin','demo') -- true, nil`

####access.logout()
Logs user out and erases session.

Example: `access.logout()`

####access.settings(s)
Changes settings of the access module.

  * s: table with new settings.

Example: ` access.settings{ default_login = 'IamGod', default_password = 'StairwayToHeaven' } `

