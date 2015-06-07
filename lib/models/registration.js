var mongo  = require('mongodb')
var base   = require("./base")
var moment = require("moment")

var record = function(defaults) {
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
    dateRegistered : moment.utc().toDate(),
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

  base.call(this, defaults)

  return this;
}

module.exports = record;
