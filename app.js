var express = require('express');
var routes = require('./routes');
var authentication = require('./lib/authentication')
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('portssl', process.env.PORTSSL || 8000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('ejs').__express);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

var auth = authentication.basicAuth(app);

//load routes
require('./routes/index')(app, auth);

//HTTP server
var serverHttp = http.createServer(app)
serverHttp.on('error', function(err) {
  console.error(err)
})
serverHttp.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//HTTPS server
if (process.env.ENABLESSL === 'yes') {
  var options = {
    key: fs.readFileSync('private/privatekey.pem'),
    cert: fs.readFileSync('private/certificate.pem')
  };
  
  var serverSSL = https.createServer(options, app)
  serverSSL.on('error', function(err) {
    console.error(err)
  })
  serverSSL.listen(app.get('portssl'), function() {
    console.log('Express server listening on port ' + app.get('portssl'));
  });
}
process.on('uncaughtException', function (err) {
  console.error('uncaughtException:', err.message)
  console.error(err.stack)
  process.exit(1)})

process.on('exit', function() {
  console.log('closing db connections...')
  require('./lib/sharedMongo').close()});


