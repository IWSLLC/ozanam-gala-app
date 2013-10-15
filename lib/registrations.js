var mongolib = require('mongodb')
var moment = require('moment')
var sharedMongo = require('./sharedMongo')

var collectionName = 'registrations'

var record = function() {
  this._id = new mongolib.ObjectID();
  this.downloaded = false
  this.confirmed = false
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
    level : 10,
    extraSeats : 0,
    myoTaxCredit : false,
    companyMatch : false,
    boardMember : null,
    donation : 0,
    paymentOption : 'check',
    total : 0,
    payer : null
  }
  return this;
}

var extraSeatsPrice = 150.0
var sponsorLevels = [
  {
    level: 1,
    amount : 25000,
    description: 'Hollywood Star $25,000+ (30 seats)'
  },
  {
    level: 2,
    amount : 15000,
    description: 'Major Star $15,000 (20 seats)'
  },
  {
    level: 3,
    amount : 10000,
    description: 'Star $10,000 (10 seats)'
  },
  {
    level: 4,
    amount : 5000,
    description: 'Co-Star $5,000 (10 seats)'
  },
  {
    level: 5,
    amount : 3000,
    description: 'Producer $3,000 (10 seats)'
  },
  {
    level: 6,
    amount : 2000,
    description: 'Table Sponsor $2,000 (10 seats)'
  },
  {
    level: 7,
    amount : 1500,
    description: 'Underwriter $1,500 (2 seats)'
  },
  {
    level: 8,
    amount : 750,
    description: 'Supporting Cast $750 (4 seats)'
  },
  {
    level: 9,
    amount : 450,
    description: 'Corporate Sponsor $450 (2 seats)'
  },
];

var getSponsorshipInfo = function(level) {
  for(var ix=0;ix<sponsorLevels.length;ix++) {
    var s = sponsorLevels[ix];
    if (s.level === level) {
      return s;
    }
  }
  return { level: 10, amount: 0, description: 'Extra Seats'};
}


exports.getExtraSeatsPrice = function() { return extraSeatsPrice }

exports.getExtraSeatsAmount = function(seats) {
  return seats * extraSeatsPrice;
}
exports.getSponsorshipAmount = function(level) {
  var s = getSponsorshipInfo(level);
  if (s)
    return s.amount;

  return 0.0;
}


exports.getSponsorshipInfo = getSponsorshipInfo;

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
exports.setPostSale = function(id, data, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.update({_id: id}, {$set: {'payment.links': data.links, 'order.payer' : data.payer }}, {w:1}, function(err,affected) {
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

exports.setConfirmation = function(id) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.update({_id: id}, {$set: {confirmed: true}}, {w:1}, function(err,affected) { })
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
exports.setCancelPaymentById = function(id, callback) {
  sharedMongo.open(function(err,db) {
    if (err)
      return callback(err)

    var collection = db.collection(collectionName)
    collection.update({_id: id}, {$set: {'order.paymentOption': 'check'}, $unset: {payment: 1}}, {w:1}, function(err,affected) {
      callback(err,affected)
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
    collection.update({_id: id}, {$set: {'order.paymentOption': 'paypal', payment: payment}}, {w:1}, function(err,count) {
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
      collection.find({ confirmed: true, "order.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
    //show new only
    else {
      collection.find({confirmed: true, downloaded: false, "order.year": year}).toArray(function(err, docs) {
        callback(err,docs);
      })
    }
  })
}

exports.new = function() {
  return new record();
}

