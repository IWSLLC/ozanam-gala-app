var exphbs = require('express3-handlebars');
var helpers = require('./hbs-helpers');
var hbs;


var hbsSetup = function(app) {
  this.app = app
  return this;
}
var instance = null;

hbs = exphbs.create({
    defaultLayout : 'public',
    helpers       : helpers,
    extname       : '.hbs',

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        './views/shared/',
        './views/partials/'
    ]
});

hbsSetup.prototype.expressHandlebars = hbs
hbsSetup.prototype.engine = hbs.engine


hbsSetup.prototype.exposeTemplates = function(req, res, next) {
  // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
  // templates which will be shared with the client-side of the app.
  hbs.loadTemplates('./views/shared', {
      cache      : instance.app.enabled('view cache'),
      precompiled: true
  }, function (err, templates) {
      if (err) { return next(err); }

      // RegExp to remove the ".handlebars" extension from the template names.
      var extRegex = new RegExp(hbs.extname + '$');

      // Creates an array of templates which are exposed via
      // `res.locals.templates`.
      templates = Object.keys(templates).map(function (name) {
          return {
              name    : name.replace(extRegex, ''),
              template: templates[name]
          };
      });

      // Exposes the templates during view rendering.
      if (templates.length) {
          res.locals.templates = templates;
      }

      next();
  });
}

module.exports = function (app) {
  instance = new hbsSetup(app)
  return instance;
}
