-- Uncomment this to use validation rules
-- local val = require "valua"
local M = {}

-- Attributes and their validation rules
M.attributes = {
	-- {<attribute> = <validation function, valua required>}
	-- Ex. {id = val:new().integer()}
	{ id = "safe" },
	{ name = "safe" },
}

M.db = {
	key = 'id',
	table = 'category'
}

M.relations = {}

return M

