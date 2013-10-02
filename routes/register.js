var reg = require('../lib/registrations')
var vm = require('../lib/vm')
var ocrypto = require('../lib/ocrypto')
var number = require('../lib/number')

module.exports = function (app, auth) {
  app.get('/register/thankyou', function(req, res) {
    var model = vm.new();
    model.confirm = req.query.confirm
    model.amount = req.query.amount
    model.title = 'Thankyou for registering! - 2013 Ozanam Holywood Holiday Gala'
    return res.render('thankyou.html', model)
  })

  //-----REGISTRATION-----
  app.get('/register', function(req, res) {
    ocrypto.httpsCheck(req,res)
    var model = vm.new()
    model.title = 'Registration - 2013 Ozanam Holywood Holiday Gala'
    return res.render('register.html', model)
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
    console.log('extra: ' + r.order.extraSeats * 150.0)
    r.order.total += (r.order.extraSeats * 150.0)

    switch(r.order.level) {
      case 1:
        r.order.total += 25000
        break;
      case 2:
        r.order.total += 15000
        break;
      case 3:
        r.order.total += 10000
        break;
      case 4:
        r.order.total += 5000
        break;
      case 5:
        r.order.total += 3000
        break;
      case 6:
        r.order.total += 2000
        break;
      case 7:
        r.order.total += 1500
        break;
      case 8:
        r.order.total += 750
        break;
      case 9:
        r.order.total += 450
        break;
    }

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
    //r.order.paymentOption = post.paymentOption || 'check'
    //TODO: update this to allow payment option.

    reg.insert(r, function(err,data) {
      if (err) {
        console.log(err);
        res.send(500, {success: false, message : 'Cannot register at this time.'})
      }
      else {
        res.send(200, {success: true, id : data._id.toHexString(), amount : number.formatMoney(r.order.total)})
      }
    });
  })
}