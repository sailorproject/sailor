local xavante = require "xavante" 
local filehandler = require "xavante.filehandler"
local cgiluahandler = require "xavante.cgiluahandler"
local redirect = require "xavante.redirecthandler"

-- Define here where Xavante HTTP documents scripts are located
local webDir = "."

local simplerules = {

    { -- URI remapping example
      match = "^[^%./]*/$",
      with = redirect,
      params = {"index.lua"}
    }, 

    { -- cgiluahandler example
      match = {"%.lp$", "%.lp/.*$", "%.lua$", "%.lua/.*$" },
      with = cgiluahandler.makeHandler (webDir)
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
