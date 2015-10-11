local sailor = require "sailor"
local conf = require "conf.conf"

describe("Testing Sailor core functions", function()
  local base_path
  setup(function()
 
  end)

  it("should create URLs accordingly without friendly urls", function()
    conf.sailor.friendly_urls = false

    local url = sailor.make_url('test')
    assert.is_equal('?r=test',url)

    url = sailor.make_url('test/etc')
    assert.is_equal('?r=test/etc',url)

    url = sailor.make_url('test',{id = 5, name = 'a_test'})
    assert.is_equal('?r=test&id=5&name=a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('?r=test/etc&id=5&name=a_test',url)

    base_path, sailor.base_path = sailor.base_path, '/sailor/test/dev-app'
    url = sailor.make_url('test/etc')
    assert.is_equal('/sailor/test/dev-app/?r=test/etc',url)

    url = sailor.make_url('test',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/?r=test&id=5&name=a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/?r=test/etc&id=5&name=a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/?r=test/etc&id=5&name=a_test',url)
    base_path, sailor.base_path = sailor.base_path, base_path
  end)

  it("should create URLs accordingly with friendly urls", function()
    conf.sailor.friendly_urls = true

    local url = sailor.make_url('test')
    assert.is_equal('/test',url)

    url = sailor.make_url('test/etc')
    assert.is_equal('/test/etc',url)

    url = sailor.make_url('test',{id = 5, name = 'a_test'})
    assert.is_equal('/test/id/5/name/a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('/test/etc/id/5/name/a_test',url)

    base_path, sailor.base_path = sailor.base_path, '/sailor/test/dev-app'
    url = sailor.make_url('test/etc')
    assert.is_equal('/sailor/test/dev-app/test/etc',url)

    url = sailor.make_url('test',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/test/id/5/name/a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/test/etc/id/5/name/a_test',url)

    url = sailor.make_url('test/etc',{id = 5, name = 'a_test'})
    assert.is_equal('/sailor/test/dev-app/test/etc/id/5/name/a_test',url)
    base_path, sailor.base_path = sailor.base_path, base_path
  end)
end)