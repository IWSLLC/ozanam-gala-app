$.validator.setDefaults({
  debug: false,
  errorPlacement: function(error, element) {
    if(element.parent().hasClass('input-group')) {
      error.insertAfter(element.parent());
    } else {
      error.insertAfter(element);
    }
  },
  errorElement: "div", // contain the error msg in a small tag
  errorClass : 'help-block has-error',
  wrapper: "div", // wrap the error message and small tag in a div
  highlight: function(element) {
    $(element).closest('.form-group').addClass('has-error'); // add the Bootstrap error class to the control group
  },
  success: function(element) {
    var $group = $(element).closest('.form-group');
    $group.removeClass('has-error'); // remove the Boostrap error class from the control group
    $group.find('.temp').remove();
  }
});
