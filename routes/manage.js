var reg = require('../lib/registrations')
var don = require('../lib/donations')
var vm = require('../lib/vm')
var jsoncsv = require('json-csv');
var moment = require('moment')
var ocrypto = require('../lib/ocrypto')

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
              fields : [{ name : 'contact.contact',
                          label : 'contact'
                        },
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
                            switch(value) 
                            {
                              case 1 : return '$25,000+ Hollywood Star';
                              case 2 : return 'Major Star ($15,000)';
                              case 3 : return 'Star ($10,000)';
                              case 4 : return 'Co-Star ($5,000)';
                              case 5 : return 'Producer ($3,000)';
                              case 6 : return 'Table Host ($25,000 +)';
                              case 7 : return 'Underwriter ($15,000)';
                              case 8 : return 'Supporting Cast ($10,000)';
                              case 9 : return 'Corporate Sponsor ($5,000)';
                              case 10 : return 'Extra Seats Only';
                              default : return '';
                            }
                          }
                        },
                        {name : 'order.extraSeats', label : 'extra seats'},
                        {name : 'order.myoTaxCredit', label : 'myo tax credit'},
                        {name : 'order.companyMatch', label : 'company match'},
                        {name : 'order.boardMember', label : 'referred by board member'}
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
        else
          res.send(200, {success : true, data : data})
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
              fields : [{ name : 'contact.donor',
                          label : 'donor'
                        },
                        { name : 'contact.contact',
                          label : 'contact'
                        },
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
                        {name : 'item.optionDeliveredWithForm', label : 'delivered with form'},
                        {name : 'item.optionSelfDelivery', label : 'self delivery'},
                        {name : 'item.selfDeliveryDate', label : 'delivery date (if self delivery)'},
                        {name : 'item.optionPickup', label : 'pickup'},
                        {name : 'item.optionPrepareCertificate', label : 'prepare certificate'},
                        {name : 'item.optionDisplayMaterials', label : 'display materials'},
                        ]
            }, 
            function(err,csv) {
              var now = moment()
              res.attachment('gala-donations-' + now.format('YYYY-MM-DD-HHmmss') + '.csv')
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