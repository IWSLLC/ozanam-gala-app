var mailer = require('emailjs')
var aws = require('aws-sdk');

exports.sendDirect = function(msg, callback) {
  var to = process.env.NOTIFICATION_EMAIL
  var from = 'Ozanam Gala Website <no-reply@ozanamgala.org>'
  var server = mailer.server.connect({host: 'localhost'})
  var message = {
    text: msg.body,
    from: from,
    to: to,
    subject: msg.subject
  }
  server.send(message, function(err,result) {
    if (err) console.log('-email failed: ' + err)
    callback(err,result)
  })
}


exports.send = function(msg, callback) { 
  aws.config.loadFromPath('config.json');
  var ses = new aws.SES({apiVersion: '2010-12-01'});
  var to = process.env.NOTIFICATION_EMAIL.split(',')
  var from = 'no-reply@ozanamgala.org'

  ses.sendEmail({
    Source : from,
    Destination: {ToAddresses : to},
    Message : {
      Subject : {
        Data : msg.subject,
        Charset : 'utf8'
      },
      Body : {
        Text : {
          Data : msg.body,
          Charset : 'utf8'
        }
      }
    }
  }, 
  function(err, data) {
    if (err) console.log('-email failed: ' + err)
    callback(err,result)
  })
}
