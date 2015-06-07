var util     = require('util')
var mongo    = require('mongodb')
var moment   = require("moment")
var baseRepo = require('mongo-repo').collection
var record   = require("../models/donation")

var repo = function() {
  baseRepo.call(this)
  this.collectionName = 'donations'
  this.record = record;
  return this;
}
util.inherits(repo, baseRepo)

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
