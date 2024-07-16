var host = window.location.origin + '/';
var data_page;
var transaction_enc;
var transaction_code;
var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

$(document).ready(function() {
    dt = $("#data-page").data();
    token = dt.token;
    transaction_code = dt.transaction_code;
    if (token == "sudah_ada") {

    } else {
        console.log(token);
        snap_pay(token);
    }
});

function snap_pay(data) {
    var resultType = document.getElementById('result-type');
    var resultData = document.getElementById('result-data');

    function changeResult(type, data) {
        $("#result-type").val(type);
        $("#result-data").val(JSON.stringify(data));
        //resultType.innerHTML = type;
        //resultData.innerHTML = JSON.stringify(data);
    }
    snap.pay(data, {

        onSuccess: function(result) {
            changeResult('success', result);
            console.log(result.status_message);
            console.log(result);
            console.log('asd');
            window.location.reload();
            // $("#payment-form").submit();
        },
        onPending: function(result) {
            changeResult('pending', result);
            console.log(result.status_message);
            console.log(result);
            console.log('asd');
            window.location.reload();
            // $("#payment-form").submit();
        },
        onError: function(result) {
            changeResult('error', result);
            console.log(result.status_message);
            console.log(result);
            console.log('asd');
            window.location.reload();
            // $("#payment-form").submit();
        }
    });
}
$("#cekstatuspayment").click(function() {
    cek_status_payment();
});

function cek_status_payment() {
    url = host + "vsnap/status/" + transaction_code;
    $.ajax({
        url: url,
        type: "POST",
        dataType: "JSON",
        success: function(data) {
            if (data.status) {
                parameter = "?pc=" + data.payment_code;
                url_payment = host + "checkout/payment-finish";
                window.location.href = url_payment + parameter;
            } else {
                swal('', data.message, 'warning');
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("error cek status payment")
        }
    });
}

var card = function() {
    return {
        'card_number': $(".card-number").val(),
        'card_exp_month': $(".card-expiry-month").val(),
        'card_exp_year': $(".card-expiry-year").val(),
        'card_cvv': $(".card-cvv").val(),
        'secure': true,
        'bank': 'bni',
        'gross_amount': 10000
    }
};

function callback(response) {
    if (response.redirect_url) {
        // 3dsecure transaction, please open this popup
        openDialog(response.redirect_url);

    } else if (response.status_code == '200') {
        // success 3d secure or success normal
        console.log("success");
        closeDialog();
        // submit form
        $(".submit-button").attr("disabled", "disabled");
        $("#token_id").val(response.token_id);
        console.log(response.token_id);
        save_payment_2();
        // $("#payment-form").submit();
    } else {
        // failed request token
        console.log('Close Dialog - failed');
        console.log(response.status_message);
        //closeDialog();
        //$('#purchase').removeAttr('disabled');
        // $('#message').show(FADE_DELAY);
        // $('#message').text(response.status_message);
        //alert(response.status_message);
    }
}

function openDialog(url) {
    $.fancybox.open({
        href: url,
        type: 'iframe',
        autoSize: false,
        width: 700,
        height: 500,
        closeBtn: false,
        modal: true
    });
}

function closeDialog() {
    $.fancybox.close();
}
// $(document).keydown(function(e){
//     if(event.keyCode == 123) {
//      return false;
//   }
//   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
//      return false;
//   }
//   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
//      return false;
//   }
//   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
//      return false;
//   }
// });
// $(function() {
//     $(this).bind("contextmenu", function(e) {
//         e.preventDefault();
//     });
// }); 