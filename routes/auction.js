var router   = require('express').Router();
var moment   = require('moment-timezone')
var ocrypto  = require('../lib/ocrypto')
var reg      = require('../lib/collections/donations')
var notify   = require('../lib/notifications')

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

var postIndex = function(req,res,next) {
  var post = req.body;
  var worked = true;

  var broke = []
  if (!((post.name || '').trim()))
    broke.push({field: 'name', message: 'required'})
  if (!((post.contact || '').trim()))
    broke.push({field: 'contact', message: 'required'})
  if (!((post.street || '').trim()))
    broke.push({field: 'street', message: 'required'})
  if (!((post.city || '').trim()))
    broke.push({field: 'city', message: 'required'})
  if (!((post.state || '').trim()))
    broke.push({field: 'state', message: 'required'})
  if (!((post.zip || '').trim()))
    broke.push({fdield: 'zip', message: 'required'})
  if (!((post.phone || '').trim()))
    broke.push({field: 'phone', message: 'required'})
  if (!((post.itemDescription || '').trim()))
    broke.push({field: 'itemDescription', message: 'required'})

  if (broke.length > 0) {
    var model = {
      success : false,
      broke : broke
    }
    res.json(model)
    return
  }

  var r = reg.new()
  r.contact.donor = post.name
  r.contact.company = post.company
  r.contact.contact = post.contact
  r.contact.street = post.street
  r.contact.city = post.city
  r.contact.state = post.state
  r.contact.zip = post.zip
  r.contact.phone = post.phone
  r.contact.email = post.email

  r.item.description = post.itemDescription
  r.item.value = parseFloat(post.itemValue)
  r.item.restrictions = post.restrictions
  r.item.optionDeliveredWithForm = post.optionDeliveredWithForm === "true"
  r.item.optionSelfDelivery = post.optionSelfDelivery === "true"
  if (r.item.optionSelfDelivery)
    r.item.selfDeliveryDate = moment(post.selfDeliveryDate).toDate()
  r.item.optionPickup = post.optionPickup === "true"
  r.item.optionPrepareCertificate = post.optionPrepareCertificate === "true"
  r.item.optionDisplayMaterials = post.optionDisplayMaterials === "true"

  reg.insert(r, function(err,data) {
    if (err) {
      res.redirect('/problem')
    }
    else {
      sendNotification(data)
      res.json({success: true, id : data._id.toHexString()})
    }
  });
}

if (/yes/i.test(process.env.ENABLE_DONATION)) {
  router.get('/auction',function(req,res,next) {
    res.locals.scripts.push('/bower_components/moment/min/moment.min.js')
    res.locals.scripts.push('/bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js')
    res.locals.scripts.push('/bower_components/jquery.validation/dist/jquery.validate.min.js')
    res.locals.scripts.push("/js/global-form.js")
    res.locals.scripts.push("/js/auction.js")
    return res.render('auction',{ title : 'Donate Auction Item',})
  })
  router.get('/auction/thankyou', function(req,res,next) { return res.render('donationThankyou', {title : 'Thankyou for registering your donation!'})})
  router.post('/auction', postIndex)
}
else
  router.get('/auction',function(req,res,next) { return res.render('auction-disabled', { title : 'Donate Auction Item'})})


module.exports = router
