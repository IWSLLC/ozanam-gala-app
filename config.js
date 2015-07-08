exports.init = function() {
  process.env.PORT                = process.env.PORT || 3000
 	process.env.PORTSSL             = process.env.PORTSSL || 8000
 	process.env.ENABLESSL           = process.env.ENABLESSL || "no"
 	process.env.SSL_HOSTNAME        = process.env.SSL_HOSTNAME || "localhost:8000"
 	process.env.HOSTNAME            = process.env.HOSTNAME || "localhost:3000"
 	process.env.SESSION_SECRET      = process.env.SESSION_SECRET || "lkj234usfd908nm234sdflk324"
 	process.env.NODE_ENV            = process.env.NODE_ENV || "development"
 	process.env.MONGO               = process.env.MONGO || "mongodb://localhost:27017/gala?auto_reconnect=true&maxPoolSize=10"
 	process.env.REDIS               = process.env.REDIS || "redis://localhost:6379/"
 	process.env.ENABLE_DONATION     = process.env.ENABLE_DONATION || "yes"
 	process.env.ENABLE_REGISTRATION = process.env.ENABLE_REGISTRATION || "yes"
 	process.env.PP_HOST             = process.env.PP_HOST || "api.sandbox.paypal.com"
 	process.env.PP_PORT             = process.env.PP_PORT || ""
 	process.env.PP_CLIENT_ID        = process.env.PP_CLIENT_ID || ""
 	process.env.PP_CLIENT_SECRET    = process.env.PP_CLIENT_SECRET || ""
 	process.env.NOTIFICATION_EMAIL  = process.env.NOTIFICATION_EMAIL || ""
 	process.env.OCRYPTO             = process.env.OCRYPTO || "pass"
 	process.env.AWS_KEYID           = process.env.AWS_KEYID || ""
 	process.env.AWS_SECRET          = process.env.AWS_SECRET || ""
 	process.env.AWS_REGION          = process.env.AWS_REGION || "us-east-1"
 	process.env.DEBUG               = process.env.DEBUG || "ozanam-gala:*"
}
