var host = window.location.origin + '/';
var data_page;
var transaction_enc;
var transaction_code;
var Method;
var CompanyID;
var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var base_url;

$(document).ready(function() {
    dt = $("#data-page").data();
    transaction_code = dt.transaction_code;
    Method = dt.method;
    CompanyID = dt.companyid;
    base_url = dt.base_url;
    payment_data();
    $("#show_detail_pay").click(function() {
        cp = $(".payment-detail");
        if ($(cp).hasClass("open")) {
            $(cp).hide(300).removeClass("open");
        } else {
            $(cp).show(300).addClass("open");
        }
    });
    $("#salin").click(function() {
        var txt = $(".va_number").text();
        copyTextToClipboard(txt);
    });
});

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Copying text command was ' + msg);
    } catch (err) {
        // console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}
function check_data(){
    url = base_url + "vsnap/payment_data/" + transaction_code + "/"+CompanyID+"/finish"+"/"+Method;
    swal('', url, 'warning');
}
function payment_data() {
    url = base_url + "vsnap/payment_data/" + transaction_code + "/"+CompanyID+"/finish"+"/"+Method;
    $.ajax({
        url: url,
        type: "GET",
        dataType: "JSON",
        success: function(data) {
            console.log(data);

            transaction_code = data.transaction_code;
            if (data.status == "success") {
                // instruksi_page = host + "utama/instruksi_pembayaran/" + data.bank;
                // console.log(instruksi_page);
                // $(".instruksi").load(instruksi_page);
                expiry_text = data.expiry_text;
                status_code = data.status_code;
                $(".title-page").text(data.title_page);
                $(".title_pay").text(data.title_pay);
                $(".expiry_text").html(expiry_text);
                img_bank = data.bank;
                if (img_bank == null) {
                    img_bank = data.payment_type;
                }
                img_bank = "/aset/img/bank/" + img_bank + ".png";
                if (data.va_number) {
                    $(".va_number_v").show();
                }
                if (status_code == 201) {
                    $(".box-payment").show();
                }
                if (data.biller_code) {
                    $(".bank_img_v").removeClass("col-sm-offset-2").addClass("col-sm-offset-1");
                    $(".biller_code_v").show();
                    $(".biller_code").text(data.biller_code);
                }
                if (data.payment_type == "xl_tunai") {
                    $(".bank_img_v").removeClass("col-sm-offset-2");
                    $(".bank_img_v").removeClass("col-sm-4");
                    $(".va_number_v, .biller_code_v").remove();
                } else if (
                    data.payment_type == "bca_klikpay" ||
                    data.payment_type == "bca_klikbca" ||
                    data.payment_type == "bri_epay" ||
                    data.payment_type == "cimb_clicks" ||
                    data.payment_type == "credit_card" ||
                    data.payment_type == "gci" ||
                    data.payment_type == "mandiri_ecash" ||
                    data.payment_type == "mandiri_clickpay" ||
                    data.payment_type == "telkomsel_cash" ||
                    data.payment_type == "indosat_dompetku"
                ) {

                    if (data.payment_type == "gci" || data.payment_type == "mandiri_ecash") {
                        // $(".bank_img").css("height","100px");
                    }
                    $(".va_number_v, .biller_code_v").remove();
                    $(".bank_img_v").removeClass("col-sm-offset-2");
                    $(".bank_img_v").removeClass("col-sm-4");
                    $(".bank_img_v").addClass("col-sm-12");
                } else {
                    $(".title-instruksi").show();
                }
                $(".transaction_expiry").text(data.transaction_expiry);
                $(".va_number").text(data.va_number);
                $(".bank_img").attr("src", img_bank);
                $(".payment_amount_fix").text(data.payment_amount_fix);

                //ini detail
                if (data.cutting_amount) {
                    $(".cutting-reward").show();
                    $("#cutting-reward").text("- " + data.cutting_amount);

                }
                if (data.adult > 0) {
                    $(".li-adult").show();
                    $("#book-person-qty").text("x" + data.adult);
                    $("#book-person-price").text(data.adult_fix_price);
                }
                if (data.child > 0) {
                    $(".li-child").show();
                    $("#book-child-qty").text("x" + data.child);
                    $("#book-child-price").text(data.child_fix_price);
                }
                if (data.senior > 0) {
                    $(".li-senior").show();
                    $("#book-senior-qty").text("x" + data.senior);
                    $("#book-senior-price").text(data.senior_fix_price);
                }
                $("#attraction-name-txt").text(data.attraction_name);
                $("#package-name-txt").text(data.package_name);
                $("#tc-date-txt").text(data.transaction_date);
                $("#total-amount").text(data.total_amount);
                $("#payment-amount").text(data.total_amount);
                $("#payment-amount-fix").text(data.payment_amount_fix);
                $('#payment-amount').text(data.payment_amount_fix);

            } else {
                swal('', data.message, 'warning');
                // window.location.href = host;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            swal('', 'Failed get transaction data please try again', 'warning');
        }
    });
    // console.clear();
}