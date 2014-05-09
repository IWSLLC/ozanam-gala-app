var mongolib    = require('mongodb')
var MongoClient = mongolib.MongoClient, Server = mongolib.Server
var sharedDb    = null;

exports.open = function(done) {
  if (!sharedDb) {
    MongoClient.connect(process.env.MONGO, function(err, db) {
      if (err)
        return done(err)

      sharedDb = db;

      return done(null,sharedDb)
    })
  }
  else
    done(null,sharedDb)
}
exports.close = function() {
  if (sharedDb)
    sharedDb.close();
}
