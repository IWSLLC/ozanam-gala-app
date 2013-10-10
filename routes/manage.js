var reg = require('../lib/registrations')
var don = require('../lib/donations')
var vm = require('../lib/vm')
var jsoncsv = require('json-csv');
var moment = require('moment')
var ocrypto = require('../lib/ocrypto')
var number = require('../lib/number')

module.exports = function (app, auth) {

  //SECURE MANAGE
  app.get('/manage', auth, function(req, res) {
    ocrypto.httpsCheck(req,res)

    var model = vm.new();
    model.title = 'Manage Registrations'
    return res.render('manage/index.html', model);
  })
  app.get('/manage/donations', auth, function(req, res) {
    ocrypto.httpsCheck(req,res)

    var model = vm.new();
    model.title = 'Manage Donations'
    return res.render('manage/donations.html', model);
  })

  //SECURE MANAGE API
  app.get('/manage/api/registrations/:year', auth, function(req,res) {
    ocrypto.httpsCheck(req,res)
    var csv = req.query.csv ? true : false
    var downloaded = req.query.downloaded ? true : false
    var year = parseInt(req.param('year'))
    if (year === NaN)
      year = new Date().getFullYear();

    reg.find(downloaded, year, function(err,data) {
      if (!err) {
        if (csv)
          jsoncsv.toCSV(
            {
              data: data, 
              fields : [{name : '_id', label : 'Confirmation'},
                        {name : 'contact.contact', label : 'contact'},
                        {name : 'contact.company', label : 'company'},
                        {name : 'contact.street', label : 'street'},
                        {name : 'contact.city', label : 'city'},
                        {name : 'contact.state', label : 'state'},
                        {name : 'contact.zip', label : 'zip'},
                        {name : 'contact.phone', label : 'phone'},
                        {name : 'contact.fax', label : 'fax'},
                        {name : 'contact.email', label : 'email'},
                        {
                          name : 'order.dateRegistered', 
                          label : 'dateRegistered',
                          filter : function(value) {
                            return moment(value).format('M/D/YYYY')
                          }
                        },
                        {name : 'order.year', label : 'year'},
                        {
                          name : 'order.level', 
                          label : 'level', 
                          filter : function(value) {
                            return reg.getSponsorshipInfo(value).description
                          }
                        },
                        {name : 'order.extraSeats', label : 'extra seats'},
                        {name : 'order.donation', label : 'Donation'},
                        {name : 'order.myoTaxCredit', label : 'myo tax credit', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        {name : 'order.companyMatch', label : 'company match', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        {name : 'order.boardMember', label : 'referred by board member'},
                        {name : 'order.seating', label : 'seating preference'},
                        {name : 'order.total', label : 'TOTAL'},
                        {name : 'order.paymentOption', label : 'payment option'}
                        ]
            }, 
            function(err,csv) {
              var now = moment()
              res.attachment('gala-registrations-' + now.format('YYYY-MM-DD-HHmmss') + '.csv')
              res.send(csv)
              //flag these as downloaded. 
              var ids = []
              for(var ix=0;ix<data.length;ix++){
                ids.push(data[ix]._id)
              }

              reg.flagDownloaded(ids, function(err,result) {
                if (err)
                  console.dir(err)
             })
          })
        else {
          for(var ix=0;ix<data.length;ix++) {
            var i = data[ix];
            i.sponsorship = reg.getSponsorshipInfo(i.order.level).description
            i.total = number.formatMoney(i.order.total)
          }
          res.send(200, {success : true, data : data})
        }
      }
      else 
        res.send(500, {success : false, data : null, error : err})
    });
  })
  app.get('/manage/api/donations/:year', auth, function(req,res) {
    ocrypto.httpsCheck(req,res)
    var csv = req.query.csv ? true : false
    var downloaded = req.query.downloaded ? true : false
    var year = parseInt(req.param('year'))
    if (year === NaN)
      year = new Date().getFullYear();

    don.find(downloaded, year, function(err,data) {
      if (!err) {
        if (csv)
          jsoncsv.toCSV(
            {
              data: data, 
              fields : [{name : '_id', label : 'Confirmation'},
                        {name : 'contact.donor', label : 'donor'},
                        {name : 'contact.contact', label : 'contact' },
                        {name : 'contact.company', label : 'company'},
                        {name : 'contact.street', label : 'street'},
                        {name : 'contact.city', label : 'city'},
                        {name : 'contact.state', label : 'state'},
                        {name : 'contact.zip', label : 'zip'},
                        {name : 'contact.phone', label : 'phone'},
                        {name : 'contact.email', label : 'email'},
                        {
                          name : 'dateRegistered', 
                          label : 'Registered',
                          filter : function(value) {
                            return moment(value).format('M/D/YYYY')
                          }
                        },
                        {name : 'item.year', label : 'year'},
                        {name : 'item.description', label : 'description'},
                        {name : 'item.value', label : 'value'},
                        {name : 'item.restrictions', label : 'restrictions'},
                        {name : 'item.optionSelfDelivery', label : 'self delivery', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        {name : 'item.selfDeliveryDate', label : 'delivery date (if self delivery)'},
                        {name : 'item.optionPickup', label : 'pickup', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        {name : 'item.optionPrepareCertificate', label : 'prepare certificate', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        {name : 'item.optionDisplayMaterials', label : 'display materials', filter: function(value) { return value === true ? 'Yes' : 'No'}},
                        ]
            }, 
            function(err,csv) {
              var now = moment()
              res.attachment('gala-auction-items-' + now.format('YYYY-MM-DD-HHmmss') + '.csv')
              res.send(csv)
              //flag these as downloaded. 
              var ids = []
              for(var ix=0;ix<data.length;ix++){
                ids.push(data[ix]._id)
              }

              don.flagDownloaded(ids, function(err,result) {
                if (err)
                  console.dir(err)
             })
          })
        else
          res.send(200, {success : true, data : data})
      }
      else 
        res.send(500, {success : false, data : null, error : err})
    });
  })
}