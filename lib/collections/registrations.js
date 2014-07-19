var util     = require('util')
var mongo    = require('mongodb')
var moment   = require("moment")
var baseRepo = require('../generic-db')

var repo = function() {
  this.collectionName = 'registrations'
}
util.inherits(repo, baseRepo)

var record = function() {
  this._id = new mongo.ObjectID();
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
  this.order = {
    dateRegistered : new Date(),
    year : moment().year(),
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

repo.prototype.new = function() {
    return new record()
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


repo.prototype.getExtraSeatsPrice = function() { return extraSeatsPrice }

repo.prototype.getExtraSeatsAmount = function(seats) {
  return seats * extraSeatsPrice;
}
repo.prototype.getSponsorshipAmount = function(level) {
  var s = getSponsorshipInfo(level);
  if (s)
    return s.amount;

  return 0.0;
}


repo.prototype.getSponsorshipInfo = getSponsorshipInfo;

repo.prototype.flagDownloaded = function (ids, done) {
  this.update({_id : {$in : ids}}, {$set : {downloaded : true}}, {multi: true}, done)
}

repo.prototype.setPostSale = function(id, data, done) {
  this.update({_id: id}, {$set: {'payment.links': data.links, 'order.payer' : data.payer }}, done)
}
repo.prototype.setPayerId = function(token, payerId, done) {
  self = this
  this.findOne({'payment.token': token}, function(err, doc) {
    if (err) return done(err)
    if (!doc) return done(new Error('Transaction not found.'))

    self.update({_id: doc._id}, {$set: {'payment.payerId': payerId }}, function(err,affected) {
      if (err) return done(err);
      if (affected === 0) return done(new Error('Payer not updated. Transaction not found.'))

      doc.payment.payerId = payerId //for local access

      return done(null, doc);
    })
  })
}

repo.prototype.setConfirmation = function(id, done) {
  this.update({_id : id}, {$set : {confirmed : true}}, (done != undefined || done != null) ? done : function() {});
}

repo.prototype.setCancelPaymentById = function(id, done) {
  this.update({_id : id}, {$set: {'order.paymentOption': 'check'}, $unset: {payment: 1}}, done)
}

repo.prototype.setCancelPayment = function(token, done) {
  this.findAndModify({'payment.token' : token}, [['_id',  1]], {$set: {'order.paymentOption': 'check'}, $unset: {payment: 1}},{}, function(err,doc) {
    if (!doc) {
      return done(new Error("Cancel not updated. Transaction not found."))
    }
    done(null, doc)
  })
}
repo.prototype.setPayment = function(id, payment, done) {
  this.update({_id : id}, {$set : {'order.paymentOption': 'paypal', payment: payment}}, done)
}

repo.prototype.findByYear = function(showDownloaded, year, done) {
  //show all
  if (showDownloaded)
    return this.find({ confirmed: true, "order.year": year}, done)

  this.find({confirmed: true, downloaded: false, "order.year": year}, done)
}

module.exports = new repo()
