var vm = require('../lib/vm.js')
var ocrypto = require('../lib/ocrypto')
var moment = require('moment')
var reg = require('../lib/donations')

module.exports = function (app, auth) {
  app.get('/auction/thankyou', function(req, res) {
    var model = vm.new();
    model.title = 'Thankyou for registering your donation! - 2013 Ozanam Holywood Holiday Gala'
    return res.render('donationThankyou.html', model)
  })

  app.get('/auction', function(req,res) {
    ocrypto.httpsCheck(req,res)
    var model = vm.new();
    model.title = 'Donate Auction Item - 2013 Ozanam Holywood Holiday Gala'
    return res.render('donate.html', model)
  })
  app.post('/auction', function(req, res) { 
    ocrypto.httpsCheck(req,res)
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
    if (!((post.email || '').trim()))
      broke.push({field: 'email', message: 'required'})
    if (!((post.itemDescription || '').trim()))
      broke.push({field: 'itemDescription', message: 'required'})

    if (broke.length > 0) {
      var model = {
        success : false,
        broke : broke
      }
      res.send(200, model)
      return
    }

    //convert to db record. 

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
        res.send(200, {success: true, id : data._id.toHexString()})
      }
    });
  })
}