var vm = function() { 
  var self;
  self = this;

  self.title = '';
  self.titlesuffix = true
  self.meta = {
    description : '',
    author : ''
  };

  return self;
}

exports.new = function() {
  return new vm();
}
