function handle(r)
    r.content_type = "text/html"

    local path = ((debug.getinfo(1, 'S').source):match("^@?(.-)/index.lua$"))
    package.path = package.path .. ";"..path.."/lib/?.lua"
    local s = require "sailor" 

    s.init(r,path)

    local stringVariable = 'this variable is being passed from a "controller" to a "view"!'
    local anotherVar = 2342
    s.render('index',{stringVariable = stringVariable,anotherVar = anotherVar})


    return apache2.OK
end


