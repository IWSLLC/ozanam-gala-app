var router = require('express').Router();
var passport = require("passport")

//setup default view models.
router.use(function(req,res,next) {
  res.locals.title = "Ozanam Hollywood Holiday Gala";
  res.locals.titlesuffix = false
  res.locals.layout = "public";
  res.locals.scripts = [
    "/bower_components/jquery/dist/jquery.min.js"
    ,"/bootstrap/js/bootstrap.min.js"
    ,"/js/global.js"
  ]
  next()
})

router.use(require("./auction"))
router.use(require("./register"))

router.get("/", function(req,res,next){ return res.render('index', {head_image_class : 'image-web2'})})
router.get('/history', function(req,res,next) { res.render('history', {head_image_class : 'image-web4', title : 'Our History'})})
router.get('/sponsor', function(req,res,next) { res.render('sponsor', {head_image_class : 'image-web5', title : 'Sponsorships'}) })
router.get('/problem', function(req,res,next) { res.render('problem', {title : 'Oops! Something happened'})})

/* GET home page. */
router.get('/login', function(req, res) {
  vm = {
    title : "Login"
    ,layout : "login"
  }
  if (req.query.redirectTo)
    vm.redirectTo = req.query.redirectTo
  res.render('login', vm);
});

router.get('/logout', function(req,res,next) {
  req.logout()
  res.redirect("/")
})

router.post('/login', function(req, res, next) {
  failDone = function(info) {
    message = "Username or password is invalid."
    if (info) {
      if (info.message)
        message = info.message
      else
        message = info
    }
    return res.render('login', { layout : 'login', message : message, redirectTo : req.body.redirectTo })
  }
  passport.authenticate('local', function(err,user,info) {
    if (err) return next(err)
    if (!user) return failDone(info)

    redirectTo = req.body.redirectTo
    if (!redirectTo) redirectTo = '/manage'

    req.login(user, function(err) {
      if (err) return next(err)
      return res.redirect(redirectTo)
    })
  })(req,res,next)
});

module.exports = router;
