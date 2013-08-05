should = require "should"
regs = require "../lib/donations"

describe "Donations", ->
  new_id = null

  it "can add a new donation record", (done) ->
    item = regs.new()
    item.contact.name = 'test'
    regs.insert item, (err, result) -> 
      should.not.exist err
      result.should.be.ok
      result._id.should.be.ok
      done()

  it "can find donations with all records", (done) ->
    regs.find true, 2013, (err,result) ->
      should.not.exist err
      result[0]._id.should.be.ok
      done()

  it "can find donations with new records only", (done) ->
    regs.find false, 2013, (err,result) ->
      should.not.exist err
      result[0]._id.should.be.ok
      done()      
