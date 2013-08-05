shared = require "../lib/sharedMongo"
should = require "should"

describe "Shared Mongo", ->
  common = null

  it "can open a connection", (done) ->
    shared.open (err,db) ->
      should.not.exist err
      should.exist db
      common = db
      if err then done err else done()

  it "can reuse a shared connection", (done) ->
    shared.open (err,db) ->
      should.not.exist err
      should.exist db
      db.should.equal(common)
      if err then done err else done()

  it "can reuse a shared connection from accessor", (done) ->
    shared.open (err,db) ->
      should.not.exist err
      should.exist db
      db.should.equal(common)
      if err then done err else done()

  it "can close the connection", (done) ->
    shared.close()
    done()
