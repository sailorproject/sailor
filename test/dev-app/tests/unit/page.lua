local conf = require "conf.conf"
local test = require "sailor.test"
local page = test.page

describe("Testing Sailor core functions", function()
  local base_path
  local parms = {id = 5, name = 'a_test'}

  it("should create URLs accordingly without friendly urls", function()
    conf.sailor.friendly_urls = false
    

    local url = page:make_url('test')
    assert.is_equal('?r=test',url)

    url = page:make_url('test/etc')
    assert.is_equal('?r=test/etc',url)

    url = page:make_url('test', parms)
    local exp = '?r=test'
    for k,v in pairs(parms) do exp = exp .. '&' .. k .. '=' .. v end
    assert.is_equal(exp,url)

    url = page:make_url('test/etc', parms)
    exp = '?r=test/etc'
    for k,v in pairs(parms) do exp = exp .. '&' .. k .. '=' .. v end
    assert.is_equal(exp,url)

    base_path, page.base_path = page.base_path, '/sailor/test/dev-app'
    url = page:make_url('test/etc')
    assert.is_equal('/sailor/test/dev-app/?r=test/etc',url)

    url = page:make_url('test', parms)
    exp = '/sailor/test/dev-app/?r=test'
    for k,v in pairs(parms) do exp = exp .. '&' .. k .. '=' .. v end
    assert.is_equal(exp,url)

    url = page:make_url('test/etc')
    assert.is_equal('/sailor/test/dev-app/?r=test/etc',url)

    url = page:make_url('test/etc', parms)
    exp = '/sailor/test/dev-app/?r=test/etc'
    for k,v in pairs(parms) do exp = exp .. '&' .. k .. '=' .. v end
    assert.is_equal(exp,url)
    base_path, page.base_path = page.base_path, base_path
  end)

  it("should create URLs accordingly with friendly urls", function()
    conf.sailor.friendly_urls = true
    page.base_path = ''
    local url = page:make_url('test')
    assert.is_equal('/test',url)

    url = page:make_url('test/etc')
    assert.is_equal('/test/etc',url)

    url = page:make_url('test',parms)
    local exp = '/test'
    for k,v in pairs(parms) do exp = exp .. '/' .. k .. '/' .. v end
    assert.is_equal(exp,url)

    url = page:make_url('test/etc',parms)
    local exp = '/test/etc'
    for k,v in pairs(parms) do exp = exp .. '/' .. k .. '/' .. v end
    assert.is_equal(exp,url)

    base_path, page.base_path = page.base_path, '/sailor/test/dev-app'
    url = page:make_url('test/etc')
    assert.is_equal('/sailor/test/dev-app/test/etc',url)

    url = page:make_url('test')
    assert.is_equal('/sailor/test/dev-app/test',url)

    url = page:make_url('test',parms)
    exp = '/sailor/test/dev-app/test'
    for k,v in pairs(parms) do exp = exp .. '/' .. k .. '/' .. v end
    assert.is_equal(exp,url)

    url = page:make_url('test/etc',parms)
    exp = '/sailor/test/dev-app/test/etc'
    for k,v in pairs(parms) do exp = exp .. '/' .. k .. '/' .. v end
    assert.is_equal(exp,url)
    base_path, page.base_path = page.base_path, base_path
  end)

  it("can render a table as JSON", function()
    assert.has_no.errors(function()
        page:json(parms)
    end)
  end)
end)
