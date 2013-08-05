should = require "should"
ocrypto = require "../lib/ocrypto"

describe "Crypto (Local)", ->
  crypted = null
  it "can encrypt data", (done) ->
    crypted = ocrypto.encrypt 'test'
    crypted.should.be.ok
    crypted.should.not.equal('test')
    done()

  it "can decrypt data", (done) ->
    data = ocrypto.decrypt crypted
    data.should.equal('test')
    done()
