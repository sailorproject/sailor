local xavante = require "xavante" 
local filehandler = require "xavante.filehandler"
local cgiluahandler = require "xavante.cgiluahandler"
local redirect = require "xavante.redirecthandler"
local conf = (require "conf.conf").sailor

-- Define here where Xavante HTTP documents scripts are located
local webDir = "."

local uri_map

if conf.friendly_urls then
    uri_map = { -- URI remapping
        match = "^[^%./]*/?([^%.]*)$",
        with = redirect,
        params = {
            "/",
            function(req,_,cap)
                local vars = {}

                for var in string.gmatch(cap[1], '([^/]+)') do
                    table.insert(vars,var)
                end

                if #vars > 0 then
                    local mod = (#vars % 2) - 1
                    local get = ""

                    if #vars > 1 - mod then
                        for i = 2 - mod, #vars, 2 do
                            get = get.."&"..vars[i].."="..vars[i+1]
                        end
                    end

                    if mod == -1 then
                        get = vars[2]..get
                    end

                    req.cmd_url = "/index.lua?"..conf.route_parameter.."="..vars[1].."/"..get
                else
                    req.cmd_url = "/index.lua"
                end
               
                return "reparse"
            end
        }
    }
else
    uri_map = {
        match = "^[^%./]*/$",
        with = redirect,
        params = {"index.lua"}
      }
end

local simplerules = {
    
    uri_map,

    { -- cgiluahandler example
      match = {"%.lp$", "%.lp/.*$", "%.lua$", "%.lua/.*$" },
      with = cgiluahandler.makeHandler (webDir,{ reload = true })
    },
    
    { -- filehandler example
      match = ".",
      with = filehandler,
      params = {baseDir = webDir}
    },
} 

xavante.HTTP{
    server = {host = "*", port = 8080},
    
    defaultHost = {
      rules = simplerules
    }
}
xavante.start()
