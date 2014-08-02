var aws = require('aws-sdk');

exports.send = function(msg, callback) {
  if (process.env.NODE_ENV === "production") {
    var to = process.env.NOTIFICATION_EMAIL.split(',')
    var from = 'Ozanam Gala Website <no-reply@ozanamgala.org>'

    aws.config = new aws.Config({
      accessKeyId : process.env.AWS_KEYID,
      secretAccessKey : process.env.AWS_SECRET,
      region : process.env.AWS_REGION
    })
    var ses = new aws.SES({apiVersion: '2010-12-01'});

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
  else
    callback()
}
