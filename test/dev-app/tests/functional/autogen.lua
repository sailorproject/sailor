local test = require "sailor.test"

describe("Testing #Autogen", function()

  it("should open autogen page", function()
    local res = test.request('autogen')
    assert.same(200,res.status)
    assert.truthy(res.body:match('Generate CRUD'))
  end)

end)