var express = require('express')
var accounts = require('./accounts')
var ocrypto = require('./ocrypto')

var validate = function(username,password,callback) {
  accounts.find(username, function(err, user) {
    if (err) 
      return callback(err)

    if (!user)
      return callback('User not found.');

    var success = ocrypto.decrypt(user.password) === password;

    callback(null,success);
  })
}

exports.basicAuth = function() {
  // Asynchronous
  var auth = express.basicAuth(validate);

  return auth;
}

exports.validate = validate

exports.changePassword = function(username,oldpassword,newpassword, callback) {
  accounts.find(username, function(err,user) {
    if (err) 
      return callback(err)

    if (!user)
      return callback('User not found.');

    this.validate(username,oldpassword, function(err,result) {
      if (err)
        return callback(err)

      if (!result)
        return callback('Invalid username or password.')

      user.password = ocrypto.encrypt(newpassword);
      accounts.save(user, function(err,result) {
        callback(err,result);
      })
    })
  })
}