var host        = window.location.origin +"/";
var url_string  = window.location.href;
var category;

$(document).ready(function() {
    data = $(".page-data").data();
    category = data.category;
    console.log(data);
$("#form-login").submit(function( event ){
    event.preventDefault();
    
    $('div').removeClass('has-error'); // clear error class
    $('.help-block').empty(); // clear error string

    $("#btn-login").button('loading');
    $("#pesan-error").hide();
    $("#pesan-error").removeClass("alert-danger");
    $("#pesan-error").removeClass("alert-info");
    $('.form-group').removeClass('has-error'); // clear error class
    $('.help-block').empty();
    if(category == "login"){  
      url      = url_string + "api/login";
      textpage = "Login";
    } else if(category == "register"){  
      url      = host + 'rumahsakit/api/register' ;
      textpage = "Login";
    } else if(category == "forgot_password"){  
      url      = url_string + "api/forgot_password";
      textpage = "Login";
    } else if(category == "reset_password"){  
      url      = url_string + "api/reset_password";
      textpage = "Login";
    } else {
      textpage = "";
    }
        console.log(url);

    console.log($('#form-login').serialize());
    $.ajax({
      url : url,
      type: "POST",
      data: $('#form-login').serialize(),
      dataType: "JSON",
      success: function(data)
      {
          console.log(data);
          if(data.status) //if success close modal and reload ajax table
          {
          $('#form-login')[0].reset(); // reset form on modals

            swal(data.message,'','');
            $("#pesan-error").show();
            $("#text-pesan-error").html(data.pesan);
            if(data.success){
            $("#pesan-error").addClass("alert-info");
              window.location.href = data.redirect;
            } else {
              $("#pesan-error").addClass("alert-danger");  
            }
            $("#pesan-error").show();
            $("#text-pesan-error").html(data.pesan);
          }
          else
          {
              if(data.popup){
                swal('',data.message,'warning');
              }
              if(data.inputerror){
                for (var i = 0; i < data.inputerror.length; i++)
                {
                    $('[name="'+data.inputerror[i]+'"]').parent().parent().addClass('has-error');
                    $('[name="'+data.inputerror[i]+'"]').parent().next().text(data.error_string[i]); //select span help-block class set text error string
                }
              }
          }
          $("#btn-login").button("reset");
      },
      error: function (jqXHR, textStatus, errorThrown)
      {
        $("#pesan-error").show();
        $("#text-pesan-error").text(textpage+" Failed"); 
        $("#btn-login").button("reset");
        console.log(jqXHR.responseText);
        console.log(textStatus);
        console.log(errorThrown);

      }
    });
  });
});