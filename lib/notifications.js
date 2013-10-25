var aws = require('aws-sdk');

exports.send = function(msg, callback) { 
  aws.config.loadFromPath('config.json');
  var ses = new aws.SES({apiVersion: '2010-12-01'});
  var to = process.env.NOTIFICATION_EMAIL.split(',')
  var from = 'Ozanam Gala Website <no-reply@ozanamgala.org>'

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
  function(err, result) {
    if (err) console.log('-email failed: ' + err)
    callback(err,result)
  })
}
