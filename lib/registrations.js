var mongolib = require('mongodb')
var moment = require('moment')
var sharedMongo = require('./sharedMongo')

var collectionName = 'registrations'

var record = function() {
  this._id = new mongolib.ObjectID();
  this.downloaded = false
  this.contact = {
    company : null,
    contact : null,
    street : null,
    city : null,
    state : null,
    zip : null,
    phone : null,
    fax : null,
    email : null
  };
  var now = moment.utc();
  this.order = {
    dateRegistered : now.toDate(),
    year : now.year(),
    level : 0,
    extraSeats : 0,
    myoTaxCredit : false,
    companyMatch : false,
    boardMember : null,
    donation : 0
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
      collection.find({ "order.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
    //show new only
    else {
      collection.find({downloaded: false, "order.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
  })
}

exports.new = function() {
  return new record();
}

