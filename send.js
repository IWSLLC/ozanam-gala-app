var not = require('./lib/notifications')

not.send({subject: 'This is a test', body : 'This is a test message from the Ozanam Gala Website.'}, callback(err,result) {
  console.log(err || result)
  process.exit(0)
})

