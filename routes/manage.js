var router = require('express').Router();
var _      = require ("lodash")

//require authorization for all /app
router.use(function(req,res,next) {
  if (!req.user) {
    if (req.is('json') || req.is('image') || req.is('application'))
      return res.send(401, "Not authorized")
    return res.redirect('/login?redirectTo=' + encodeURIComponent(req.originalUrl))
  }
  next()
})


//preload the view model with global stuff for the layout (like user)
router.use(function(req,res,next) {
  res.locals.user = req.user
  res.locals.title = "Site Manager"
  res.locals.layout = "manage"
  res.locals.scripts = [
     "/bower_components/jquery/dist/jquery.min.js"
    ,"/bootstrap/js/bootstrap.min.js"
    ,"/js/global.js"
    ,"/bower_components/moment/moment.js"
    ,"/bower_components/handlebars/handlebars.runtime.min.js"
  ]
  next()
})

router.get('/auctions', function(req,res,next) {
  res.locals.scripts.push("/bower_components/datatables/media/js/jquery.dataTables.js")
  res.locals.scripts.push("/js/manage/auctions.js")
  return res.render('manage/auctions')
})
router.get('/', function(req,res,next) {
  res.locals.scripts.push("/bower_components/datatables/media/js/jquery.dataTables.js")
  res.locals.scripts.push("/js/manage/index.js")
  return res.render('manage/index')
})


//Sub-Endpoints - API calls for app requests.
router.use('/api', require("./manage-api"))

module.exports = router;
