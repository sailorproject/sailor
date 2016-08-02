local val = require "valua"


local test ={}

test.attributes={
	{id = "safe"},
	{name = val:new().not_empty() },
	{email = val:new().not_empty() }
}

test.type = "testing"

test.keys = {
	"name", "email"
}

return test

