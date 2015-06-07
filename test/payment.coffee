should       = require "should"
sinon        = require "sinon"
async        = require "async"
paypal_sdk   = require 'paypal-rest-sdk'
payment      = require "../lib/payment"
Registration = require "../lib/models/registration"
collection   = require "../lib/collections/registrations"

describe "Payment", ->
  describe "When starting payment with basic level 1", ->
    before (done) ->
      async.series [
        (cb) -> collection.remove({}, cb)
        (cb) =>
          @registration = new Registration
            order :
              level : 1
              extraSeats : 0
              donation : 0
              total : 50000
          @paypal_start = sinon.stub paypal_sdk.payment, "create", (arg, callback) =>
            @arg = arg
            callback null,
              id : "1234"
              links : [
                {rel : 'approval_url', href : "http://test?token=1234"}
              ]
          cb()
        (cb) => collection.insert @registration, cb
        (cb) => payment.start @registration, cb
        (cb) => collection.findById @registration._id, (err,doc) =>
          @registration = doc
          cb err
      ], done
    after ->
      @paypal_start.restore()

    it "should send the correct total to paypal", -> @arg.transactions[0].amount.total.should.equal "50,000.00"
    it "should contain one item", -> @arg.transactions[0].item_list.items.length.should.equal 1

  describe "When starting payment with basic level 1 and an extra seat", ->
    before (done) ->
      async.series [
        (cb) -> collection.remove({}, cb)
        (cb) =>
          @registration = new Registration
            order :
              level : 1
              extraSeats : 1
              donation : 0
              total : 50150
          @paypal_start = sinon.stub paypal_sdk.payment, "create", (arg, callback) =>
            @arg = arg
            callback null,
              id : "1234"
              links : [
                {rel : 'approval_url', href : "http://test?token=1234"}
              ]
          cb()
        (cb) => collection.insert @registration, cb
        (cb) => payment.start @registration, cb
        (cb) => collection.findById @registration._id, (err,doc) =>
          @registration = doc
          cb err
      ], done
    after ->
      @paypal_start.restore()

    it "should send the correct total to paypal", -> @arg.transactions[0].amount.total.should.equal "50,150.00"
    it "should contain one item", -> @arg.transactions[0].item_list.items.length.should.equal 2

  describe "When starting payment with basic level 1, extra seat, and a donation", ->
    before (done) ->
      async.series [
        (cb) -> collection.remove({}, cb)
        (cb) =>
          @registration = new Registration
            order :
              level : 1
              extraSeats : 1
              donation : 100
              total : 50250
          @paypal_start = sinon.stub paypal_sdk.payment, "create", (arg, callback) =>
            @arg = arg
            callback null,
              id : "1234"
              links : [
                {rel : 'approval_url', href : "http://test?token=1234"}
              ]
          cb()
        (cb) => collection.insert @registration, cb
        (cb) => payment.start @registration, cb
        (cb) => collection.findById @registration._id, (err,doc) =>
          @registration = doc
          cb err
      ], done
    after ->
      @paypal_start.restore()

    it "should send the correct total to paypal", -> @arg.transactions[0].amount.total.should.equal "50,250.00"
    it "should contain one item", -> @arg.transactions[0].item_list.items.length.should.equal 3

  describe "When starting payment with no level 10, no extra seats, and a donation", ->
    before (done) ->
      async.series [
        (cb) -> collection.remove({}, cb)
        (cb) =>
          @registration = new Registration
            order :
              level : 10
              extraSeats : 0
              donation : 1
              total : 1
          @paypal_start = sinon.stub paypal_sdk.payment, "create", (arg, callback) =>
            @arg = arg
            callback null,
              id : "1234"
              links : [
                {rel : 'approval_url', href : "http://test?token=1234"}
              ]
          cb()
        (cb) => collection.insert @registration, cb
        (cb) => payment.start @registration, cb
        (cb) => collection.findById @registration._id, (err,doc) =>
          @registration = doc
          cb err
      ], done
    after ->
      @paypal_start.restore()

    it "should send the correct total to paypal", -> @arg.transactions[0].amount.total.should.equal "1.00"
    it "should contain one item", -> @arg.transactions[0].item_list.items.length.should.equal 1
