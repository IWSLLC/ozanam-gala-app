[![Build Status](https://travis-ci.org/IWSLLC/ozanam-gala-app.svg?branch=master)](https://travis-ci.org/IWSLLC/ozanam-gala-app)

This is a sample project for the Ozanam Gala registration website that I started in mid 2013. It started as a learning project and now cruises along in maintenance mode with occasional updates to infrastructure. Bear in mind some of the tech used here is a bit dated and only updated as necessary.

Current tech stack: Express 4,  (express-handlebars), MongoDb (native driver w/ a thin wrapper), AWS-SMS for email, and a simple Paypal integration. Also I've recently (mid-2015) added some basic testing to ensure pricing and other misc functions using Mocha.

To test, please use `bin/t`. Some of the tests include partial integrations to a test database.  `bin/t` is a simple way to load up a test environment and test against a sandbox database. 
