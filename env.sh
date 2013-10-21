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
export PP_CLIENT_ID=""
export PP_CLIENT_SECRET=""
export NOTIFICATION_EMAIL=""
