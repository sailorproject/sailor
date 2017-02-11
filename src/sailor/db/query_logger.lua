--------------------------------------------------------------------------------
-- query_logger.lua, v0.1.0: A quick and dirty logger to help with query debuging
-- This file is a part of Sailor project
-- Copyright (c) 2017 Andre Garzia <andre@amoralabs.com>
-- License: MIT
-- http://sailorproject.org
--------------------------------------------------------------------------------

local sailor = require "sailor"
local main_conf = require "conf.conf"
local conf = main_conf.db[main_conf.sailor.environment]

local log_file_path = (sailor.path..'/runtime/logs')

local query_logger = {
    outfile = "query.log"
}

function query_logger.write(query) {
    local fp,err = io.open(logger.outfile, "a")
    local str = string.format("[QUERY %s] %s\n",
                            os.date(), query)

    if fp then                          
        fp:write(str)
        fp:close()
    else
        error("Couldn't open logfile:" .. err)
    end
}

function query_logger.is_logger_enabled() {
    return conf.log_database_queries or false
}

return query_logger