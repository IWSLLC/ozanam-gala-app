var router = require('express').Router();
var passport = require("passport")

//setup default view models.
router.use(function(req,res,next) {
  res.locals.title = "Ozanam Hollywood Holiday Gala";
  res.locals.titlesuffix = false
  res.locals.layout = "public";
  res.locals.scripts = [
    "/bower_components/jquery/dist/jquery.min.js"
    ,"/bower_components/bootstrap/dist/js/bootstrap.min.js"
  ]
  next()
})

router.use(require("./auction"))
router.use(require("./register"))

router.get("/", function(req,res,next){ return res.render('index', {head_image_class : 'image-web2'})})
router.get('/history', function(req,res,next) { res.render('history', {head_image_class : 'image-web4', title : 'Our History'})})
router.get('/sponsor', function(req,res,next) { res.render('sponsor', {head_image_class : 'image-web3', title : 'Sponsorships'}) })
router.get('/problem', function(req,res,next) { res.render('problem', {title : 'Oops! Something happened'})})

/* GET home page. */
router.get('/login', function(req, res) {
  vm = {
    title : "Login"
    ,layout : "login"
  }
  res.locals.scripts.push("/bower_components/jquery.validation/jquery.validate.js")
  res.locals.scripts.push("/js/login.js")

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
    res.locals.scripts.push("/bower_components/jquery.validation/jquery.validate.js")
    res.locals.scripts.push("/js/login.js")

    message = "Username or password is invalid."
    if (info && info.message)
      message = info.message
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
