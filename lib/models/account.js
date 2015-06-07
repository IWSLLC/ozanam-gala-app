var mongo = require('mongodb')
var base  = require("./base")

var record = function(defaults) {
  this._id = mongo.ObjectID()
  this.email = null
  this.name = null
  this.password = null
  this.disabled = false

  base.call(this, defaults)

  return this
}

module.exports = record;
