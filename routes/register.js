var reg = require('../lib/registrations')
var vm = require('../lib/vm')
var ocrypto = require('../lib/ocrypto')
var number = require('../lib/number')
var pay = require('../lib/payment')
var url = require('url')

module.exports = function (app, auth) {
  app.get('/register/thankyou', function(req, res) {
  })

  //-----REGISTRATION-----
  app.get('/register', function(req, res) {
    ocrypto.httpsCheck(req,res)
    var model = vm.new()
    model.title = 'Registration - 2013 Ozanam Holywood Holiday Gala'
    return res.render('register.html', model)
  })

  app.get('/register/confirm', function(req,res) {
    reg.findById(req.query.confirm, function(err,doc) {
      var model = vm.new();
      model.title = 'Registration - 2013 Ozanam Holywood Holiday Gala'
      model.id = doc._id.toHexString()
      model.amount = number.formatMoney(doc.order.total)
      model.sponsorship = reg.getSponsorshipInfo() || {amount: 0.0, description : 'Extra Seats Only', level: 10}
      model.donation = number.formatMoney(doc.order.donation)
      model.extraSeats = number.formatMoney(reg.getExtraSeatsAmount())
      return res.render('confirm.html', model)
    })
  })

  app.get('/register/finish', function(req,res) {
    reg.setPayerId(req.query.token, req.query.PayerID, function(err,record) {
      if (err) {
        if (record) {
          return res.redirect('/register/thankyou?problem=1&confirm=' + record._id.toHexString())
        }
        else
        {
          console.log(err);
          res.redirect('/problem')
          return
        }
      }

      var model = vm.new()
      model.title = 'Registration - 2013 Ozanam Holywood Holiday Gala'
      model.amount = number.formatMoney(record.order.total)
      model.id = record._id.toHexString()
      return res.render('finish.html', model)
    })
  })

  app.post('/register/finish', function(req,res) {
    debugger;
    pay.finish(req.body.registrationId, function(err,record) {
      debugger;
      if (err) {
        console.log(err);
        if (record) {
          return res.redirect('/register/thankyou?problem=1&confirm=' + record._id.toHexString())
        }
        else
        {
          res.redirect('/problem')
          return
        }
      }

      return res.redirect('/register/thankyou?confirm=' + record._id.toHexString())
    })
  })

  app.get('/register/cancel', function(req,res) {
    reg.setCancelPayment(req.query.token, function(err,record) {
      if (err) {
        console.log(err);
        res.redirect('/problem')
        return
      }

      var model = vm.new()
      model.title = 'Registration - 2013 Ozanam Holywood Holiday Gala'
      model.amount = number.formatMoney(record.order.total)
      model.id = record._id.toHexString()
      res.render('cancel', model)
    })
  })

  app.post('/register', function(req, res) { 
    ocrypto.httpsCheck(req,res)
    var post = req.body;
    var worked = true;

    var broke = []
    if (!((post.contact || '').trim()))
      broke.push({field: 'contact', message: 'required'})
    if (!((post.street || '').trim()))
      broke.push({field: 'street', message: 'required'})
    if (!((post.city || '').trim()))
      broke.push({field: 'city', message: 'required'})
    if (!((post.state || '').trim()))
      broke.push({field: 'state', message: 'required'})
    if (!((post.zip || '').trim()))
      broke.push({field: 'zip', message: 'required'})
    if (!((post.phone || '').trim()))
      broke.push({field: 'phone', message: 'required'})
    if (!((post.email || '').trim()))
      broke.push({field: 'email', message: 'required'})

    var r = reg.new()
    r.order.level = parseInt(post.level)
    r.order.extraSeats = parseInt(post.extra || '0')
    r.order.donation = parseFloat(post.donation || '0')

    if (r.order.extraSeats < 0)
      broke.push({field: 'extra', message : 'Must be greater than 0.'})
    if (r.order.donation < 0)
      broke.push({field: 'donation', message : 'Must be greater than 0.'})

    if (broke.length > 0) {
      var model = {
        success : false,
        broke : broke
      }
      res.send(200, model)
      return
    }

    //TODO: later we can re-organize this and place the pricing into the db.
    r.order.total += r.order.donation
    r.order.total += reg.getExtraSeatsAmount(r.order.extraSeats)
    r.order.total += reg.getSponsorshipAmount(r.order.level)

    r.contact.company = post.company
    r.contact.contact = post.contact
    r.contact.street = post.street
    r.contact.city = post.city
    r.contact.state = post.state
    r.contact.zip = post.zip
    r.contact.phone = post.phone
    r.contact.fax = post.fax
    r.contact.email = post.email
    r.order.myoTaxCredit = post.myoTaxCreditInfo ? true : false
    r.order.companyMatch = post.companyMatch ? true : false
    r.order.boardMember = post.boardMember
    r.order.seating = post.seating
    r.order.paymentOption = post.paymentOption || 'check'

    reg.insert(r, function(err,data) {
      if (err) {
        console.log(err);
        return res.send(200, {success: false, broke : [], message : 'Unable register at this time. Please try again later.'})
      }

      r._id = data._id
      res.send(200, {success: true, id : r._id.toHexString()})
    });
  })
}