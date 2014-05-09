var bcrypt = require("bcrypt")

exports.hash = function (word, done) {
  bcrypt.genSalt(10, function(err,salt) {
    bcrypt.hash(word,salt,done)
  })
}

exports.compare = function (word,hash, done) {
  bcrypt.compare(word,hash,done)
}
