var paypal_sdk = require('paypal-rest-sdk')
var reg = require('./registrations')
var url = require('url')

var payment = function() {
  var self = this
  self.intent = 'sale'
  self.payer = {
    payment_method: 'paypal'
  }
  self.redirect_urls = {
    return_url: (process.env.ENABLESSL == 'yes' ? 'https://' + process.env.SSLHOSTNAME : 'http://' + process.env.HOSTNAME) + 
    '/register/finish',
    cancel_url: (process.env.ENABLESSL == 'yes' ? 'https://' + process.env.SSLHOSTNAME : 'http://' + process.env.HOSTNAME) + 
    '/register/cancel'
  }
  self.transactions = []
  return self
}
exports.finish = function(registrationId, callback) {
  reg.findById(registrationId, function(err,record) {
    if (err) return callback(err);
    if (!record) return callback('Registration not found.')

    debugger;

    var exec = '';
    for(var ix=0;ix<record.payment.links.length;ix++) {
      var item = record.payment.links[ix];
      if (item.rel === 'execute') {
        exec = item.href;
        break;
      }
    }

    debugger;
    paypal_sdk.payment.execute(record.payment.id,{PayerId: record.payment.payerId },function(err,result) {
      return callback(null, record);
    })
  })

}
exports.start = function(registrationId, callback) {
  reg.findById(registrationId, function(err,record) {
    if (err) callback(err)
    if (!record) callback('Cannot find registration.')

    var temp = new payment();
    temp.transactions.push({ 
      amount: {
        currency: 'USD', 
        total: record.order.total.toString()
      }, 
      description: '2013 Ozanam Hollywood Holiday Gala registration.'
    })
    console.dir(temp.transactions[0])

    paypal_sdk.payment.create(temp, function(err,payment) {
      if (err) return callback(err)

      var approval = '';
      for(ix=0;ix<payment.links.length;ix++) {
        if (payment.links[ix].rel === 'approval_url') {
          approval = payment.links[ix].href
          break
        }
      }

      var parts = url.parse(approval, true)
      debugger;

      record.payment = {
        id: payment.id,
        links: payment.links,
        token: parts.query['token']
      }

      reg.setPayment(record._id, record.payment, function(err,count) { 
        if (!err)
          return callback(null,approval)
        else
          return callback('Failed to save payment information.');
      })
    })
  });

}