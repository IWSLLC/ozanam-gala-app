var vm = require('../lib/vm.js')

module.exports = function (app, auth) {
  app.get('/', function(req, res) {
    var model = vm.new();
    model.title = 'Welcome to the 2013 Ozanam Hollywood Holiday Gala'
    model.titlesuffix = false
    return res.render('index.html', model)
  })
  app.get('/history', function(req, res) {
    var model = vm.new();
    model.title = 'Our History'
    return res.render('history.html', model)
  })
  app.get('/sponsor', function(req, res) {
    var model = vm.new();
    model.title = 'Sponsorships'
    return res.render('sponsor.html', model)
  })
  app.get('/problem', function(req, res) {
    var model = vm.new();
    model.title = 'Oops! Something happened!'
    return res.render('problem.html', model)
  })
}