$(function() {
  $('#registrationForm').validate(
    {
      submitHandler : function(form) {
        var $form = $(form);
        var $button = $form.find('button[type="submit"]');

      }
    });
}); //end ready
