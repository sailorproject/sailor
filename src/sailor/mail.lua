local mail = {}

local socket = require 'socket'
local smtp = require 'socket.smtp'
local ssl = require 'ssl'
local https = require 'ssl.https'
local ltn12 = require 'ltn12'
local conf = require('conf.conf').smtp

function mail.ssl_create()
    local sock = socket.tcp()
    return setmetatable({
        connect = function(_, host, port)
            local r, e = sock:connect(host, port)
            if not r then return r, e end
            sock = ssl.wrap(sock, {mode='client', protocol='tlsv1'})
            return sock:dohandshake()
        end
    }, {
        __index = function(t,n)
            return function(_, ...)
                return sock[n](sock, ...)
            end
        end
    })
end

function mail.send_message(to, subject, body)
    local msg = {
        headers = {
            to = to,
            subject = subject
        },
        body = body
    }

    local ok, err = smtp.send {
        from = conf.from,
        rcpt = to,
        source = smtp.message(msg),
        user = conf.user,
        password = conf.pass,
        server = conf.server,
        port = 465,
        create = mail.ssl_create
    }
    if not ok then
        return false, "SMTP settings failed: "..err.."." 
    end
    return ok
end

return mail