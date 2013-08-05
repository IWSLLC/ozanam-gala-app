var mongolib = require('mongodb')
var moment = require('moment')
var sharedMongo = require('./sharedMongo')

var collectionName = 'donations'

var record = function() {
  this._id = new mongolib.ObjectID();
  this.downloaded = false
  this.contact = {
    donor : null,
    company : null,
    contact : null,
    street : null,
    city : null,
    state : null,
    zip : null,
    phone : null,
    email : null
  };
  var now = moment.utc();
  this.dateRegistered = now.toDate()
  this.item = {
    year : now.year(),
    description : null,
    value : null,
    restrictions : null,
    optionDeliveredWithForm: false,
    optionSelfDelivery: false,
    selfDeliveryDate : null,
    optionPickup : false,
    optionPrepareCertificate : false,
    optionDisplayMaterials : false,
  }
  return this;
}

exports.flagDownloaded = function (ids, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)
  
    var collection = db.collection(collectionName)
    for(var ix=0;ix<ids.length;ix++) {
      collection.update({_id : ids[ix]}, {$set: {downloaded : true}}, function(err,count) {
        if (err)
          return callback(err)
      })
    } 
  })
}

exports.insert = function(data, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)
    
    var collection = db.collection(collectionName);
    collection.insert(data, {w:1}, function(err,result) {
      if (err)
        return callback(err)

      if (result && result.length) {
        callback(err,result[0]);
      }
    });
  })
};

exports.find = function(showDownloaded, year, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName);

    //show all
    if (showDownloaded) {
      collection.find({ "item.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
    //show new only
    else {
      collection.find({downloaded: false, "item.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
  })
}

exports.new = function() {
  return new record();
}

