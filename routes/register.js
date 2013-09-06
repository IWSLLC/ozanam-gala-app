var reg = require('../lib/registrations')
var vm = require('../lib/vm')
var ocrypto = require('../lib/ocrypto')

module.exports = function (app, auth) {
  app.get('/register/thankyou', function(req, res) {
    var model = vm.new();
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
      broke.push({fdield: 'zip', message: 'required'})
    if (!((post.phone || '').trim()))
      broke.push({field: 'phone', message: 'required'})
    if (!((post.email || '').trim()))
      broke.push({field: 'email', message: 'required'})

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
    r.contact.company = post.company
    r.contact.contact = post.contact
    r.contact.street = post.street
    r.contact.city = post.city
    r.contact.state = post.state
    r.contact.zip = post.zip
    r.contact.phone = post.phone
    r.contact.fax = post.fax
    r.contact.email = post.email
    r.order.level = parseInt(post.level)
    r.order.extraSeats = parseInt(post.extra || '0')
    r.order.donation = parseFloat(post.donation || '0')
    r.order.myoTaxCredit = post.myoTaxCreditInfo ? true : false
    r.order.companyMatch = post.companyMatch ? true : false
    r.order.boardMember = post.boardMember
    r.order.seating = post.seating
    r.order.sendInvoice = post.sendInvoice ? true : false

    reg.insert(r, function(err,data) {
      if (err) {
        console.log(err);
        res.send(500, {success: false, message : 'Cannot register at this time.'})
      }
      else {
        res.send(200, {success: true, id : data._id.toHexString()})
      }
    });
  })
}