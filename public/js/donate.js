(function() {
  $(function() {
    $('.datepicker').datepicker();

    $('#optionSelfDelivery').change(function() {
      $date = $('#selfDeliveryDate')
      if ($(this).is(':checked'))
        $date.attr('required','required')
      else
        $date.removeAttr('required')
    })

    $('#donateForm').validate(
      {
        debug: true,
        errorPlacement: function(error, element) {
          // if the input has a prepend or append element, put the validation msg after the parent div
          if(element.parent().hasClass('input-prepend') || element.parent().hasClass('input-append')) {
            error.insertAfter(element.parent());    
          // else just place the validation message immediatly after the input
          } else {
            error.insertAfter(element);
          }
        },
        errorElement: "div", // contain the error msg in a small tag
        errorClass : 'help-block error',
        wrapper: "div", // wrap the error message and small tag in a div
        highlight: function(element) {
          $(element).closest('.control-group').addClass('error'); // add the Bootstrap error class to the control group
        },
        success: function(element) {
          $(element).closest('.control-group').removeClass('error'); // remove the Boostrap error class from the control group
        },
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
                  $field.addClass('error');
                }
                console.log(json.broke[ix].field);
              });
            }
          }, 'json');
        }
      });
  }); //end ready
}).call(this);