local mail = {}

local socket = require 'socket'
local smtp = require 'socket.smtp'
local ssl = require 'ssl'
local https = require 'ssl.https'
local ltn12 = require 'ltn12'

function mail.sslCreate()
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

function mail.sendMessage(to, subject, body)
    local msg = {
        headers = {
            to = to,
            subject = subject
        },
        body = body
    }

    local ok, err = smtp.send {
        from = conf['smtp']['from'],
        rcpt = to,
        source = smtp.message(msg),
        user = conf['smtp']['user'],
        password = conf['smtp']['pass'],
        server = conf['smtp']['server'],
        port = 465,
        create = mail.sslCreate
    }
    if not ok then
        print("Mail send failed", err) -- better error handling required
    end
end
 


return mail