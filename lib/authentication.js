var LocalStrategy = require('passport-local').Strategy;
var accounts = require("./collections/accounts")
var debug = require("debug")("ozanam-gala:authentication")

var check = function(username, password, done) {
  if (!username) return done(null, false, "No email specified.")
  if (!password) return done(null, false, "No passwords specified.")

  accounts.findByEmail(username, function(err,doc) {
    if (err) return done(err)
    if (!doc) {
      debug("Account not found. " + username)
      return done(null, false, "The email or password you specified are not correct.")
    }

    if (doc.disabled) {
      debug("Account disbled and attempted to login. " + username)
      return done(null, false, "Cannot login at this time.")
    }

    doc.checkPassword(password, function(err,success) {
      if (success)
        return done(null, doc)
        
      debug("Invalid password for account: " + username)
      done(null, false, "The email or password you specified are not correct.")
    })
  })
}
exports.check = check

exports.strategy = function() {
  return new LocalStrategy(function(user, password, done) {
    user = (user || '').toLowerCase();
    check(user, password, done);
  });
};
