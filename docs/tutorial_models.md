##Models

Please note that this tutorial is already following new formats of the version 0.3 that will be launched on May 15th. If you downloaded Sailor through luarocks instead of the current master on github, some things might be different. If you need any help just drop us an email on your mail list or send me a tweet.


So you want to create models and save your objects on a database! Let's do that! So far we only give regular support to MySQL but it could work with any other driver LuaSQL gives support to. Sailor has been reported to work fine with both PostgreSQL and SQLite but for the moment we are not making extensive tests in databases other than MySQL. If you want to use Sailor with a different database and something does not work, please file an issue on github explaining all details. So, to start using a database, don't forget to first edit your `conf.lua` with your database details.


On our example we will create a post model. For now, you must create your tables manually but after that you can use our autogenerator to create a model and a CRUD. On this tutorial you will learn how to create a model manually, a separate tutorial for using the auto generators will be available soon.


This is SQL code necessary:

    create table post(
      id int primary key auto_increment, 
      author varchar(20), 
      title varchar(100),
      body text
    );

After you're done, you must create a Lua file under the `/models` folder. Our model will be called `post.lua`. We will start by declaring post as a table, then the attribute rules list, relations and public methods. At the end of the file we must return the table we declared. We can also use Valua to create validation rules that will be used to test our model's attributes before saving. You can read more about the validation module at the reference manual. If you don't want to add any rules, please indicate that the attribute is safe.

    local val = require "valua"
    local post = {}
    -- Attributes and their validation rules
    post.attributes = { 
    -- { <attribute> = <validation function, valua required> or "safe" if no validation required for this attribute} 
      { id = "safe" }, -- No validation rules
      { author = val:new().not_empty().len(6,20) }, -- Cannot be empty and must have between 6 and 20 characters
      { title = val:new().not_empty().len(6,100) }, -- Cannot be empty and must have between 6 and 100 characters
      { body = val:new().not_empty() } -- Cannot be empty
    }

    post.db = {
      key = 'id', -- the primary key
      table = 'post' -- make sure this field contains the same name as your SQL table!
    }

    post.relations = {
      comments = {relation = "HAS_MANY", model = "comment", attribute = "post_id"}, -- details below
    }

    function post.test() return "test" end -- A public method

    return post

It's important to notice that if you have an attribute named 'attributes', 'save', 'find' and so on, weird things might happen or you may lose access to them! You also can't create methods with the same name as your attributes, and if you create methods with the same name as upper model methods like 'validate', you'll overwrite them.



As of version 0.3 Sailor now supports relations. In our example, our post model has many comments but there are different kinds of relations. To add a relation, just add more entries in the relations table. These entries need to follow a certain format and will later be accessed as if the index to this entry is an attribute of your object. For example, if later we instantiate an object from this model called `p`, all comments that relate to this object will be found inside a table `p.comments`.



####Currently supported relation types:
`BELONGS_TO`: This relation means that another model contains this model in a 1..1 or 1..N relation. And that the id of this other model will be referenced as a foreign key on this model. Example, imagine we have a comment model. A post has many comments and a comment belongs to a post. So our comment model must have an attribute indicating to which post it belongs, like post_id and have an entry for accessing the post via relations like this: 

    comment.relations = {
      post = { relation = "BELONGS_TO", model = "post", attribute = "post_id" }
    }

`HAS_ONE`: This relation means that this model contains another model in a 1..1 relation. And that the id of this model will be referenced as a foreign key in the other model. Example, imagine we have a user model and an address model and that each user has one address. So our address model must have an attribute indicating to which user it belongs, like user_id and a BELONGS_TO relation pointing to the user. The structural difference between HAS_ONE and BELONGS_TO is where the foreign key is placed. So, if we want to obtain the address going from the user model, we must define a HAS_ONE entry on user's relations: 

    user.relations = {
      address = { relation = "HAS_ONE", model = "address", attribute = "user_id" }
    }

`HAS_MANY`: This relation means that this model contains other models in a 1..N relation. And that the id of this model will be referenced as a foreign key in the other models. Example, imagine we are back to our post and comment models and that each post has many comments. So our comment model must have an attribute indicating to which post it belongs, like a post_id foreign key and a BELONGS_TO relation pointing to the post. So, if we want to obtain the comments going from the post model, we must define a HAS_MANY entry on post's relations: 
      
    post.relations = {
      comments = { relation = "HAS_MANY", model = "comment", attribute = "post_id" }
    }

`MANY_MANY`: This relation means that this model and another model have a N..N relation. To be able to do that a third table is necessary. Example, imagine we are back to our post but now we have a category model and each post can belong to many categories at once, say "travel" or "culinary", and each category has many posts. If we defined a category_id on post, a post could belong to only one category. If we defined a post_id on category, our categories could only have one post each. So this third table, let's call it post_category, must have entries associating posts to categories with the post_id and category_id attributes. So, if we want to obtain the posts inside a category, we must define a MANY_MANY entry on category's relations: 

    category.relations = {
      posts = { 
        relation = "MANY_MANY", 
        model = "post", 
        table="post_category", 
        attributes = {"category_id","post_id"} 
      }
    }
And if we want to know in which categories this post classifies:

    post.relations = {
      categories = { 
        relation = "MANY_MANY", 
        model = "category", 
        table="post_category", 
        attributes = {"post_id","category_id"} 
      }
    }
Please note that in the MANY_MANY relation attributes table, the order is important. The first attribute name should be the attribute that references to the model you're defining and the second attribute name is the one that references to the related model.



####How to use models from a controller
Going back to a controller, a basic usage of our model example follows:

    -- This will require your post module as a model with all the the cool methods like :new() and :save()
    local Post = sailor.model("post") 

    local p = Post:new() -- instantiating Post as p
    local p2 = Post:new() -- we can instantiate many other users

    p.author = 'Maria' -- we can fill our attributes
    p.title = 'First blog post'
    --[[ but we can't make up new ones, like p.yetanotherattribute = 42, they should be defined
         on our attribute list at post.lua ]]

    local ok,err = p:validate() -- you can validate your models
    page:write(tostring(err)) -- 'body' must not be empty

    p.body = "hello"
    p.save() -- you can save or delete your post from db
    p.delete()

    local some_post = Post:find_by_id(1) -- find an existing entry by id
    local another_post = Post:find_by_attributes{ author = 'Maria' } -- or find all posts written by Maria

For more details on validation functions and existing model methods, please consult the reference manual.
