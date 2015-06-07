should   = require "should"
async    = require "async"
accounts = require "../../lib/collections/accounts"

describe "Collections - Accounts", ->

  describe "When finding by email that does exist", ->
    before (done) ->
      async.series [
        (cb) -> accounts.remove {}, cb
        (cb) -> accounts.insert {email : 'test@test.internal'}, cb
        (cb) => accounts.findByEmail "test@test.internal", (err,doc) =>
          @result = doc
          cb err
      ], done

    it "should have a doc with matching email property", -> @result.email.should.equal "test@test.internal"

  describe "When finding by email that does NOT exist", ->
    before (done) ->
      async.series [
        (cb) -> accounts.remove {}, cb
        (cb) => accounts.findByEmail "test@test.internal", (err,doc) =>
          @result = doc
          cb err
      ], done

    it "should return a null document", -> should.not.exist @result
