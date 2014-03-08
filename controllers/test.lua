local session = require "src.session"
local mail = require "src.mail"
local validation = require "src.validation"
local form = require "src.form"

local test = {}

function test.index(page)
	local stringVariable = 'this variable is being passed from a controller to a view!'
    local anotherVar = 2342 -- this one too! \o/
    
    page:write("Here we are testing basic functionalities, such as LP parsing and V-C communication.")

    page:render('index',{stringVariable = stringVariable,anotherVar = anotherVar})
end

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
end

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
    local u2 = User:find("name ='francisco'")

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

function test.validation(page)

	local check = function(val_test, test_value, expected_error) 
						local res,err = val_test(test_value)
						page:write("Validation check on '"..(tostring(test_value)).."': ") 
						if expected_error then page:write ("Expected ") end
						if not res then page:write("Error: value "..(err or '')) else page:write("Check!"..(err or '')) end 
						page:write("<br/>")
					end


	local tests = { validation:new().type("string").len(3,5),
					validation:new().type("number").len(3,5),
					validation:new().not_empty(),
					validation:new().len(2,10),
					validation:new().type("number"),
					validation:new().empty(),
                    validation:new().boolean(),
                    validation:new().compare("hey"),
                    validation:new().number().min(45),
                    validation:new().number().max(1009),
                    validation:new().date(),
                    validation:new().date('us'),
                    validation:new().email(),
                    validation:new().in_list({"hey",42}),
                    validation:new().match("^%d+%p%d+%p%d%d%d%d$"),
                    validation:new().alnum(),
                    validation:new().integer(),
                    validation:new().string(),
                    validation:new().string().alnum(),
                    validation:new().contains(" "),
                    validation:new().no_white()
				}

	local test_values = {  "test string!",
							"hey",
							"",
                            nil,
                            true,
                            42,
                            1337,
                            '26/10/1980',
                            '10-26-1980',
                            '29.02.2014',
                            '29/02/2016',
                            'a@a.com',
                            'asd123',
                            5.7
						}

	check(tests[1],test_values[1],true)
	check(tests[2],test_values[1],true)
	check(tests[3],test_values[2])
	check(tests[4],test_values[2])
	check(tests[5],test_values[2],true)
	check(tests[6],test_values[3])
	check(tests[3],test_values[3],true)
	check(tests[3],test_values[4],true)
	check(tests[6],test_values[4])
    check(tests[7],test_values[1],true)
    check(tests[7],test_values[5])
    check(tests[8],test_values[1],true)
    check(tests[8],test_values[2])
    check(tests[9],test_values[2],true)
    check(tests[9],test_values[6],true)
    check(tests[9],test_values[7])
    check(tests[10],test_values[7],true)
    check(tests[10],test_values[6])
    check(tests[11],test_values[8])
    check(tests[11],test_values[9],true)
    check(tests[12],test_values[9])
    check(tests[12],test_values[8],true)
    check(tests[11],test_values[10],true)
    check(tests[11],test_values[11])
    check(tests[13],test_values[11],true)
    check(tests[13],test_values[12])
    check(tests[14],test_values[12],true)
    check(tests[14],test_values[2])
    check(tests[14],test_values[6])
    check(tests[15],test_values[1],true)
    check(tests[15],test_values[8])
    check(tests[16],test_values[13])
    check(tests[16],test_values[8],true)
    check(tests[17],test_values[6])
    check(tests[17],test_values[14],true)
    check(tests[18],test_values[14],true)
    check(tests[18],test_values[1])
    check(tests[19],test_values[6],true)
    check(tests[20],test_values[1])
    check(tests[20],test_values[2],true)
    check(tests[21],test_values[1],true)
    check(tests[21],test_values[2])

end

function test.modelval(page)
	local User = sailor.model("user")
    local u = User:new()
    u.username = ""
    u.password = "12345"
    local res,err = u:validate()
    page:print(table.concat(err,'<br/>'), '<br/>')
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
    local access = require "src.access"
    if access.is_guest() then
        page:print("Logging in...<br/>")
        local _,err = access.login("demo","demo")
        page:print(err or "Logged in.")
    else
        page:print("You are already logged in.")
    end
end


return test
