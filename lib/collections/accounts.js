var util     = require('util')
var mongo    = require('mongodb')
var baseRepo = require('../generic-db')
var hasher   = require('../hasher')

var record = function() {
  this._id = mongo.ObjectID()
  this.email = null
  this.name = null
  this.password = null
  this.disabled = false
  return this
}

var repo = function() {
  this.collectionName = 'accounts'
  this.record = record
  return this
}
util.inherits(repo, baseRepo)

record.prototype.setPassword = function(password, done) {
  var self = this;
  hasher.hash(password,function(err,hashed) {
    if (err) { return done(err) }
    self.password = hashed
    done()
  });
}

record.prototype.changePassword = function(oldPass,newPass,done) {
  var self = this;
  hasher.compare(oldPass, self.password, function(err,matched) {
    if (err) return done(err);
    if (!matched) return done(new Error("Invalid current password."))

    self.setPassword(newPass, done)
  })
}

record.prototype.checkPassword = function(password, done) {
  hasher.compare(password, this.password, done);
}

repo.prototype.findByEmail = function(email, done) {
  this.findOne({email : email}, done)
}

module.exports = new repo()