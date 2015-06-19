##Reference Manual
###The form module
This module will generate html to be used on forms that capture data for a model. It is handy and recommended. This module needs to be required on the view: `local form = require "sailor.form"`. Also please note that on views, `<%= var %>` is equal to `<?lua page:print( var ) ?>`.
####form.text(model,attribute,html_options)
Generates a text field input.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.text(user, 'username', 'class="cute-form-input" width="300"') %>


####form.textarea(model,attribute,html_options)
Generates a text area input.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.textarea(user, 'description', 'class="cute-form-input" width="300"') %>

####form.file(model,attribute,html_options)
Generates a file input.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.file(user, 'profile_picture', 'class="cute-form-input" width="300"') %>

####form.dropdown(model,attribute,list,prompt,html_options)
Generates a dropdown list.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* list: table, contains lists of options to be selected.
* prompt: string, first option that contains a nil value.
* html_options: string, other things to be added inside the select tag.

Example 1: 

    <%= form.dropdown( 
            user,  
            'newsletter',  
            { weekly = 'Receive weekly', monthly = 'Receive Monthly' }, 
            'Please select newsletter...', 
            'class="cute-form-input" width="300"'
         ) 
    %>

####form.password(model,attribute,html_options)
Generates a password input.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.password(user, 'password', 'class="cute-form-input" width="300"') %>

####form.radio_list(model,attribute,list,default,layout,html_options)
Generates a set of radio buttons.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* list: table, contains lists of radios to be selected.
* default: string or nil, which value should be selected by default.
* layout: string or nil, 'vertical' or 'horizontal' (default when nil).
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.radio_list( 
            user,  
            'newsletter',  
            { weekly = 'Receive weekly', monthly = 'Receive Monthly' }, 
            'weekly',
            'vertical' , 
            'class="cute-form-input" width="300"'
        ) 
    %>

####form.checkbox(model,attribute,label,checked,html_options)
Generates a checkbox.
* model: object, an instantiated object from a model.
* attribute: string, name of the attribute to which the value of this attribute will be sent to.
* label: string or nil, text that will go next to the checkbox, defaults to attribute name when nil.
* checked: boolean, whether or not the checkbox is checked by default.
* html_options: string, other things to be added inside the input tag.

Example 1: 

    <%= form.checkbox( 
            user,  
            'likes_puppies',  
            "Do you like puppies?", 
            true, 
            'class="cute-checkbox"'
        ) 
    %>
