var _ = require("lodash")

var pricing = function() {
  this.extraSeatsPrice = 150.0
  this.sponsorLevels = [
    {
      level: 1,
      amount : 50000,
      description: 'Award Winner $50,000 (24 seats)'
    },
    {
      level: 2,
      amount : 25000,
      description: 'Hollywood Star $25,000 (20 seats)'
    },
    {
      level: 3,
      amount : 10000,
      description: 'Star $10,000 (10 seats)'
    },
    {
      level: 4,
      amount : 5000,
      description: 'Co-Star $5,000 (10 seats)'
    },
    {
      level: 5,
      amount : 2500,
      description: 'Producer $2,500 (10 seats)'
    },
    {
      level: 6,
      amount : 500,
      description: 'Supporting Cast $500 (2 seats)'
    },
  ];
  return this
}

pricing.prototype.getSponsorshipInfo = function(level) {
  var match = _.find(this.sponsorLevels, function(s) {return s.level === level})
  if (match) return match;
  return { level: 10, amount: 0.0, description: 'Extra Seats'};
}

pricing.prototype.getExtraSeatsPrice = function() { return this.extraSeatsPrice }

pricing.prototype.getExtraSeatsAmount = function(seats) {
  return seats * this.extraSeatsPrice;
}
pricing.prototype.getSponsorshipAmount = function(level) {
  var s = this.getSponsorshipInfo(level);
  if (s)
    return s.amount;

  return 0.0;
}

module.exports = new pricing()
