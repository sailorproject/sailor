local session = require "sailor.session"
local validation = require "valua"
local form = require "sailor.form"
local sailor = require "sailor"
local es_model = require ('sailor.db.es_model')

local test = {}

function test.index(page)
    local stringVariable = 'this variable is being passed from a controller to a view!'
    local anotherVar = 2342 -- this one too! \o/
    
    page:write("Here we are testing basic functionalities, such as LP parsing and V-C communication.")

    page:render('index',{stringVariable = stringVariable,anotherVar = anotherVar})
end

function test.elasticfunctions(page)
    local doc = {name = "test"}
    local contact = es_model.new("test")
    contact.name = "Tester 123"
    contact.save{id = 101, body = doc, routing = "routing@test.com"}
    if (page.POST) then msg = contact.search{q = page.POST.search} end
    page:render('elastic', {msg = msg})    
end

--This will be recovered once I reorganize the mailer module
--[[
function test.mailer(page)
    local message = "Hello!"
    if page.POST['email'] then
        local sent, err = mail.send_message("<"..page.POST['email']..">","This is the subject!","This is the body!")
        if err then
            message = err
        else
            message = "The email was sent!"
        end
    end

    page:render('mailer',{msg = message})
end]]

function test.models(page)
    --Testing Models
    --[[
        I'm using 'User' model for testing under a mysql db.    
        If you want to check it out, you must import the sql files under /sql       
    ]]
    local User = sailor.model("user")
    local u = User:new()

    u.username = "maria"
    u.password = "12345678"

    local res,errs = u:validate()
    if not res then
        page:write("failed test!<br/>")
    else
        page:write("passed test!<br/>")
    end

    if u:save() then
        page:write("saved! "..u.id.."<br/>")
    end
    
    -- FIND() IS NOT YET ESCAPED, DONT USE IT UNLESS YOU WROTE THE 'WHERE' STRING YOURSELF
    local u2 = User:find("username ='francisco'")

    if u2 then
        page:write(u2.id.." - "..u2.username.."<br/>")
    end

    local users = User:find_all()
    for _, user in pairs(users) do 
        page:write(user.id.." - "..user.username.."<br/>")
    end
      
    u.username = "catarina"
    if u:save() then
        page:write("saved! "..u.id.."<br/>")
    end

    local users = User:find_all()
    for _, user in pairs(users) do 
        page:write(user.id.." - "..user.username.."<br/>")
    end

    page:write("Finding user with id 1:<br/>")
    local some_user = User:find_by_id(1)
    if some_user then
        page:write(some_user.id.." - "..some_user.username.."<br/>")
    end

    page:write("Finding user with id 47:<br/>")
    local some_user = User:find_by_id(47)
    if some_user then
        page:write(some_user.id.." - "..some_user.username.."<br/>")
    else
        page:write("User not found!")
    end
end

function test.modelval(page)
    page.theme = nil
    local User = sailor.model("user")
    local u = User:new()
    u.username = ""
    u.password = "12345"
    local res,err = u:validate()
    page:write(table.concat(err,'<br/>'), '<br/>')
    u.username = "Lala"
    u.password = "12345"
    local res,err = u:validate()
    page:print("<br/>",unpack(err))
    u.username = "Lala"
    u.password = "12345678"
    local res,err = u:validate()
    page:print("<br/>",unpack(err or {}))
end

function test.form(page)
    local User = sailor.model("user")
    local u = User:new()
    
    u.username = "test"
    
    if next(page.POST) then
        u:get_post(page.POST)
    end
   
    page:render('form',{user=u,form = form})
end

function test.redirect(page)
    return page:redirect('test',{hey="blah",hue = 2})
end

function test.include(page)
    page.theme = nil
    page:render('include')
end

function test.error(page)
    page:render('error')
end

function test.newsession(page) 
    session.open(page.r)
    session.save({username = "john lennon"})             
    if session.data then
        for k,v in pairs(session.data) do
            page:write(v)
        end
    end
end

function test.opensession(page) 
    session.open(page.r)
    if session.data then
        for k,v in pairs(session.data) do
            page:write(v)
        end
    end
end

function test.destroysession(page) 
    session.destroy(page.r)
end

function test.login(page)
    --REDO
    local access = require "sailor.access"
    --access.settings{default_lo}
    if access.is_guest() then
        page:print("Logging in...<br/>")
        local _,err = access.login("admin","demo")
        page:print(err or "Logged in.")
    else
        page:print("You are already logged in.")
    end
end

function test.runat_client(page)
    page:render('runat_client')
end

function test.runat_both(page)
    page:render('runat_both')
end

function test.client_module(page)
    page:render('client_module')
end

function test.client_module_js(page)
    page:render('client_module_js')
end

function test.realtime(page)
    page:render('realtime')
end

function test.upload(page)
    page:inspect(page.POST)

    if page.POST.datafile then
        file = io.open ('/Users/ecdalcol/Desktop/tuxedo/test' , 'w')
        io.output(file)
        io.write(page.POST.datafile)
        io.close(file)
    end

    page:render('upload')
end

function test.starlight(page)
    page:render('starlight')
end

function test.lua51js(page)
    page:render('lua51js')
end

function test.luavmjs(page)
    page:render('luavmjs')
end

function test.frontend_performance(page)
    page.theme = nil
    page:render('frontend_performance')
end

function test.post(page)
    page.theme = nil
    for k, v in pairs(page.POST) do
        page:write(k..": "..v)
    end
end

function test.get(page)
    page.theme = nil
    for k, v in pairs(page.GET) do
        page:write(k..": "..v)
    end
end

function test.cookie_set(page)
    local cookie = require "sailor.cookie"
    cookie.set(sailor.r, "SAILORTEST", "OIE")
    page:write("Setting cookie: OIE")

end

function test.cookie_get(page)
    local cookie = require "sailor.cookie"
    local data = cookie.get(sailor.r, "SAILORTEST")
    page:write("Getting cookie:".. (data or "no data"))
end



return test
