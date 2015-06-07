var util     = require('util')
var baseRepo = require('mongo-repo').collection
var record    = require("../models/registration")

var repo = function() {
  baseRepo.call(this)
  this.collectionName = 'registrations'
  this.record = record;
  return this;
}
util.inherits(repo, baseRepo)

repo.prototype.flagDownloaded = function (ids, done) {
  this.update({_id : {$in : ids}}, {$set : {downloaded : true}}, {multi: true}, done)
}

repo.prototype.setPostSale = function(id, data, done) {
  this.update({_id: id}, {$set: {'payment.links': data.links, 'order.payer' : data.payer }}, done)
}
repo.prototype.setPayerId = function(token, payerId, done) {
  var self = this
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
