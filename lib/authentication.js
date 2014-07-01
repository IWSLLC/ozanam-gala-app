var LocalStrategy = require('passport-local').Strategy;
var accounts = require("./collections/accounts")

var check = function(username, password, done) {
  if (!username) return done(null, false, "No email specified.")
  if (!password) return done(null, false, "No passwords specified.")

  accounts.findByEmail(username, function(err,doc) {
    if (err) return done(err)
    if (!doc) return done(null, false, "The email or password you specified are not correct.")

    if (doc.disabled) return done(null, false, "Cannot login at this time.")

    doc.checkPassword(password, function(err,success) {
      if (success)
        return done(null, doc)
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
