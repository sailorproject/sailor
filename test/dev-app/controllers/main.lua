local main = {}

function main.index(page)
    page:render('index')
end

function main.cors(page)
    page:enable_cors()
    page:json({1, 2, 3})
end

return main
