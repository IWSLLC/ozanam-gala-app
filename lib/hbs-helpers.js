var handlebars = require('handlebars')

var helpers = {
  yesNo : function (value) {
    return value ? "Yes" : "No"
  }
  ,disabledBool : function(value) {
    return value ? "disabled" : ""
  }
}

handlebars.registerHelper("yesNo", helpers.yesNo)
handlebars.registerHelper("disabledBool", helpers.yesNo)

module.exports = helpers;
