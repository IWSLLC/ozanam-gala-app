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
  next()
})


//ENDPOINTS - Pages
// router.get('/', programs);

//Sub-Endpoints - API calls for app requests.
router.use('/api', require("./manage-api"))

module.exports = router;
