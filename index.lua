require "src.sailor"

-- This handle is called by mod_lua
-- It returns an http response
-- r: request object
function handle(r)
    local page = sailor.init(r)
    return sailor.route(page)
end
 
