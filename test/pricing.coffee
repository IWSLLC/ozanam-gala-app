should  = require "should"
pricing = require "../lib/pricing"

describe "Pricing", ->
  describe "When getting extra seat price", ->
    before ->
      @result = pricing.getExtraSeatsPrice()
    it "should return the correct amount", -> @result.should.equal 150

  describe "When calculating extra seat amount for 5 seats", ->
    before ->
      @result = pricing.getExtraSeatsAmount(5)
    it "should return the correct amount", -> @result.should.equal 750

  describe "When getting sponsorship amount for level 1", ->
    before ->
      @result = pricing.getSponsorshipInfo(1)
    it "should return the correct amount", -> @result.amount.should.equal 50000
    it "should return the correct description", -> @result.description.should.equal 'Award Winner $50,000 (24 seats)'

  describe "When getting sponsorship amount for level 2", ->
    before ->
      @result = pricing.getSponsorshipInfo(2)
    it "should return the correct amount", -> @result.amount.should.equal 25000
    it "should return the correct description", -> @result.description.should.equal 'Hollywood Star $25,000 (20 seats)'

  describe "When getting sponsorship amount for level 3", ->
    before ->
      @result = pricing.getSponsorshipInfo(3)
    it "should return the correct amount", -> @result.amount.should.equal 10000
    it "should return the correct description", -> @result.description.should.equal 'Star $10,000 (10 seats)'

  describe "When getting sponsorship amount for level 4", ->
    before ->
      @result = pricing.getSponsorshipInfo(4)
    it "should return the correct amount", -> @result.amount.should.equal 5000
    it "should return the correct description", -> @result.description.should.equal 'Co-Star $5,000 (10 seats)'

  describe "When getting sponsorship amount for level 5", ->
    before ->
      @result = pricing.getSponsorshipInfo(5)
    it "should return the correct amount", -> @result.amount.should.equal 2500
    it "should return the correct description", -> @result.description.should.equal 'Producer $2,500 (10 seats)'

  describe "When getting sponsorship amount for level 6", ->
    before ->
      @result = pricing.getSponsorshipInfo(6)
    it "should return the correct amount", -> @result.amount.should.equal 500
    it "should return the correct description", -> @result.description.should.equal 'Supporting Cast $500 (2 seats)'

  describe "When getting sponsorship amount for unknown level", ->
    before ->
      @result = pricing.getSponsorshipInfo(3434)
    it "should return the correct amount", -> @result.amount.should.equal 0
    it "should return the correct description", -> @result.description.should.equal 'Extra Seats'
    it "should return the correct description", -> @result.level.should.equal 10
