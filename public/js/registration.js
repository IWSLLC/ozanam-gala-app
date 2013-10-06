(function() {
  $(function() {
    $('#registrationForm').validate(
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
          var $group = $(element).closest('.control-group');
          $group.removeClass('error'); // remove the Boostrap error class from the control group
          $group.find('.temp').remove();
        },
        submitHandler : function(form) {
          var $form = $(form);
          var $button = $form.find('button[type="submit"]');
          $button.attr('disabled','disabled');
          $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            error: function(req,textStatus,err) {
              $button.removeAttr('disabled');
              if (req.responseJSON && req.responseJSON.message) {
                var $err;
                $err = $('#error');
                $err.text(req.responseJSON.message);
                $err.show()
              }
            },
            success: function(json) {
              if (json.success)
              {
                if (json.message)
                  alert(json.message);

                if (json.payment == 'paypal') 
                  window.location = json.redirect;
                else 
                  window.location = '/register/thankyou?confirm=' + json.id + '&amount=' + json.amount;
              }
              else {
                $button.removeAttr('disabled');
                
                $(json.broke).each(function(ix) {
                  var field;
                  field = json.broke[ix];
                  var $field = $form.find('#' + field.field);
                  if ($field) {
                    var $group = $field.closest('.control-group');
                    $group.addClass('error')
                    $group.find('.controls').append('<div class="help-block error temp">' + field.message + '</div>')
                  }
                  console.log(json.broke[ix]);
                });
              }
            },
            dataType: 'json'
          });
        }
      });
  }); //end ready
}).call(this);