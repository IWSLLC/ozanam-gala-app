shared = require "../lib/sharedMongo"
should = require "should"
accounts = require "../lib/accounts"

describe "Accounts", ->
  before (done) ->
    shared.open (err,result) ->
      should.not.exist err
      should.exist result
      if err then done err else done()

  it "can create a new user", (done) ->
    user = accounts.new()
    user.name = 'Test'
    user._id = 'test'
    accounts.save user, (err,result) ->
      should.not.exist err
      result.should.be.above(0)
      done()


  it "can get an find a user by username", (done) ->
    accounts.find 'test', (err,result) ->
      should.not.exist err
      result._id.should.equal('test')
      done()

