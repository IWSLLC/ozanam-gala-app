should = require 'should'
require("../config").init()
require("mongo-repo").db.init(process.env.MONGO)

describe "Setting up db connection", ->
  it "should work", -> true.should.be.true
