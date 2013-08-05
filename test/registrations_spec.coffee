should = require "should"
regs = require "../lib/registrations"

describe "Registrations", ->
  new_id = null
#  beforeEach (done) ->
#    regs.saveRegistration {Test: 1}, (err, result) ->
#      new_id = result[0]._id
#      done()

  it "can add a new registration record", (done) ->
    item = regs.new()
    item.contact.name = 'test'
    regs.insert item, (err, result) -> 
      should.not.exist err
      result.should.be.ok
      result._id.should.be.ok
      done()

  it "can find registrations with all records", (done) ->
    regs.find true, 2013, (err,result) ->
      should.not.exist err
      result[0]._id.should.be.ok
      done()

  it "can find registrations with new records only", (done) ->
    regs.find false, 2013, (err,result) ->
      should.not.exist err
      result[0]._id.should.be.ok
      done()      
