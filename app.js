var express      = require('express');
var path         = require('path');
var favicon      = require('static-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var passport     = require('passport')
var url          = require('url')
var redis        = require('redis')
var auth         = require('./lib/authentication')
var accounts     = require('./lib/collections/accounts')
var session      = require("express-session")
var app          = express();
var RedisStore, redisUrl, sessionClient;
var hbs          = require('./lib/hbs-setup')(app)
var paypal_sdk = require('paypal-rest-sdk');
paypal_sdk.configure({
  'mode': process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  'client_id': process.env.PP_CLIENT_ID,
  'client_secret': process.env.PP_CLIENT_SECRET
});

//passport serialize and setup
passport.use(auth.strategy());
passport.serializeUser(function(user, done) {
  return done(null, user._id.toString());
});
passport.deserializeUser(function(id, done) {
  return accounts.findById(id, function(err, doc) {
    if (err) return done(err);
    if (!doc) return done(err, null);
    return done(err, doc);
  });
});

if (/yes/i.test(process.env.ENABLESSL)) {
  app.use(function(req, res, next) {
    var port, usingSSL;
    usingSSL = req.secure || req.headers['x-forwarded-proto'] == 'https';
    if (!usingSSL) {
      return res.redirect(301, "https://" + process.env.SSL_HOSTNAME + req.originalUrl);
    } else {
      return next();
    }
  });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//session setup
//app.use(cookieParser(process.env.SESSION_SECRET || 'hello cooooookie'));
var cookieOptions = {
   cookie            : {httpOnly: true} //default setting for cookies.
  ,secret            : process.env.SESSION_SECRET || 'hello cooooookie'
  ,saveUninitialized : true //default
  ,resave            : true //default
}

//use redis (if redis env setup)
if (process.env.REDIS) {
  RedisStore = require('connect-redis')(session);
  redisUrl = url.parse(process.env.REDIS);
  sessionClient = redis.createClient(redisUrl.port, redisUrl.hostname);
  if (redisUrl.auth) {
    sessionClient.auth(redisUrl.auth.split(":")[1]);
  }
  cookieOptions.store = new RedisStore({
    client: sessionClient
  })
}
app.use(session(cookieOptions));


//static files /public == /
app.use(express.static(path.join(__dirname, 'public')));

//Passport init
app.use(passport.initialize())
app.use(passport.session())

//Handlebars templates to use client-side
app.use(hbs.exposeTemplates)

app.use(function(req,res,next) {
  res.locals.production = process.env.NODE_ENV == 'production'
  res.locals.development = process.env.NODE_ENV == 'development'
  next()
})

//public routes.
app.use(require("./routes/public"))

//app rendered routes
app.use('/manage', require("./routes/manage"))

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    view = 'problem'
    if (process.env.NODE_ENV === 'development' || (req.user && req.user.isAdmin))
      view = 'error'
    else
      err = {}

    res.render('error', {
        message: err.message,
        error: err,
        layout : 'public'
    });
});

module.exports = app;
