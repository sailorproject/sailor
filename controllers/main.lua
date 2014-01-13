local main = {}

local mail = require "src.mail"

function main.index(page)
    page:render('index')
end

return main
