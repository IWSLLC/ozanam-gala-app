//routes
module.exports = function (app, auth) {
  require('./public')(app, auth)
  require('./manage')(app, auth)
  require('./register')(app, auth)
  require('./auction')(app, auth)
}

