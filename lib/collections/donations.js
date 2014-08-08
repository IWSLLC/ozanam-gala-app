var util     = require('util')
var mongo    = require('mongodb')
var moment   = require("moment")
var baseRepo = require('mongo-repo').collection

var repo = function() {
  this.collectionName = 'donations'
}
util.inherits(repo, baseRepo)

var record = function() {
  this._id = new mongo.ObjectID();
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
  this.dateRegistered = new Date()
  this.item = {
    year : moment().year(),
    description : null,
    value : null,
    restrictions : null,
    optionSelfDelivery: false,
    selfDeliveryDate : null,
    optionPickup : false,
    optionPrepareCertificate : false,
    optionDisplayMaterials : false,
  }
  return this;
}

repo.prototype.new = function() {
  return new record();
}

repo.prototype.flagDownloaded = function (ids, done) {
  this.update({_id : {$in : ids}}, {$set : {downloaded : true}}, {multi : true}, done)
}

repo.prototype.findByYear = function(showDownloaded, year, done) {
  //show all
  if (showDownloaded)
    return this.find({ "item.year": year}, done)

  //show new only
  this.find({downloaded: false, "item.year": year}, done)
}

module.exports = new repo()
