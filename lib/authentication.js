var LocalStrategy = require('passport-local').Strategy;
var accounts = require("./collections/accounts")

var check = function(username, password, done) {
  if (!username) return done(new Error("No user specified."))
  if (!password) return done(new Error("No passwords specified."))

  accounts.findByEmail(username, function(err,doc) {
    if (err) return done(err)
    if (!doc) return done(new Error("The user or password you specified are not correct."))

    if (doc.disabled) return done(new Error("Please contact support."))

    doc.checkPassword(password, function(err,success) {
      if (success)
        return done(null, doc)
      done(null, false)
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
