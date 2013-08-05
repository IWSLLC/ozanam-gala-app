var mongolib = require('mongodb')
var moment = require('moment')
var sharedMongo = require('./sharedMongo')

var collectionName = 'accounts'

var record = function() {
  this._id = ''
  this.name = ''
  this.password = ''
  return this
}

exports.new = function() {
  return new record();
}

exports.find = function(username, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.findOne({_id: username}, function(err, doc) {
      callback(err,doc);
    })
  })
}

exports.save = function(user, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName);
    collection.update({_id: user._id}, user, {w:1, upsert: true}, function(err, result) {
      callback(err,result);
    })
  })
}