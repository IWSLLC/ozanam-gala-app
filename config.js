var getValue = function(key,_default) {
	if (typeof process.env[key] === 'undefined')
		return _default
	return process.env[key]
}

exports.init = function() {
  process.env.NODE_ENV            = getValue("NODE_ENV","development")
	process.env.DEBUG               = getValue("DEBUG","ozanam-gala:*")

	process.env.PORT                = getValue("PORT",3000)
	process.env.PORTSSL             = getValue("PORTSSL",8000)
	process.env.ENABLESSL           = getValue("ENABLESSL","no")
	process.env.LOCALSSL            = getValue("LOCALSSL","yes")
	process.env.HOSTNAME            = getValue("HOSTNAME","localhost:3000")
	process.env.HOSTNAMESSL         = getValue("HOSTNAMESSL","localhost:8000")

	process.env.SSL_PRIVATE         = getValue("SSL_PRIVATE","privatekey.pem")
	process.env.SSL_CERT            = getValue("SSL_CERT","certificate.pem")
	process.env.SSL_CA              = getValue("SSL_CA","DigiCertCA.crt,TrustedRoot.crt")

	process.env.SESSION_SECRET      = getValue("SESSION_SECRET","lkj234usfd908nm234sdflk324")

	process.env.MONGO               = getValue("MONGO","mongodb://localhost:27017/gala?auto_reconnect=true&maxPoolSize=10")
	process.env.REDIS               = getValue("REDIS","redis://localhost:6379/")

  process.env.ENABLE_DONATION     = getValue("ENABLE_DONATION", "yes")
 	process.env.ENABLE_REGISTRATION = getValue("ENABLE_REGISTRATION", "yes")

  process.env.NOTIFICATION_EMAIL  = getValue("NOTIFICATION_EMAIL", "")
 	process.env.OCRYPTO             = getValue("OCRYPTO", "pass")

 	process.env.PP_HOST             = getValue("PP_HOST", "api.sandbox.paypal.com")
 	process.env.PP_PORT             = getValue("PP_PORT", "")
 	process.env.PP_CLIENT_ID        = getValue("PP_CLIENT_ID", "")
 	process.env.PP_CLIENT_SECRET    = getValue("PP_CLIENT_SECRET", "")

 	process.env.AWS_KEYID           = getValue("AWS_KEYID", "")
 	process.env.AWS_SECRET          = getValue("AWS_SECRET", "")
 	process.env.AWS_REGION          = getValue("AWS_REGION", "us-east-1")
}
