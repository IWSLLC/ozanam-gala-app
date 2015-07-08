#!/bin/sh -e
export NODE_ENV=test
export MONGO="mongodb://localhost:27017/gala_test?auto_reconnect=true&maxPoolSize=10"
