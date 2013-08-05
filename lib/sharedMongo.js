var mongolib = require('mongodb')
var MongoClient = mongolib.MongoClient, Server = mongolib.Server
var sharedDb = null;

exports.open = function(callback) {
  if (!sharedDb) {
    MongoClient.connect(process.env.MONGO, function(err, db) {
      if (err)
        return callback(err)
    
      sharedDb = db;

      return callback(null,sharedDb)
    })
  }
  else 
    callback(null,sharedDb)
}
exports.close = function() {
  if (sharedDb)
    sharedDb.close();
}