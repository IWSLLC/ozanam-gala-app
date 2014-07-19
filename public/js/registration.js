(function() {
  $(function() {
    $('#registrationForm').validate(
      {
        submitHandler : function(form) {
          var $form = $(form);
          var $button = $form.find('button[type="submit"]');
          $button.attr('disabled','disabled');
          $('#error').hide().text('');
          $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize(),
            error: function(req,textStatus,err) {
              $button.removeAttr('disabled');
              if (req.responseJSON && req.responseJSON.message) {
                var $err;
                $err = $('#error');
                $err.text(req.responseJSON.message).show();
              }
            },
            success: function(json) {
              if (json.success)
              {
                window.location = '/register/confirm?confirm=' + json.id;
              }
              else {
                $button.removeAttr('disabled');
                if (json.message)
                  $('#error').text(json.message).show();

                $(json.broke).each(function(ix) {
                  var field;
                  field = json.broke[ix];
                  var $field = $form.find('#' + field.field);
                  if ($field) {
                    var $group = $field.closest('.form-group');
                    $group.addClass('has-error')
                    $group.append('<div class="help-block has-error temp">' + field.message + '</div>')
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
