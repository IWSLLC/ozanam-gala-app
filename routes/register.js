var reg = require('../lib/registrations')
var vm = require('../lib/vm')
var ocrypto = require('../lib/ocrypto')
var number = require('../lib/number')
var pay = require('../lib/payment')
var url = require('url')
var moment = require('moment-timezone')
var notify = require('../lib/notifications')

module.exports = function (app, auth) {

  var handleError = function(err, doc, res){
    console.log(err);
    if (doc) {
      if (!doc.confirmed) {
        return res.redirect('/register/confirm?problem=1&confirm=' + doc._id.toHexString())
      }
      return res.redirect('/register/thankyou?confirm=' + doc._id.toHexString())
    }
    return res.redirect('/problem')
  }

  var sendNotification = function(doc) {
    var now = moment().utc().tz('America/Chicago').format('MMM D, YYYY h:mm:ss A');

    notify.send(
      {subject: 'New Registration from ' + doc.contact.contact + ' on ' + now, 
      body: 'New registration from ' + doc.contact.contact + ' on ' + now +
        '\nConfirmation code: ' + doc._id.toHexString() + 
        '\n' + now },
      function(err,message) {
        if (err) console.log(err) //log and continue.
      })
  }

  //-----REGISTRATION-----
  app.get('/register', function(req, res) {
    ocrypto.httpsCheck(req,res)
    var model = vm.new()
    model.title = 'Registration'
    return res.render('register-disabled.html', model)
    //return res.render('register.html', model)
  })

  // app.get('/register/thankyou', function(req, res) {
  //   if (!req.query.confirm)
  //     return res.redirect('/register')

  //   reg.findById(req.query.confirm, function(err,doc) {
  //     var model = vm.new();
  //     model.title = 'Registration'
  //     model.id = doc._id.toHexString()
  //     model.amount = number.formatMoney(doc.order.total)
  //     model.sponsorship = reg.getSponsorshipInfo(doc.order.level) || {amount: 0.0, description : 'Extra Seats Only', level: 10}
  //     model.donation = number.formatMoney(doc.order.donation)
  //     model.extraSeats = number.formatMoney(reg.getExtraSeatsAmount(doc.order.extraSeats))
  //     model.doc = doc
  //     model.problem = req.query.problem || 0
  //     return res.render('thankyou.html', model)
  //   })
  // })

  // app.get('/register/confirm', function(req,res) {
  //   if (!req.query.confirm)
  //     return res.redirect('/register')

  //   reg.findById(req.query.confirm, function(err,doc) {
  //     if (err || !doc) {
  //       console.log(err || 'doc is not found: ' + req.query.confirm)
  //       return res.redirect('/problem');
  //     }

  //     if (doc.confirmed) 
  //       return res.redirect('/register/thankyou?confirm=' + req.query.confirm)

  //     var model = vm.new();
  //     model.title = 'Registration'
  //     model.id = doc._id.toHexString()
  //     model.problem = req.query.problem || null
  //     model.amount = number.formatMoney(doc.order.total)
  //     model.nopaypal = doc.order.total > 10000
  //     model.sponsorship = reg.getSponsorshipInfo(doc.order.level) || {amount: 0.0, description : 'Extra Seats Only', level: 10}
  //     model.donation = number.formatMoney(doc.order.donation)
  //     model.extraSeats = number.formatMoney(reg.getExtraSeatsAmount(doc.order.extraSeats))
  //     model.doc = doc
  //     return res.render('confirm.html', model)
  //   })
  // })

  // app.post('/register/confirm', function(req,res) {
  //   if (!req.body.confirmation)
  //     return res.redirect('/register')

  //   reg.findById(req.body.confirmation, function(err,doc) {
  //     if (err || !doc) {
  //       console.log(err || 'doc not found: ' + req.body.confirmation)
  //       return res.redirect('/problem')
  //     }

  //     if (doc.confirmed)
  //       return res.redirect('/register/thankyou?confirm=' + doc._id.toHexString())

  //     if (req.body.paymentOption == 'paypal') {
  //       pay.start(doc, function(err,redir) {
  //         if (err) return handleError(err,doc,res)
  //         return res.redirect(redir)
  //       })
  //     }
  //     else {
  //       reg.setConfirmation(doc._id)
  //       sendNotification(doc)
  //       return res.redirect('/register/thankyou?confirm=' + doc._id.toHexString())
  //     }
  //   })
  // })

  // app.get('/register/finish', function(req,res) {
  //   if (!req.query.token || !req.query.PayerID)
  //     return res.redirect('/register')
    
  //   reg.setPayerId(req.query.token, req.query.PayerID, function(err,record) {
  //     if (err) return handleError(err,record,res)

  //     var model = vm.new()
  //     model.title = 'Registration'
  //     model.amount = number.formatMoney(record.order.total)
  //     model.sponsorship = reg.getSponsorshipInfo(record.order.level) || {amount: 0.0, description : 'Extra Seats Only', level: 10}
  //     model.donation = number.formatMoney(record.order.donation)
  //     model.extraSeats = number.formatMoney(reg.getExtraSeatsAmount(record.order.extraSeats))
  //     model.id = record._id.toHexString()
  //     return res.render('finish.html', model)
  //   })
  // })

  // app.post('/register/finish', function(req,res) {
  //   pay.finish(req.body.registrationId, function(err,record) {
  //     if (err) return handleError(err,record,res)

  //     reg.setConfirmation(record._id)
  //     sendNotification(record)

  //     return res.redirect('/register/thankyou?confirm=' + record._id.toHexString())
  //   })
  // })

  // app.post('/register', function(req, res) { 
  //   ocrypto.httpsCheck(req,res)
  //   var post = req.body;
  //   var worked = true;

  //   var broke = []
  //   if (!((post.contact || '').trim()))
  //     broke.push({field: 'contact', message: 'required'})
  //   if (!((post.street || '').trim()))
  //     broke.push({field: 'street', message: 'required'})
  //   if (!((post.city || '').trim()))
  //     broke.push({field: 'city', message: 'required'})
  //   if (!((post.state || '').trim()))
  //     broke.push({field: 'state', message: 'required'})
  //   if (!((post.zip || '').trim()))
  //     broke.push({field: 'zip', message: 'required'})
  //   if (!((post.phone || '').trim()))
  //     broke.push({field: 'phone', message: 'required'})
  //   if (!((post.email || '').trim()))
  //     broke.push({field: 'email', message: 'required'})

  //   var r = reg.new()
  //   r.order.level = parseInt(post.level)
  //   r.order.extraSeats = parseInt(post.extra || '0')
  //   r.order.donation = parseFloat(post.donation || '0')

  //   if (r.order.extraSeats < 0)
  //     broke.push({field: 'extra', message : 'Must be greater than 0.'})
  //   if (r.order.donation < 0)
  //     broke.push({field: 'donation', message : 'Must be greater than 0.'})

  //   if (broke.length > 0) {
  //     var model = {
  //       success : false,
  //       broke : broke
  //     }
  //     res.json(model)
  //     return
  //   }

  //   //TODO: later we can re-organize this and place the pricing into the db.
  //   r.order.total += r.order.donation
  //   r.order.total += reg.getExtraSeatsAmount(r.order.extraSeats)
  //   r.order.total += reg.getSponsorshipAmount(r.order.level)

  //   r.contact.company = post.company
  //   r.contact.contact = post.contact
  //   r.contact.street = post.street
  //   r.contact.city = post.city
  //   r.contact.state = post.state
  //   r.contact.zip = post.zip
  //   r.contact.phone = post.phone
  //   r.contact.fax = post.fax
  //   r.contact.email = post.email
  //   r.order.myoTaxCredit = post.myoTaxCreditInfo ? true : false
  //   r.order.companyMatch = post.companyMatch ? true : false
  //   r.order.boardMember = post.boardMember
  //   r.order.seating = post.seating
  //   r.order.paymentOption = post.paymentOption || 'check'

  //   reg.insert(r, function(err,data) {
  //     if (err) {
  //       console.log(err);
  //       return res.json(200, {success: false, broke : [], message : 'Unable register at this time. Please try again later.'})
  //     }

  //     r._id = data._id
  //     res.json({success: true, id : r._id.toHexString()})
  //   });
  // })
}