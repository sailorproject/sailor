##Admin Center

The controller and views for admin center are pre loaded with the blank-app. So, when you create a new app using `sailor create "app_name"` these files are within the new folders.

###Admin center structure

There is one controller named `admin.lua` and a views folder named "admin" inside which are three files. One is `dashboard.lp` which is the views file for the autogen and config editor functions. `index.lp` is for logging into the admin center. Third file is `error.lp`. 

###Getting started
First open `conf/conf.lua`. Change these two parameters:
	
	-- the default value for this is "false"
	enable_admin = "true"

	-- the defaullt password is empty
	admin_password = "someDifficultPassword"

After running the `start-server.lua`, visit <a href="http://localhost:8080/?r=admin">here</a>. Enter the password set it in the config file in the above setup. You would be
re-directed to `localhost:8000/?r=admin/dashboard`. 
The autogen functions are located on the left and the fields from the config file are on the right. You can edit any of the config editor values and then press `submit` button 
at the bottom of the screen. 

###Autogen Functions

The first autogen function is to Generate a model based on a table existing in the database. This is a very handy function to automatically generate the model file. 
Enter the table name and press enter. 

There would be a success message ` Model generated with success.`. 
To create the methods for CRUD operations in the controller, use the next autogen function. 
To Generate CRUD, enter the name of the `model` created in the previous step. This would be same as the name of the table. 

###Config editor

Config editor is basically a long form which when saved, writes data into the config file. The existing values can be edited and then saved at the end. The main file edited here is `conf/conf.lua`. 

After making necessary changes, don't forget to logout and also disable admin in production servers.
