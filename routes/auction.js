var vm = require('../lib/vm.js')
var ocrypto = require('../lib/ocrypto')
var moment = require('moment-timezone')
var reg = require('../lib/donations')
var notify = require('../lib/notifications')

module.exports = function (app, auth) {
  var sendNotification = function(doc) {
    var now = moment().utc().tz('America/Chicago').format('MMM D, YYYY h:mm:ss A');

    notify.send(
      {subject: 'New Auction Item from ' + doc.contact.contact + ' on ' + now, 
      body: 'New auction submission from ' + doc.contact.contact + ' on ' + now +
        '\nConfirmation code: ' + doc._id.toHexString() + 
        '\n' + now },
      function(err,message) {
        if (err) console.log(err) //log and continue.
      })
  }

  app.get('/auction', function(req,res) {
    ocrypto.httpsCheck(req,res)
    var model = vm.new();
    model.title = 'Donate Auction Item'
    return res.render('donate-disabled.html', model)
    //return res.render('donate.html', model)
  })

  // app.get('/auction/thankyou', function(req, res) {
  //   var model = vm.new();
  //   model.title = 'Thankyou for registering your donation!'
  //   return res.render('donationThankyou.html', model)
  // })

  // app.post('/auction', function(req, res) { 
  //   ocrypto.httpsCheck(req,res)
  //   var post = req.body;
  //   var worked = true;

  //   var broke = []
  //   if (!((post.name || '').trim()))
  //     broke.push({field: 'name', message: 'required'})
  //   if (!((post.contact || '').trim()))
  //     broke.push({field: 'contact', message: 'required'})
  //   if (!((post.street || '').trim()))
  //     broke.push({field: 'street', message: 'required'})
  //   if (!((post.city || '').trim()))
  //     broke.push({field: 'city', message: 'required'})
  //   if (!((post.state || '').trim()))
  //     broke.push({field: 'state', message: 'required'})
  //   if (!((post.zip || '').trim()))
  //     broke.push({fdield: 'zip', message: 'required'})
  //   if (!((post.phone || '').trim()))
  //     broke.push({field: 'phone', message: 'required'})
  //   if (!((post.itemDescription || '').trim()))
  //     broke.push({field: 'itemDescription', message: 'required'})

  //   if (broke.length > 0) {
  //     var model = {
  //       success : false,
  //       broke : broke
  //     }
  //     res.json(model)
  //     return
  //   }

  //   //convert to db record. 

  //   var r = reg.new()
  //   r.contact.donor = post.name
  //   r.contact.company = post.company
  //   r.contact.contact = post.contact
  //   r.contact.street = post.street
  //   r.contact.city = post.city
  //   r.contact.state = post.state
  //   r.contact.zip = post.zip
  //   r.contact.phone = post.phone
  //   r.contact.email = post.email

  //   r.item.description = post.itemDescription
  //   r.item.value = parseFloat(post.itemValue)
  //   r.item.restrictions = post.restrictions
  //   r.item.optionDeliveredWithForm = post.optionDeliveredWithForm === "true"
  //   r.item.optionSelfDelivery = post.optionSelfDelivery === "true"
  //   if (r.item.optionSelfDelivery)
  //     r.item.selfDeliveryDate = moment(post.selfDeliveryDate).toDate()
  //   r.item.optionPickup = post.optionPickup === "true"
  //   r.item.optionPrepareCertificate = post.optionPrepareCertificate === "true"
  //   r.item.optionDisplayMaterials = post.optionDisplayMaterials === "true"

  //   reg.insert(r, function(err,data) {
  //     if (err) {
  //       res.redirect('/problem')
  //     }
  //     else {
  //       sendNotification(data)
  //       res.json({success: true, id : data._id.toHexString()})
  //     }
  //   });
  // })
}