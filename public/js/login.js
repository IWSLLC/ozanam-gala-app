$(function(){
  $("#login-form").validate(
    {
      rules : {
        username : {
          required : true
        }
        ,password : {
          required : true
        }
      }
      ,messages : {
        username : {
          required : "Username required."
        }
        ,password : {
          required : "Password required."
        }
      }
    }
  )
})
