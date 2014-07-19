$(function() {
  $('.datepicker').datepicker({autoclose: true});

  $('#optionSelfDelivery').change(function() {
    $date = $('#selfDeliveryDate')
    if ($(this).is(':checked'))
      $date.attr('required','required')
    else
      $date.removeAttr('required')
  })

  $('#donateForm').validate(
    {
      submitHandler : function(form) {
        var $form = $(form);
        var $button = $form.find('button[type="submit"]');
        $button.attr('disabled','disabled');
        $.post($form.attr('action'), $form.serialize(), function(json) {
          if (json.success)
            window.location = '/auction/thankyou?confirm=' + json.id;
          else {
            $button.removeAttr('disabled');

            $(json.broke).each(function(ix) {
              var field;
              field = json.broke[ix];
              $field = $form.find('#' + field.field);
              if ($field) {
                $field.closest('.form-group').addClass('error');
              }
              console.log(json.broke[ix].field);
            });
          }
        }, 'json');
      }
    });
}); //end ready
