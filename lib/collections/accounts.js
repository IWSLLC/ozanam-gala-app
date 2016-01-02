var util     = require('util')
var baseRepo = require('mongo-repo').collection
var record   = require("../models/account")

var repo = function() {
  baseRepo.call(this)
  this.collectionName = 'accounts'
  this.record = record
  return this
}
util.inherits(repo, baseRepo)

repo.prototype.findByEmail = function(email, done) {
  this.findOne({email : email}, done)
}

module.exports = new repo()
