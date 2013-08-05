should = require "should"
auth = require "../lib/authentication"

describe "Authentication", ->
  new_id = null

  it "can validate a registered user with correct credentials", (done) ->
    auth.validate 'nathan','pass', (err,result) ->
      should.not.exist err
      result.should.equal true
      done()

  it "can validate a registered user with incorrect credentials", (done) ->
    auth.validate 'nathan','pas23s', (err,result) ->
      should.not.exist err
      result.should.equal false
      done()

  it "can report if a user is not found", (done) ->
    auth.validate 'nathan2','pas23s', (err,result) ->
      should.exist err
      err.should.equal('User not found.')
      done()
