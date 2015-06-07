var mongo  = require('mongodb')
var base   = require("./base")
var moment = require("moment")

var record = function(defaults) {
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

  base.call(this, defaults)
  return this;
}



module.exports = record;
