##Reference Manual
###Valua: the validation module
This is a module external to Sailor that is useful for setting validation rules to model attributes but it can also be used elsewhere. It needs to be required: `local valua = require "valua"`. It works in chains. First you need to create your validation object then you chain the validation functions you wish in the order you wish. If a test fails, it will break the chain. More info: <a href="https://github.com/sailorproject/valua" target="_blank">Valua - validation for Lua</a>
####Examples
Example 1 - Just create, chain and use:

    valua:new().type("string").len(3,5)("test string!")
    -- false, "should have 3-5 characters"`

Example 2 - Create, chain and later use it multiple times:

    local reusable_validation = valua:new().type("string").len(3,5)
    reusable_validation("test string!") -- false, "should have 3-5 characters"
    reusable_validation("test!") -- true`

Example 3 - On a model:

    local user.attributes = {
        { username = valua:new().not_empty().len(6,20) }
    }


####Validation functions

`alnum()` - Checks if string is alphanumeric.

`boolean()` - Checks if value is a boolean.

`compare(another_value)` - Checks if value is equal to another value.

`contains(substr)` - Checks if a string contains a substring.

`date()` or `date(format)` - Checks if a string is a valid date. Default format is UK (dd/mm/yyyy). Also checks for US and ISO formats.

`email()` - Checks if a string is a valid email address.

`empty()` - Checks if a value is empty.

`integer()` - Checks if a number is an integer.

`in_list(list)` - Checks if a value is inside an array.

`len(min,max)` - Checks if a string's length is between min and max.

`match(pattern)` - Checks if a string matches a given pattern.

`max(n)` - Checks if a number is equal or less than n.

`min(n)` - Checks if a number is equal or greater than n.

`not_empty()` - Checks if a value is not empty.

`no_white()` - Checks if a string contains no white spaces.

`number()` - Checks if a value is a number.

`string()` - Checks if a value is a string.

`type(t)` - Checks if a value is of type t.
