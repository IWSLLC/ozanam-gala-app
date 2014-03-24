var handlebars = require('handlebars')

handlebars.registerHelper('yesNo', function (value) {
  return value ? "Yes" : "No"
})
