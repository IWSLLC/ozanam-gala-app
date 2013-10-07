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
    donation : 0,
    paymentOption : 'check',
    total : 0.0
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
exports.setSaleLinks = function(id, links, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.update({_id: id}, {$set: {'payment.links': links }}, {w:1}, function(err,affected) {
      if (err) return callback(err);
    })
  })
}
exports.setPayerId = function(token, payerId, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.findOne({'payment.token': token}, function(err, doc) {
      if (err) return callback(err)
      if (!doc) return callback('Transaction not found.')

      collection.update({_id: doc._id}, {$set: {'payment.payerId': payerId }}, {w:1}, function(err,affected) {
        if (err) return callback(err);
        if (affected === 0) return callback('Payer not updated. Transaction not found.');

        doc.payment.payerId = payerId //for local access

        return callback(null, doc);
      })
    })
  })
}

exports.findById = function(id, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.findOne({_id: new mongolib.ObjectID(id)}, function(err, doc) {
      callback(err,doc);
    })
  })
}
exports.setCancelPayment = function(token, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.findOne({'payment.token': token}, function(err, doc) {
      if (err) return callback(err)
      if (!doc) return callback('Transaction not found.')

      collection.update({_id: doc._id}, {$set: {'order.paymentOption': 'check'}, $unset: {payment: 1}}, {w:1}, function(err,affected) {
        if (err) return callback(err);
        if (affected === 0) return callback('Cancel not updated. Transaction not found.');

        return callback(null, doc);
      })
    })
  })
}
exports.setPayment = function(id, payment, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)
    
    var collection = db.collection(collectionName);
    collection.update({_id: id}, {$set: {payment: payment}}, {w:1}, function(err,count) {
      if (err) return callback(err)

      callback(null,count)
    });
  })
}

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

