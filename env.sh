#!/bin/sh -e 

export PORT=3000
export PORTSSL=8000
export ENABLESSL=no
export SSL_HOSTNAME=localhost:8000
export HOSTNAME=localhost:3000
export NODE_ENV=development
export OCRYPTO=pass
export MONGO="mongodb://localhost:27017/gala?auto_reconnect=true&maxPoolSize=10"
export PP_HOST="api.sandbox.paypal.com"
export PP_PORT=""
export PP_CLIENT_ID="AaLRPRARNlKIAUsZ3qyYlJlcuo3QRJzGHA8h6a0LDkrnJJIKdV2RoOUpcgz4"
export PP_CLIENT_SECRET="ECTJxRDiMzI89Pg91bP0Qq52IMGtDRccEFfgLn1nmkB6HHWb8w5Z3DFUOlz7"