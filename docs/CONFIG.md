You will find Sailor's config file under `conf/conf.lua`. This file contains a table with config strings for core Sailor control, database server configuration and SMTP server configuration for mailer module.

`sailor.app_name` is used as a default title tag for your pages and can be invoked at any time from the rest of your app accessing the conf table.

`sailor.default_static` is about flow control. If defined, Sailor will render a specific view as defined, disabling routing. It's useful, for example, for serving a very simple page instead of a complex app or for loading a temporary maintenance page.

`sailor.default_controller` and `default_action` will define which action from which controller will run by default, when no route is called, a.k.a. your index.

`sailor.layout` will define the basic and default layout used for all pages. Sailor is integrated with [Twitter Bootstrap](http://getbootstrap.com) for an enhanced feel. You can add more layouts on `/layouts` and set a default here. Layouts can be changed for specific pages by setting it on controller before rendering pages, we will take a look at this part soon.

`sailor.route_parameter` is for page routing, which is done accessing a get variable, the default is 'r', but you can change it here if you wish.

`db.driver` is your database driver, example: 'mysql'.

`db.host` is your database host, example: 'localhost'.

`db.user` and `db.pass` are the login information for your database.

`db.dbname` is the database name. You can leave db configs blank if you are not persisting models.

`smtp.server` is the server for sending emails. You can leave smtp configs blank if you are not using your application for sending emails.

`smtp.user` and `smtp.server` are the login information for your smtp server.

`smtp.from` is the email address who is sending emails.
