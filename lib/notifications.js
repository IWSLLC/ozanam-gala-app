var mailer = require('emailjs')

exports.send = function(msg, callback) {
  var to = process.env.NOTIFICATION_EMAIL
  var from = 'no-reply@ozanamgala.org'
  var server = mailer.server.connect({host: 'localhost'})
  var message = {
    text: msg.body,
    from: from,
    to: to,
    subject: msg.subject
  }
  server.send(message, callback)
}