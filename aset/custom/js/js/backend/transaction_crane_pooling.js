var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "transaction_crane_pooling/list_data/";
var url_edit = host + "transaction_crane_pooling/edit/";
var url_hapus = host + "transaction_crane_pooling/delete/";
var url_hapus_android = host + "transaction_crane_pooling/delete_android/";
var url_save_map = host + "transaction_crane_pooling/saveMap/";
var url_simpan = host + "transaction_crane_pooling/save/";
var url_approve = host + "transaction_crane_pooling/approve_data/";

var addressno = 0;
var contactno = 0;
var modul = "";
var app = "";
var radius_val = 0;
var page_name;
var menuid;
var ConnectToSAP;
var CountAddress;
var MarkerClick = true;
var NextID = "0";
var PrevID = "0";
var method_before;
var CurrentDate;
var LastID;
var count_dd = 0;
var ValueTax;
$(document).ready(function () {
    load_datatables();
    // $('#table tbody').on('click', 'tr', function () {
    //     $("#table tbody, .table tr").removeClass("active");
    //     row = table.row(this);
    //     data = table.row( this ).data();
    //     element = this.childNodes[1].childNodes[0];
    //     if(element.classList.contains("active")){
    //         element.classList.remove("active");
    //         $(this).removeClass("active");
    //     } else {
    //         $(".table div").removeClass("active");
    //         $(this).addClass("active");
    //         element.classList.add("active");
    //     }
    // });
    document.getElementById("add-attachment").addEventListener("change", readFile);

});
function load_datatables() {
    data_page = $(".data-page, .page-data").data();
    modul = data_page.modul;
    app = data_page.app;
    page_name = data_page.page_name;
    menuid = data_page.menuid;
    ConnectToSAP = data_page.connecttosap;
    CurrentDate = data_page.currentdate;
    id = data_page.id;
    filter = data_page.filter;

    StartDate = $("#form-filter [name=StartDate]").val();
    EndDate = $("#form-filter [name=EndDate]").val();
    VendorID = $('#form-filter [name=VendorID]').find(':selected').val();
    PaymentTypeID = $('#form-filter [name=PaymentTypeID]').find(':selected').val();
    ApproveStatus = $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post = {
        Filter: filter,
        InvoiceID: id,
        MenuID: menuid,
        StartDate: StartDate,
        EndDate: EndDate,
        VendorID: VendorID,
        PaymentTypeID: PaymentTypeID,
        ApproveStatus: ApproveStatus,
    }
    // console.log(data_post);
    table = $('#table').DataTable({
        destroy: true,
        pageLength: 25,
        processing: true,
        serverSide: true,
        searching: true,
        order: [],
        ajax: {
            url: url_list,
            type: "POST",
            data: data_post,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        },
        columnDefs: [{
            targets: [0], //last column
            orderable: false, //set not orderable
        },],
    });
    if (id && id > 0) {
        edit('<span data-id="' + id + '" data-method="view"></span>');
    }
    getValueTax();
}
function tambah(modul) {
    $("#btn-sendEmail").hide()
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    // add_data_detail('add_new','<span data-method="new_data"></span>');
    $(".div-bayar, .v_paket, .detail_tarif, .div-vehicle-condition").hide(300);
    $(".div-piutang").hide(300);
    $(".div-bank").hide(300);
    div_form("open");
    onselect_payment_type($("[name=PaymentTypeID]"), 'save_method');
    $("#form [name=TransactionCranePoolingID], #form [name=TransactionValidationOrderID], #form [name=VendorID], #form [name=OperatorID], #form [name=RiggerID], #form [name=SupirID], #form [name=LainlainID]").val("");
    $("#form [name=Date], #form [name=PostDate]").val(CurrentDate);
    $("#form [name=Date], #form [name=PostDate]").datepicker("setDate", CurrentDate);
    $("#form .select2").val('none').trigger('change');
    $(".tab-pane-3, .nav-li-3").hide();
    $(".remark_vechicle").hide();
    $("[name=PPN], [name=PPH], [name=BBM]").val(1);
    $("#form [name=EditOrder]").val(1);
    $(".v_route").hide();
    approval_status_msg({ method: "close" });
}
function edit(element, koreksi = false) {
    $("#btn-sendEmail").text("Kirim Email Invoice")
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    methodX = method;

    LastID = id;
    if (method == "view" || method == "view_next" || method == "view_prev") {
        save_method = 'view';
        method_before = 'view';
        $(".form-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total").text("");

    $(".tab-pane-3, .nav-li-3").show();
    $(".v_route").show();

    $.ajax({
        url: url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            console.log(json);
            if (json.HakAkses == "rc") {
                console.log(json);
            }
            if (json.Status) {
                div_form(method);
                $("#form .input-group-addon").addClass("disabled");
                $("#form .input-group-addon").addClass("text");
                // $("#form .select2").val('none').trigger('change');
                a = json.Data;
                payA = a.PaymentTypeID;
                console.log(a);
                console.log('a');
                approval_status_msg({ method: "open", data: a });
                NextID = a.NextID;
                PrevID = a.PrevID;
                validation_order_click(a.TransactionReceiveOrderID);
                $("#form [name=TransactionCranePoolingID]").val(a.TransactionCranePoolingID);
                $("#form [name=TransactionValidationOrderID]").val(a.TransactionValidationOrderID);
                $("#form [name=TransactionReceiveOrderID]").val(a.TransactionReceiveOrderID);
                $("#form [name=ProductID]").val(a.ProductID);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=ValidationCode]").val(a.ValidationCode);
                $("#form [name=ReceiveCode]").val(a.ReceiveCode);
                $("#form [name=Review]").val(a.Review);
                $("div.rating").empty();
                arrRating = [...Array(5).keys()];
                if (arrRating.length > 0) {
                    dtRating = '';
                    $.each(arrRating, function (i, v) {
                        if (i < Math.round(a.Rating)) {
                            dtRating += '<i class="fa fa-star" style="color: gold"></i>';
                        } else {
                            dtRating += '<i class="fa fa-star"></i>';
                        }
                    })
                    $("div.rating").append(dtRating);
                }

                // if (method_before == "view"){
                if (payA == 42 || payA == 47) {
                    $("#btn-sendEmail").hide()
                } else {
                    $("#btn-sendEmail").show()
                    if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                        $("#btn-sendEmail").text("Kirim Email Invoice")
                        $("#btn-sendEmail").attr("disabled", false)
                        $("#btn-sendEmail").removeClass("disabled");
                        // yang dibawah buat kirim spk, kalo dibuka berarti attachment spk ikut terkirim, buka aja semua yg dikomen dibawah kalo mau kirim spk, yang di atas ditutup
                        // saveAttachment('spk')
                        // $("#btn-sendEmail").text("Loading...")
                        // $("#btn-sendEmail").attr("disabled", true)
                        // $("#btn-sendEmail").addClass("disabled");
                    } else {
                        $("#btn-sendEmail").text("Kirim Email Invoice")
                        $("#btn-sendEmail").attr("disabled", true)
                        $("#btn-sendEmail").addClass("disabled");
                    }
                }
                // }else{
                //     $("#btn-sendEmail").hide()
                // }
                if (a.sTime && a.eTime) {
                    $(".v_route").show();
                } else {
                    $(".v_route").hide();
                }
                $("#form [name=Date]").val(a.Date);
                $("#form [name=TransactionDate]").val(a.Date);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=CraneID]").val(a.CraneID);
                $("#form [name=VehicleID]").val(a.VehicleID);
                $("#form [name=OperatorID]").val(a.OperatorID);
                $("#form [name=RiggerID]").val(a.RiggerID);
                $("#form [name=SupirID]").val(a.SupirID);
                $("#form [name=LainlainID]").val(a.LainlainID);
                $("#form [name=VendorName]").val(a.VendorName);
                $("#form [name=CraneName]").val(a.CraneName);
                $("#form [name=VehicleName]").val(a.VehicleName);
                $("#form [name=OperatorName]").val(a.OperatorName);
                $("#form [name=RiggerName]").val(a.RiggerName);
                $("#form [name=SupirName]").val(a.SupirName);
                $("#form [name=LainlainName]").val(a.LainlainName);
                $("#form [name=MarketingName]").val(a.MarketingName);
                $("#form [name=AgentName]").val(a.AgentName);
                $("#form [name=BillingID]").val(a.BillingID).trigger('change');
                $("#form [name=BillingName]").val(a.BillingName);
                $("#form [name=BillingAddress]").val(a.BillingAddress);
                $("#form [name=BillingCity]").val(a.BillingCity);
                $("#form [name=BillingNPWP]").val(a.BillingNPWP);
                $("#form [name=WorkHourStart]").val(a.WorkHourStart);
                $("#form [name=WorkHourEnd]").val(a.WorkHourEnd);
                $("#form [name=OdometerStart]").val(a.OdometerStart);
                $("#form [name=OdometerEnd]").val(a.OdometerEnd);
                $("#form [name=TotalKM]").val(a.TotalKM);
                $("#form [name=BBMPayment]").val(a.BBMPayment);
                $("#form [name=BBMPrice]").val(a.BBMPrice);
                $("#form [name=BBMLiter]").val(a.BBMLiter);
                $("#form [name=BBMLiterStandard]").val(a.BBMLiterStandard);
                $("#form [name=BBMLiterUsed]").val(a.BBMLiterUsed);
                $("#form [name=ETollStart]").val(a.ETollStart);
                $("#form [name=ETollEnd]").val(a.ETollEnd);
                $("#form [name=Terms]").val(a.Terms);
                $("#form [name=PostDate]").val(a.PostDate);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=PaymentTypeID]").val(a.PaymentTypeID);
                $("#form [name=BankID]").val(a.BankID);
                $("#form [name=COAPaymentTypeID]").val(a.COAPaymentTypeID);
                $("#form [name=BankName]").val(a.BankName);
                $("#form [name=AccountNo]").val(a.AccountNo);
                $("#form [name=TotalPaymentAR]").val(a.TotalPaymentAR);
                $("#form [name=TotalPaymentAP]").val(a.TotalPaymentAP);
                $("#form [name=TotalPaymentAR1]").val(a.TotalPaymentAR);
                $("#form [name=TotalPaymentAP1]").val(a.TotalPaymentAP);
                $("#form [name=DiscountAR]").val(a.DiscountAR);
                $("#form [name=DiscountAP]").val(a.DiscountAP);
                $("#form [name=Price]").val(a.Price);
                $("#form [name=Pricexx]").val(a.TotalPriceBBM);
                $("#form [name=Pricex]").val(a.TotalPayment);
                $("#form [name=TotalPaymentFinal]").val(a.TotalNonePPN);
                $("#form [name=TotalPaymentFinalPPN]").val(a.TotalPrice);
                $("#form [name=OdoBefore]").val(a.OdometerBefore);
                $("#form [name=Email]").val(a.Email);

                $("#HistoryRoute").attr(`target`, `_blank`)
                $("#HistoryRoute").attr(`href`, `${host}history-route/${a.ReceiveCode}`)
                $("#HistoryRoute").html(`Route History`)
                if (a.PPN == 1) {
                    $("#form [name=PPN]").prop("checked", true);
                }
                if (a.PPH == 1) {
                    $("#form [name=PPH]").prop("checked", true);
                }
                if (a.BBM == 1) {
                    $("#form [name=BBM]").prop("checked", true);
                }
                if (a.KPO == 1) {
                    $("#form [name=KPO]").prop("checked", true);
                }

                // $("#form [name=BillingID]").val(a.BillingID);
                $("#form [name=BillingName]").val(a.BillingName);
                $("#form [name=BillingAddress]").val(a.BillingAddress);
                $("#form [name=BillingCity]").val(a.BillingCity);
                $("#form [name=BillingNPWP]").val(a.BillingNPWP);

                $(".total-trip-money").text(a.TripMoney);
                $(".table-data-detail tfoot .item-total").text(a.TotalPriceTxt);
                $(".table-data-detail tfoot .item-total").text(a.TotalPriceTxt);
                $(".table-data-detail tfoot .item-total2").text(a.TotalPriceDetail2);
                $(".table-data-detail tfoot .item-total2-cash").text(a.TotalPriceDetail2Cash);
                $(".table-data-detail tfoot .item-total2-deposite").text(a.TotalPriceDetail2Deposite);
                $(".table-data-detail tfoot .item-total2-sisa").text(a.TotalPriceDetail2Sisa);
                $(".table-data-detail tfoot .item-total3").text(a.TotalCommission);

                // $("#btn-sendEmail").show()
                // console.log("Real: ")
                // console.log(($("[name=PaymentTypeID] option[value='" + a.PaymentTypeID + "']").data('name') != "TRANSFER"))

                onselect_payment_type($("[name=PaymentTypeID]"), method);
                if (method_before == "view") {
                    $(".main-input").next().hide();
                    $(".v_vehicle .sub-input").attr("type", "text");
                } else {
                    $(".main-input").next().hide();
                    $(".sub-input").attr("type", "hidden");
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled", true);
                    $("#form [name=TransactionCranePoolingID],#form [name=Remark], #add-attachment").attr("disabled", false);
                    $("#form [name=TransactionCranePoolingID],#form [name=Remark]").removeClass("text");
                    $("#form tfoot .action").show();


                }
                if (json.Data.ListData) {
                    if (json.Data.ListData.length > 0) {
                        $.each(json.Data.ListData, function (i, v) {
                            add_data_detail(method_before, v);
                        })
                    } else {
                        add_data_detail('empty');
                    }
                } else {
                    add_data_detail('empty');
                }
                if (json.Data.ListData2) {
                    if (json.Data.ListData2.length > 0) {
                        $.each(json.Data.ListData2, function (i, v) {
                            add_data_detail2(method_before, v);
                        })
                    } else {
                        add_data_detail2('empty');
                    }
                } else {
                    add_data_detail2('empty');
                }

                if (json.Data.ListData3) {
                    if (json.Data.ListData3.length > 0) {
                        $.each(json.Data.ListData3, function (i, v) {
                            add_data_detail3(method_before, v);
                        })
                    } else {
                        add_data_detail3('empty');
                    }
                } else {
                    add_data_detail3('empty');
                }
                // console.log(json.Data.ListAttachment);
                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        add_attachment('update', v);
                    });
                }
                if (method_before == "view") {

                } else {
                    $("#table-detail-2 tbody .empty").remove();
                }
                CheckBtnNextPrev();
                // console.log(json.Data.CountInvoice);
                if (method_before != "view") {
                    if (json.Data.CountInvoice > 0) {
                        $(".panel-kendaraan input,.panel-kendaraan textarea,.panel-kendaraan select").attr("disabled", true);
                        $(".panel-kendaraan input,.panel-kendaraan textarea,.panel-kendaraan select, .panel-kendaraan .input-group-addon").addClass("text");
                        $(".panel-tagihan input,.panel-tagihan textarea,.panel-tagihan select").attr("disabled", true);
                        $(".panel-tagihan input,.panel-tagihan textarea,.panel-tagihan select, .panel-tagihan .input-group-addon").addClass("text");
                        $(".panel-bayar input,.panel-bayar textarea,.panel-bayar select").attr("disabled", true);
                        $(".panel-bayar input,.panel-bayar textarea,.panel-bayar select, .panel-bayar .input-group-addon").addClass("text");
                        $(".v_vehicle .main-input").next().hide();
                        $(".v_vehicle .sub-input").attr("type", "text");
                        $("#form [name=EditOrder]").val(0);
                        $(".remark_vechicle").show();
                    } else {
                        $(".panel-kendaraan input,.panel-kendaraan textarea,.panel-kendaraan select").attr("disabled", false);
                        $(".panel-kendaraan input,.panel-kendaraan textarea,.panel-kendaraan select, .panel-form .input-group-addon").removeClass("text");
                        $(".panel-tagihan input,.panel-tagihan textarea,.panel-tagihan select").attr("disabled", false);
                        $(".panel-tagihan input,.panel-tagihan textarea,.panel-tagihan select, .panel-form .input-group-addon").removeClass("text");
                        $(".panel-bayar input,.panel-bayar textarea,.panel-bayar select").attr("disabled", false);
                        $(".panel-bayar input,.panel-bayar textarea,.panel-bayar select, .panel-bayar .input-group-addon").removeClass("text");
                        $(".v_vehicle .main-input").next().show();
                        $(".v_vehicle .sub-input").attr("type", "hidden");
                        $("#form [name=EditOrder]").val(1);
                        $("#FromCityID, #ToCityID").attr("disabled", true);
                        $(".remark_vechicle").hide();
                    }
                }
                if (koreksi) {
                    $("#FromCityID, #ToCityID").attr("disabled", false);
                }
                if ($("[name=PaymentTypeID] option[value='" + payA + "']").data('name') != "PIUTANG" || methodX == "view" || methodX == "view_next" || methodX == "view_prev") {
                    $("#form [name='BillingID']").attr('disabled', true);
                } else {
                    $("#form [name='BillingID']").attr('disabled', false);
                }
                $("#form [name=TransactionDate]").attr("disabled", false);
                getValueTax(element);
            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}
function reload_table() {
    table.ajax.reload(null, false); //reload datatable ajax
}
var count_save = 0;
function save(element) {
    StatusSupir = $("[name=StatusSupir]").val()
    StatusAndroid = $("[name=StatusAndroid]").val()
    if (StatusSupir == 0 && StatusAndroid == 1) {
        swal({
            title: "Info",
            text: "Transaksi ini belum mendapat konfirmasi telah sampai tujuan dari driver dan tidak akan kirim email ke customer, apakah anda yakin akan menyimpan transaksi ini?",
            // type: "warning",   
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    swal.close();
                    proses_save(element)
                } else {
                    swal("Info", "Transaksi dibatalkan");
                }
            });
    } else {
        proses_save(element)
    }
}

async function proses_save(element) {
    btn_saving(element);
    if (save_method == "view") {
        swal("Info", "Maaf anda tidak bisa melakukan transaksi");
        return;
    }
    if (count_save == 0) {
        count_save = 1;
        $('div, input, span, form, td, tr').removeClass('has-error');
        $(".item-alert").hide();
        $('.help-block').empty();
        dt = $(element).data();
        method = dt.method;
        // console.log(method);
        url = host;
        url = host + 'transaction_crane_pooling/save/' + save_method;

        const route = {
            origin:
            {
                lat: $("#form [name=FromLat]").val(),
                lng: $("#form [name=FromLng]").val()
            },
            destination: {
                lat:
                    $("#form [name=ToLat]").val(),
                lng:
                    $("#form [name=ToLng]").val()
            }
        };
        const formData = new FormData($('#form')[0]); // Serialize form data
        const staticMap = await generateStaticMap(route.origin, route.destination);
        // const NameAttachments = $('[name="NameAttachments[]"]').val();
        // const FileB64 = $('[name="FileB64[]"]').val();
        // const FormatFileB64 = $('[name="FormatFileB64[]"]').val();
        // $(`[name="NameAttachments[]"]`).val(NameAttachments + "staticMap");
        // $(`[name="FileB64[]"]`).val(FileB64 + staticMap);
        // $(`[name="FormatFileB64[]"]`).val(FormatFileB64 + "png");
        formData.append("staticMap", staticMap);

        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            processData: false, // Prevent jQuery from processing the form data
            contentType: false, // Prevent jQuery from setting content type
            dataType: "JSON",
            success: function (json) {
                // console.log(json);
                if (json.Status) {
                    NextID = json.NextID;
                    PrevID = json.PrevID;
                    CheckBtnNextPrev();
                    toastr.success(json.Message, "Information");
                    if (method == "close") {
                        div_form("close");
                    } else if (method == "new") {
                        save_method = "add";
                        // div_form("reset");
                        tambah();
                    } else if (method == "keep") {
                        save_method = "update";
                        $("#form [name=TransactionCranePoolingID]").val(json.TransactionCranePoolingID);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="' + json.TransactionCranePoolingID + '" data-method="edit"></span>');
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                    $(".FileB64Attachment, .FormatFileB64Attachment").remove();
                    if (json.Status) {
                        DATA = {
                            ID: id,
                            TypeID: 'TransactionCranePoolingID',
                            Kondisi: 'derek_pooling',

                        }
                        GenerateJurnal(DATA);
                    }
                } else {
                    $('.form-group').removeClass('has-error');
                    $('.help-block').empty();
                    if (json.inputerror) {
                        console.log(json);
                        for (var i = 0; i < json.inputerror.length; i++) {
                            toastr.error(json.error_string[i], "Information");
                            if (json.type[i] == "alert") {
                                $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                                $('.' + json.inputerror[i] + 'Alert').text(json.error_string[i]);
                            } else if (json.type[i] == "alert_2") {
                                $('[name="' + json.inputerror[i] + '"]').parent().parent().addClass('has-error');
                                $('.' + json.inputerror[i] + 'Alert').text(json.error_string[i]);
                            } else {
                                $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                                $('[name="' + json.inputerror[i] + '"]').next().text(json.error_string[i]);
                            }
                        }
                    }
                    if (json.inputerrordetail) {
                        $.each(json.inputerrordetail, function (i, v) {
                            toastr.error(v, "Information");
                            if (json.inputerrordetailid[i] != "") {
                                $("." + json.inputerrordetailid[i]).addClass("has-error");
                                $("." + json.inputerrordetailid[i] + ' .item-alert').show();
                            }
                        });
                    }
                    if (json.popup) {
                        swal("Info", json.Message);
                    }
                    btn_saving(element, 'reset');
                    count_save = 0;
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                count_save = 0;
                console.log(jqXHR);
                console.log(jqXHR.responseText);
                btn_saving(element, 'reset');
                toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
            }
        });
    }
}
function hapus_data(id, android = false) {
    swal({
        title: "Info",
        text: "Apakah anda yakin akan membatalkan transaksi ini ?",
        // type: "warning",   
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: url_hapus + id + "/nonactive/" + android,
                    type: "POST",
                    dataType: "JSON",
                    success: function (data) {
                        reload_table();
                        swal("Info", "Transaksi berhasil dibatalkan");
                        if (data) {
                            DATA = {
                                ID: id,
                                TypeID: 'TransactionCranePoolingID/JB',
                                Kondisi: 'derek_pooling_cancel',
                            }
                            GenerateJurnal(DATA);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Info", "Terjadi kesalahan gagal melakukan transaksi data");
                        console.log(jqXHR.responseText);
                    }
                });
            } else {
                swal("Info", "Transaksi tidak jadi");
            }
        });
}
function active_data(id) {
    $.ajax({
        url: url_hapus + id + "/active",
        type: "POST",
        dataType: "JSON",
        success: function (data) {
            reload_table();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", language_app.error_transaction);
        }
    });
}
function hitung_komisi(element) {
    dt = $(element).data();
    id = dt.id;
    $.ajax({
        url: host + 'transaction_crane_pooling/calculation_commission/' + id + '/post',
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            if (json.Status) {
                toastr.success(json.Message, "Information");
                reload_table();
            } else {
                toastr.error(json.Message, "Information");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            toastr.error("Terjadi kesalahan gagal mendapatkan data", "Information");
        }
    });
}
function approve_data(element) {
    dt = $(element).data();
    action = dt.action;
    id = dt.id;
    status = dt.status;
    remark = "";
    if (action == "agree") {
        pesan = "Apa anda yakin akan menyetujui data ini ?";
    } else if (action == "decline") {
        pesan = "Apa anda yakin akan menolak data ini ?";
    } else if (action == "send") {
        pesan = "Apa anda yakin akan mengirim ulang data ini ?";
    } else {
        return false;
    }
    if (action == "decline") {
        htmltext = pesan + "<textarea class='form-control' id='RemarkTolak' style='margin-top:20px;' placeholder='tulis alasan anda menolak'></textarea>";
        swal({
            title: "Info",
            text: htmltext,
            html: true,
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonColor: "#DD6B55",
            showLoaderOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: ""
        }, function (inputValue) {
            var remark = $('#RemarkTolak').val();
            if (remark === "") {
                swal.showInputError("Keterangan tidak boleh kosong");
                return false
            } else {
                approve_data_save({ action: action, id: id, status: status, remark: remark });
                swal.close();
            }
        });
    } else {
        swal({
            title: "Info",
            text: pesan,
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    approve_data_save({ action: action, id: id, status: status, remark: remark });
                }
            });
    }
}
function approve_data_save(element) {
    if (element && element.action) {
        dt = element;
        action = dt.action;
        id = dt.id;
        status = dt.status;
        remark = dt.remark;
    } else {
        dt = $(element).data();
        action = dt.action;
        id = dt.id;
        status = dt.status;
        remark = dt.remark;
    }
    data_post = {
        TransactionCranePoolingID: id,
        ApproveStatus: status,
        ApproveRemark: remark
    }
    $.ajax({
        url: host + 'transaction_crane_pooling/approve_data/',
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            if (json.Status) {
                toastr.success(json.Message, "Information");
                reload_table();
                if (action == "agree") {
                    DATA = {
                        ID: id,
                        TypeID: 'TransactionCranePoolingID',
                        Kondisi: 'crane_pooling',

                    }
                    GenerateJurnal(DATA);
                }
            } else {
                toastr.error(json.Message, "Information");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error("Terjadi kesalahan gagal mengirim data", "Information");
            console.log(jqXHR.responseText);
        }
    });
}

function add_data_detail(method, element) {
    count_dd = 1 + count_dd;
    rowid = "item-detail-" + count_dd;
    td_width = "120px";
    i_search = "";
    i_remove = "";
    i_alert = "";
    disabled = "";
    TransactionDetailID = "";
    ID = "";
    Name = "";
    Unit = "";
    Qty = "";
    Price = "";
    MealPrice = "";
    SubTotal = "";
    addclass = "";
    if (element && element.ID) {
        a = element;
        if (method == "view") {
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        ID = a.ID;
        Name = a.Name;
        Unit = a.Unit;
        Price = a.Price;
    } else {
        dt = $(element).data();
    }
    if (method == "add_new") {
        i_alert = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="' + rowid + '"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
    }

    if (method == "empty") {
        item = '<tr class="empty"><td colspan="3">Data tidak ada</td></tr>';
    } else if (method == "view" || method == "update" || method == "edit") {
        item = '<tr class="item ' + rowid + '">';
        item += '<td></td>';
        item += '<td>' + Name + '</td>';
        item += '<td class="text-right">' + Price + '</td>';
        item += '</tr>';
    } else {
        input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
        input_h += '<input type="hidden" name="TransactionDetailID[]" value="' + TransactionDetailID + '">';
        input_h += '<input type="hidden" name="DetailID[]" class="item-id" value="' + ID + '">';
        input_h += '<input type="hidden" name="DetailName[]" class="item-name" value="' + Name + '">';
        input_h += '<input type="hidden" name="DetailPrice[]" class="item-price" value="' + Price + '">';
        item = '<tr class="item ' + rowid + '">';
        item += '<td>' + i_alert + '<div class="btn-group btn-xs">' + i_search + i_remove + '</div>' + input_h + '</td>';
        item += '<td class="item-name-txt">' + Name + '</td>';
        item += '<td class="item-price-txt text-right">' + Price + '</td>';
        item += '</tr>';
        // <input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
    }
    $("#table-detail-1 tbody").append(item);
}
function add_data_detail2(method, element) {
    count_dd = 1 + count_dd;
    rowid = "item-detail2-" + count_dd;
    td_width = "";
    i_search = "";
    i_remove = "";
    i_alert = "";
    disabled = "";
    TransactionDetailID = "";
    ID = "";
    Code = "";
    Name = "";
    Remark = "";
    Price = "";
    Deposite = "";
    BonNo = "";
    addclass = "";
    SPBU = "";

    div_upper = 'onkeyup="this.value = this.value.toUpperCase();"';
    if (element && element.ID) {
        a = element;
        if (method == "view") {
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        ID = a.ID;
        Code = a.Code;
        Name = a.Name;
        Remark = a.Remark;
        Unit = a.Unit;
        Qty = a.Quantity;
        Price = a.Price;
        Deposite = a.Deposite;
        BonNo = a.BonNo;
        SPBU = a.SPBU;

        if (Deposite == 1) {
            DepositeIcon = '<i class="fa fa-check"></i>';
        } else {
            DepositeIcon = '<i class="fa fa-close"></i>';
        }

    } else {
        dt = $(element).data();
    }
    if (method == "add_new" || method == "edit") {
        i_alert = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_coa(this)" data-rowid="' + rowid + '"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
    }
    if (method == "edit") {
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '" data-typeid="TransactionCranePoolingTripMoneyID" data-id="' + TransactionDetailID + '"><i class="fa fa-trash"></i></a> ';
    }
    if (method == "empty") {
        item = '<tr class="empty"><td colspan="8">Data tidak ada</td></tr>';
    } else if (method == "view") {
        item = '<tr class="item ' + rowid + '">';
        item += '<td></td>';
        item += '<td>' + Code + '</td>';
        item += '<td>' + Name + '</td>';
        item += '<td>' + Remark + '</td>';
        item += '<td class="text-right">' + Price + '</td>';
        item += '<td class="text-center">' + DepositeIcon + '</td>';
        item += '<td>' + BonNo + '</td>';
        item += '<td>' + SPBU + '</td>';
        item += '</tr>';
    } else {
        CheckedDeposite = '';
        if (Deposite == 1) {
            CheckedDeposite = 'checked="checked"';
        }

        input_h = '<input type="hidden" name="Detail2Count[]" class="item-count" value="' + rowid + '">';
        input_h += '<input type="hidden" name="TransactionDetail2ID[]" value="' + TransactionDetailID + '">';
        input_h += '<input type="hidden" name="Detail2ID[]" class="item-id" value="' + ID + '">';
        input_h += '<input type="hidden" name="Detail2Code[]" class="item-code" value="' + Code + '">';
        input_h += '<input type="hidden" name="Detail2Name[]" class="item-name" value="' + Name + '">';

        item = '<tr class="item ' + rowid + '">';
        item += '<td>' + i_alert + '<div class="btn-group btn-xs">' + i_search + i_remove + '</div>' + input_h + '</td>';
        item += '<td class="item-code-txt">' + Code + '</td>';
        item += '<td class="item-name-txt">' + Name + '</td>';
        item += '<td><input name="Detail2Remark[]" class="item-remark" type="text" maxlength="100" data-rowid="' + rowid + '" style="width:' + td_width + ';" value="' + Remark + '" ' + div_upper + '></td>';
        item += '<td class="text-right"><input name="Detail2Price[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit" style="width:' + td_width + ';" value="' + Price + '"></td>';
        item += '<td>\
                <div class="checkbox checkbox-primary" style="margin:0px;text-align:center;">\
                  <input name="Detail2Deposite-'+ rowid + '" class="item-deposite" type="checkbox" onclick="calculation_total_price()" data-rowid="' + rowid + '" id="' + rowid + '" value="1" ' + CheckedDeposite + '>\
                  <label for="'+ rowid + '"></label>\
                </div>\
                </td>';
        item += '<td><input name="Detail2BonNo[]" class="item-bonno" type="text" maxlength="25" data-rowid="' + rowid + '" style="width:' + td_width + ';" value="' + BonNo + '" ' + div_upper + '></td>';
        item += '<td><input name="Detail2SPBU[]" class="item-spbu" type="text" maxlength="25" data-rowid="' + rowid + '" style="width:' + td_width + ';" value="' + SPBU + '" ' + div_upper + '></td>';
        item += '</tr>';
        // <input name="DetailPrice[]" class="item-price" type="text" maxlength="10" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
    }
    $("#table-detail-2 tbody").append(item);
}
function add_data_detail3(method, element) {
    if (method == "empty") {
        item = '<tr class="empty"><td colspan="7">Data tidak ada</td></tr>';
    } else {
        a = element;

        EmployeeName = a.EmployeeName;
        EmployeeType = a.EmployeeType;
        TotalPrice = a.TotalPrice;
        PercentageStart = a.PercentageStart;
        CommissionStart = a.CommissionStart;
        Percentage = a.Percentage;
        Commission = a.Commission;

        item = '<tr>';
        item += '<td>' + EmployeeName + '</td>';
        item += '<td>' + EmployeeType + '</td>';
        item += '<td class="text-right">' + TotalPrice + '</td>';
        item += '<td class="text-right">' + PercentageStart + '</td>';
        item += '<td class="text-right">' + CommissionStart + '</td>';
        item += '<td class="text-right">' + Percentage + '</td>';
        item += '<td class="text-right">' + Commission + '</td>';
        item += '</tr>';
    }

    $("#table-detail-3 tbody").append(item);
}

function remove_data_detail(element) {
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    if (dt.id) {
        id = dt.id;
        typeid = dt.typeid;
        if (typeid == "TransactionCranePoolingTripMoneyID") {
            url = host + 'transaction_crane_pooling/delete_detail/' + typeid + '/' + id;
        } else {
            url = host;
        }
        swal({
            title: "Info",
            text: "Apakah anda yakin akan menghapus data ini ?",
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: data_post,
                        dataType: "JSON",
                        success: function (json) {
                            if (json.Status) {
                                toastr.success(json.Message, "Information");
                                $("." + dt.rowid).remove();
                                calculation_total_price();
                            } else {
                                toastr.error(json.Message, "Information");
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            toastr.error("Terjadi kesalahan gagal mengirim data", "Information");
                            console.log(jqXHR.responseText);
                        }
                    });
                }
            });
    } else {
        $("." + dt.rowid).remove();
        calculation_total_price();
    }
}
function calculation_total_price() {
    TripMoney = $("#form [name=TripMoney]").val();
    if (TripMoney.length > 0) {
        TripMoney = TripMoney.replace(/\,/g, '');
    } else {
        TripMoney = 0;
    }
    TripMoney = parseInt(TripMoney);
    total = 0;
    total = 0;
    total_deposite = 0;
    total_cash = 0;
    total_sisa = 0;
    list = $("#table-detail-2.table-data-detail tbody tr");
    if (list.length > 0) {
        $.each(list, function (i, v) {
            rowid = v.classList[1];
            class_rowid = "." + rowid;
            id = $(class_rowid + " .item-id").val();
            price = $(class_rowid + " .item-price").val();
            cash = 0;
            deposite = 0;
            if (id == "") { id = 0; }
            if (price == "") { price = 0; }
            if (price.length > 0) {
                price = price.replace(/\,/g, '');
            }
            id = parseInt(id);
            price = parseInt(price);
            sub_total = price;
            if (id > 0) {
                if ($(class_rowid + " .item-deposite").is(":checked")) {
                    deposite = price;
                } else {
                    cash = price;
                }
                total_cash += cash;
                total_deposite += deposite;
                total += price;
            }
        });
        total_sisa = (TripMoney - total_cash);
        $("#table-detail-2.table-data-detail tfoot .item-total2-cash").text(number_format(total_cash));
        $("#table-detail-2.table-data-detail tfoot .item-total2-deposite").text(number_format(total_deposite));
        $("#table-detail-2.table-data-detail tfoot .item-total2-sisa").text(number_format(total_sisa));
        $("#table-detail-2.table-data-detail tfoot .item-total2").text(number_format(total));
    } else {
        $("#table-detail-2.table-data-detail tfoot .item-total2").text(number_format(total));
    }


}
function calculation_last_price(view) {
    console.log(view)
    OdometerFinal = 0;
    BBMLiter = 0;
    BBMLiterUsed = 0;
    Toleransi = 0;
    OdoBefore = $("#form [name=OdoBefore]").val();
    OdometerStart = $("#form [name=OdometerStart]").val();
    OdometerEnd = $("#form [name=OdometerEnd]").val();
    BBMPayment = $("#form [name=BBMPayment]").val();
    BBMPrice = $("#form [name=BBMPrice]").val();
    if (OdoBefore == "") { OdoBefore = 0; }
    if (OdometerStart == "") { OdometerStart = 0; }
    if (OdometerEnd == "") { OdometerEnd = 0; }
    if (BBMPayment == "") { BBMPayment = 0; }
    if (BBMPrice == "") { BBMPrice = 0; }
    if (OdoBefore.length > 0) {
        OdoBefore = OdoBefore.replace(/\,/g, '');
    }
    if (OdometerStart.length > 0) {
        OdometerStart = OdometerStart.replace(/\,/g, '');
    }
    if (OdometerEnd.length > 0) {
        OdometerEnd = OdometerEnd.replace(/\,/g, '');
    }
    if (BBMPayment.length > 0) {
        BBMPayment = BBMPayment.replace(/\,/g, '');
    }
    if (BBMPrice.length > 0) {
        BBMPrice = BBMPrice.replace(/\,/g, '');
    }
    OdoBefore = parseFloat(OdoBefore);
    OdometerStart = parseFloat(OdometerStart);
    OdometerEnd = parseFloat(OdometerEnd);
    BBMPayment = parseFloat(BBMPayment);
    BBMPrice = parseFloat(BBMPrice);

    if (OdoBefore != OdometerStart) {
        $('#form [name="OdoStatus"]').val(1);
    } else {
        $('#form [name="OdoStatus"]').val(0);
    }

    if (OdometerStart > 0 && OdometerEnd > 0) {
        OdometerFinal = OdometerEnd - OdometerStart;
    }
    if (BBMPayment > 0 && BBMPrice > 0) {
        BBMLiter = (BBMPayment / BBMPrice);
        BBMLiter = BBMLiter.toFixed(2);
        // BBMLiter = round_to_precision(BBMLiter, 0.5);
    }
    if (OdometerFinal > 0 && BBMLiter > 0) {
        BBMLiterUsed = (OdometerFinal / BBMLiter);
        BBMLiterUsed = BBMLiterUsed.toFixed(2);
        // BBMLiterUsed = round_to_precision(BBMLiterUsed, 0.5);
    }

    BBMLiterStandard = $("#form [name=BBMLiterStandard]").val();
    BBMLiterStandard = BBMLiterStandard == "" ? 0 : BBMLiterStandard;
    $("#form [name=TotalKM]").val(parseFloat(OdometerFinal));
    $("#form [name=BBMLiter]").val(number_format(BBMLiter));
    TotalKM = $("#form [name=TotalKM]").val();
    if (OdometerStart > 0 && OdometerEnd > 0) {
        Toleransi = (parseFloat(TotalKM)) / (parseFloat(BBMLiterStandard));
    }
    $("#form [name=BBMLiterUsed]").val(number_format(Toleransi));
    // console.log(Toleransi);
    // console.log(TotalKM);

    if (OdometerFinal > 0 && BBMLiter > 0 && BBMLiterUsed) {
        BBMLiterUsed = parseFloat(number_format(BBMLiterUsed));
        BBMLiterStandard = parseFloat(number_format(BBMLiterStandard));
        if (Toleransi < BBMLiter) {
            BBMRemark = "<span style='color:red;'>Pemakaian BBM kendaraan boros</span>";
            $('#form [name="BBMStatus"]').val(1);
        } else if (Toleransi > BBMLiter) {
            BBMRemark = "<span style='color:green;'>Pemakaian BBM kendaraan hemat</span>";
            $('#form [name="BBMStatus"]').val(0);
        } else {
            BBMRemark = "<span>Pemakaian BBM kendaraan normal</span>";
            $('#form [name="BBMStatus"]').val(0);
        }
        $("#BBMRemark").empty();
        $("#BBMRemark").append(BBMRemark);
    }

    if ($("#PPN").is(":checked")) {
        TotalPrice = $("[name=Price]").val();
        if (TotalPrice.length > 0) {
            TotalPrice = TotalPrice.replace(/\,/g, '');
        }
        TotalPrice = parseFloat(TotalPrice);
        if ($("#BBM").is(":checked")) {
            TotalPrice = TotalPrice + BBMPayment;
            $("[name=Pricexx]").val(number_format(TotalPrice));
        }
        TotalPPN = 0;//10 * TotalPrice / 100;
        TotalPrice = TotalPrice + TotalPPN;
        $("[name=Pricex]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAR]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAP]").val(number_format(TotalPrice));
    } else {
        TotalPrice = $("[name=Price]").val();
        if (TotalPrice.length > 0) {
            TotalPrice = TotalPrice.replace(/\,/g, '');
        }
        TotalPrice = parseFloat(TotalPrice);
        if ($("#BBM").is(":checked")) {
            TotalPrice = TotalPrice + BBMPayment;
            $("[name=Pricexx]").val(number_format(TotalPrice));
        }
        $("[name=Pricex]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAR]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAP]").val(number_format(TotalPrice));
    }
    if ($("#BBM").is(":checked")) {
        TotalPrice = $("[name=Price]").val();
        if (TotalPrice.length > 0) {
            TotalPrice = TotalPrice.replace(/\,/g, '');
        }
        TotalPrice = parseFloat(TotalPrice);
        TotalPrice = TotalPrice + BBMPayment;
        $("[name=Pricexx]").val(number_format(TotalPrice));
        if ($("#PPN").is(":checked")) {
            TotalPPN = 0;//10 * TotalPrice / 100;
            TotalPrice = TotalPrice + TotalPPN;
        }
        $("[name=Pricex]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAR]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAP]").val(number_format(TotalPrice));
    } else {
        TotalPrice = $("[name=Price]").val();
        TotalPriceAR = $("[name=TotalPaymentAR1]").val();
        TotalPriceAP = $("[name=TotalPaymentAP1]").val();
        if (TotalPrice.length > 0) {
            TotalPrice = TotalPrice.replace(/\,/g, '');
        }
        TotalPrice = parseFloat(TotalPrice);
        $("[name=Pricexx]").val(number_format(TotalPrice));
        if ($("#PPN").is(":checked")) {
            TotalPPN = 0;//10 * TotalPrice / 100;
            TotalPrice = TotalPrice + TotalPPN;
        }
        $("[name=Pricex]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAR]").val(number_format(TotalPrice));
        $("[name=TotalPaymentAP]").val(number_format(TotalPrice));
    }
    dt = $("[name=PaymentTypeID]").find(':selected').data();
    val = $("[name=PaymentTypeID]").find(':selected').text();
    if (dt.tipe == 0) { // tunai
        // $("[name=TotalPaymentAR]").val(number_format(TotalPrice)); //ini diubah oleh Putra, 17/04/2023 "Ini memliki kekurangan di security-nya, awalnya admin gak boleh edit Tipe tunai dan piutang"
        $("[name=TotalPaymentAR]").val(number_format(TotalPriceAR != 0 ? TotalPriceAR : TotalPrice));
        $("[name=TotalPaymentAP]").val(0);
    } else if (dt.tipe == 1) { // piutang
        $("[name=TotalPaymentAR]").val(0);
        // $("[name=TotalPaymentAP]").val(number_format(TotalPrice)); //ini diubah oleh Putra, 17/04/2023 "Ini memliki kekurangan di security-nya, awalnya admin gak boleh edit Tipe tunai dan piutang"
        $("[name=TotalPaymentAP]").val(number_format(TotalPriceAP != 0 ? TotalPriceAP : TotalPrice));
    } else if (dt.tipe == 2) { // cash & piutang
        if (view == "view" || view == "edit") {
            $("[name=TotalPaymentAR]").val(number_format(TotalPriceAR));
            $("[name=TotalPaymentAP]").val(number_format(TotalPriceAP));
        } else {
            $("[name=TotalPaymentAR]").val(number_format(TotalPrice / 2));
            $("[name=TotalPaymentAP]").val(number_format(TotalPrice / 2));
        }
    } else {
        $("[name=TotalPaymentAR]").val(0);
        $("[name=TotalPaymentAP]").val(0);
    }

    calculation_discount();

}
function calculation_discount() {
    OdometerFinal = 0;
    BBMLiter = 0;
    BBMLiterUsed = 0
    TotalPaymentAR = $("#form [name=TotalPaymentAR]").val();
    TotalPaymentAP = $("#form [name=TotalPaymentAP]").val();
    DiscountAR = $("#form [name=DiscountAR]").val();
    DiscountAP = $("#form [name=DiscountAP]").val();
    if (TotalPaymentAR == "") { TotalPaymentAR = 0; }
    if (TotalPaymentAP == "") { TotalPaymentAP = 0; }
    if (DiscountAR == "") { DiscountAR = 0; }
    if (DiscountAP == "") { DiscountAP = 0; }
    if (TotalPaymentAR.length > 0) {
        TotalPaymentAR = TotalPaymentAR.replace(/\,/g, '');
    }
    if (TotalPaymentAP.length > 0) {
        TotalPaymentAP = TotalPaymentAP.replace(/\,/g, '');
    }
    if (DiscountAR.length > 0) {
        DiscountAR = DiscountAR.replace(/\,/g, '');
    }
    if (DiscountAP.length > 0) {
        DiscountAP = DiscountAP.replace(/\,/g, '');
    }
    TotalPaymentAR = parseFloat(TotalPaymentAR);
    TotalPaymentAP = parseFloat(TotalPaymentAP);
    DiscountAR = parseFloat(DiscountAR);
    DiscountAP = parseFloat(DiscountAP);
    TotalPaymentFinal = 0;
    dt = $("[name=PaymentTypeID]").find(':selected').data();
    val = $("[name=PaymentTypeID]").find(':selected').text();
    if (dt.tipe == 0) { //tunai
        TotalPaymentFinal = TotalPaymentAR;
        $("[name=TotalPaymentAP], [name=DiscountAP]").val(0);
    } else if (dt.tipe == 1) { // piutang
        $("[name=TotalPaymentAR], [name=DiscountAR]").val(0);
        TotalPaymentFinal = TotalPaymentAP;
    } else if (dt.tipe == 2) { //cash & credit
        TotalPaymentFinal = (TotalPaymentAR + TotalPaymentAP);
    }
    $("[name=TotalPaymentFinal]").val(number_format(TotalPaymentFinal));
    if ($("#PPN").is(":checked")) {
        // console.log(ValueTax);
        // TotalPaymentFinal = TotalPaymentFinal + (10 * TotalPaymentAP / 100);
        TotalPaymentFinal = TotalPaymentFinal + (ValueTax * TotalPaymentAP / 100);
        $("[name=TotalPaymentFinalPPN]").val(number_format(TotalPaymentFinal));
    } else {
        $("[name=TotalPaymentFinalPPN]").val(number_format(TotalPaymentFinal));
    }

}
function round_to_precision(x, precision) {
    var y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
}
function create_detail_select(method1, method2) {
    option_select = '';
    if (method1 == "pegawai") {
        list_data = $(".list_pegawai_select").data();
        if (method2 == "operator") {
            option_select += '<select name="DetailOperatorID[]" class="select-td" style="max-width:100px;">';
        } else if (method2 == "rigger") {
            option_select += '<select name="DetailRiggerID[]" class="select-td" style="max-width:100px;">';
        } else if (method2 == "supir") {
            option_select += '<select name="DetailSupirID[]" class="select-td" style="max-width:100px;">';
        } else if (method2 == "lain-lain") {
            option_select += '<select name="DetailLainlainID[]" class="select-td" style="max-width:100px;">';
        } else {
            option_select += '<select name="DetailOperatorID[]" class="select-td" style="max-width:100px;">';
        }
        option_select += '<option value="0">Pilih</option>';
        $.each(list_data.json, function (i, v) {
            if (method2 == "operator" && v.TypeName == "operator") {
                option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
            }
            if (method2 == "rigger" && v.TypeName == "rigger") {
                option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
            }
            if (method2 == "supir" && v.TypeName == "supir") {
                option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
            }
            if (method2 == "lain-lain") {
                option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
            }
        });
        option_select += '</select>';
    } else if (method1 == "crane") {
        list_data = $(".list_crane_select").data();
        option_select += '<select name="DetailCraneID[]" class="select-td" style="max-width:100px;">';
        option_select += '<option value="0">Pilih</option>';
        $.each(list_data.json, function (i, v) {
            option_select += '<option value="' + v.ID + '">' + v.Code + " - " + v.Name + "</option>";
        });
        option_select += '</select>';

    }
    return option_select;
}

function onselect_payment_type(element, view) {
    dt = $(element).find(':selected').data();

    if (save_method == "add") {
        $("[name=DiscountAR], [name=DiscountAP]").val(0);
        console.log('dari onselect - ' + view)
        calculation_last_price(view);
    }
    if (dt.tipe == 0) { // tunai
        $(".div-payment-final, .div-diskon-ar").show(300);
        $(".div-bayar").show(300);
        $(".div-piutang, .div-diskon-ap").hide(300);
        $("[name='BillingID']").attr('disabled', true);
    } else if (dt.tipe == 1) { // piutang
        $(".div-payment-final, .div-diskon-ap").show(300);
        $(".div-bayar, .div-diskon-ar").hide(300);
        $(".div-piutang").show(300);
        $("[name='BillingID']").attr('disabled', false);
    } else if (dt.tipe == 2) { // cash & piutang
        $(".div-payment-final, .div-diskon-ar, .div-diskon-ap").show(300);
        $(".div-bayar").show(300);
        $(".div-piutang").show(300);
        $("[name='BillingID']").attr('disabled', true);
    } else {
        $(".div-bayar").hide(300);
        $(".div-piutang").hide(300);
        $(".div-payment-final, .div-diskon-ar, .div-diskon-ap").hide(300);
        // if ($("[name=PaymentTypeID] option[value='" + a.PaymentTypeID + "']").data('name') != "TRANSFER") {
        $("[name='BillingID']").attr('disabled', true);

        // } else {
        //     $("[name='BillingID']").attr('disabled', false);
        // }
    }
    name = dt.name;
    if (name == "transfer" || name == "TRANSFER") {
        $(".div-bank").show(300);
    } else {
        $(".div-bank").hide(300);
    }
}
function GetType() {
    dt = $('#form [name=BrandID]').find(':selected').data();
    value = $('#form [name=BrandID]').find(':selected').val();
    type_tipe_op = $(".type_select option");
    $(".type_select_level").empty();
    item = '<option value="none">Pilih Tipe</option>';
    $(".type_select_level").append(item);
    if (value != "none") {
        $.each(type_tipe_op, function (i, v) {
            dtx = $(v).data();
            item = '<option value="' + dtx.id + '">' + dtx.name + '</option>';
            if (dt && dtx && dt.id == dtx.parentid) {
                $(".type_select_level").append(item);
            }
        });
    }
}
function GetWorkType(valuex) {
    dt = $('#form [name=WorkType]').find(':selected').data();
    value = $('#form [name=WorkType]').find(':selected').val();
    if (value == null) {
        value = valuex;
    }

    $("#form [name=ProductID]").val("0");
    // $("#form [name=Price]").val("");
    $("#table-detail-1 tbody").empty();
    $(".v_paket, .v_vehicle, .from_city, .to_city, .detail_tarif").hide();
    console.log(value);
    if (value == "derek" || value == 'LANJUTAN' || value == 'DEREK') {
        $(".v_vehicle, .from_city, .to_city").show();
    } else if (value == "emergency") {
        $(".to_city").hide();
        $(".v_vehicle, .from_city, .detail_tarif").show();
    } else if (value == "paket") {
        $(".v_vehicle").hide();
        $(".from_city, .to_city, .v_paket").show();
    } else {
        $(".from_city, .to_city").hide();
        $(".v_vehicle").show();
    }
}
function GetVehicleCondition() {
    VehicleCondition = $("#form [name=VehicleCondition]").find(":selected").val();
    if (VehicleCondition == "lain-lain") {
        $(".div-vehicle-condition").show(300);
    } else {
        $(".div-vehicle-condition").hide(300);
    }
}

$("[name=Date]").change(function () {
    load_datatables();
})

function getValueTax() {
    urlTax = host + "api/getValueTax/";
    data_post = {
        TaxDate: $("[name=Date]").val()
    }
    $.ajax({
        url: urlTax,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            // console.log(json);
            ValueTax = json.Data.Value;
            calculation_last_price("view");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}

function send_qontak(element) {
    dt = $(element).data();
    id = dt.id;
    data_post = {
        TransactionCranePoolingID: id
    }
    urlSendQontak = host + "transaction_crane_pooling/send_qontak/";
    $.ajax({
        url: urlSendQontak + id,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            if (json.Status) {
                toastr.success(json.Message, "Information");
            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}

function autoCompleteTagihan(element) {
    dt = $('#form [name=BillingID]').find(':selected').data();
    if (dt) {
        $("[name='BillingName']").val(dt.name);
        $("[name='BillingAddress']").val(dt.address);
        $("[name='BillingCity']").val(dt.city);
        $("[name='BillingNPWP']").val(dt.npwp);
        $("[name='Email']").val(dt.email);
    }
}

// DN 220324
function sendEmailInvoice() {
    $("#btn-sendEmail").text("Loading...")
    id = $("[name = 'TransactionCranePoolingID']").val();
    ValidationOrderID = $("[name = 'TransactionValidationOrderID']").val();
    email = $("[name = 'Email']").val();
    linkSPK = $("[name = 'linkSPK']").val();
    AttId = [];
    $("[name='CheckAttachment[]']:checked").each(function () {
        AttId.push($(this).val());
    });
    url = host + "transaction_crane_pooling/sendEmailInvoice/";
    data_post = {
        email: email,
        linkSPK: linkSPK,
        AttId: AttId,
        ValidationOrderID: ValidationOrderID
    }

    $.ajax({
        url: url + id,
        type: "POST",
        dataType: "JSON",
        data: data_post,
        success: function (json) {
            $("#btn-sendEmail").text("Kirim Email Invoice")
            swal({ html: true, type: "success", title: "", text: json.message });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            $("#btn-sendEmail").text("Kirim Email Invoice")
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}

function saveAttachment(page) {
    if (page == 'spk') {
        id = $("[name = 'TransactionValidationOrderID']").val();
        url = host + "transaction_validation_order/save_attachment/";
        $.ajax({
            url: url + id + "/" + page,
            type: "POST",
            dataType: "JSON",
            data: data_post,
            success: function (json) {
                $("[name = 'linkSPK']").val(json.link);
                $("#btn-sendEmail").attr("disabled", false)
                $("#btn-sendEmail").removeClass("disabled");
                $("#btn-sendEmail").text("Kirim Email Invoice")
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                $("#btn-sendEmail").text("Kirim Email Invoice")
                swal("Info", "Terjadi kesalahan gagal mendapatkan data");
            }
        });
    }
}

async function getRoute(origin, destination) {
    const startPoint = new google.maps.LatLng(origin.lat, origin.lng);
    const endPoint = new google.maps.LatLng(destination.lat, destination.lng);

    const directionsService = new google.maps.DirectionsService();

    const request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
    };

    const coordinates = [];
    await directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            const route = response.routes[0];
            route.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    const decodedPolyline = google.maps.geometry.encoding.decodePath(step.polyline.points);
                    coordinates.push(...decodedPolyline);
                });
            });
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
    return coordinates;
}

async function getRouteOverview(origin, destination) {
    const startPoint = new google.maps.LatLng(origin.lat, origin.lng);
    const endPoint = new google.maps.LatLng(destination.lat, destination.lng);

    const directionsService = new google.maps.DirectionsService();

    const request = {
        origin: startPoint,
        destination: endPoint,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false // Ensure only one route is provided
    };

    return new Promise((resolve, reject) => {
        directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                // Extract overview polyline points
                const route = response.routes[0];
                const overviewPolyline = route.overview_polyline;
                const decodedPolyline = google.maps.geometry.encoding.decodePath(overviewPolyline);
                const coordinates = decodedPolyline.map(point => ({ lat: point.lat(), lng: point.lng() }));
                resolve(coordinates);
            } else {
                console.error('Directions request failed due to ' + status);
                reject(status);
            }
        });
    });
}


// Putra, 22/04/2024
// async function generateStaticMap(origin, destination) {
//     console.log(origin);
//     console.log(destination);
//     if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
//         return;
//     }
//     const rawPoints = await getRouteOverview(origin, destination);
//     console.log(rawPoints);
//     const size = `600x600`;
//     let coordinates = ``;

//     for (let i = 0; i < rawPoints.length; i++) {
//         let point = rawPoints[i];
//         coordinates += `|${point.lat},${point.lng}`;
//     };

//     const url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&key=AIzaSyBhFG6CXPgPaYVBlKul5jrxAS6-L5S8DNw&path=color:red|weight:5${coordinates}`;

//     return fetch(url)
//         .then(response => response.blob())
//         .then(blob => {
//             // Convert blob to base64
//             return new Promise((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.onload = () => {
//                     const base64Data = reader.result;
//                     resolve(base64Data);
//                 };
//                 reader.onerror = error => {
//                     reject(error);
//                 };
//                 reader.readAsDataURL(blob);
//             });
//         });
// }


async function generateStaticMap(origin, destination) {
    if (!origin.lat || !origin.lng || !destination.lat || !destination.lng) {
        return;
    }
    if (origin.lat == "0" || origin.lng == "0" || destination.lat == "0" || destination.lng == "0") {
        return;
    }
    const rawPoints = await getRouteOverview(origin, destination);
    console.log(rawPoints);
    const size = `600x600`;
    let coordinates = ``;

    for (let i = 0; i < rawPoints.length; i++) {
        let point = rawPoints[i];
        coordinates += `|${point.lat},${point.lng}`;
    };

    const pinOrigin = host + 'aset/img/marker-red-user.png';
    const pinDest = host + 'aset/img/marker-red.png';

    const url = `https://maps.googleapis.com/maps/api/staticmap?markers=label:Asal|color:0x006400|${origin.lat},${origin.lng}&markers=color:0xbd0704|label:Tujuan|${destination.lat},${destination.lng}&size=${size}&key=AIzaSyBhFG6CXPgPaYVBlKul5jrxAS6-L5S8DNw&path=color:red|weight:5${coordinates}`;


    return fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Convert blob to base64
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64Data = reader.result;
                    resolve(base64Data);
                };
                reader.onerror = error => {
                    reject(error);
                };
                reader.readAsDataURL(blob);
            });
        });
}

const regenerateStaticMap = async () => {
    let id = $('[name="TransactionCranePoolingID"]').val();
    if (!id || id == '0') {
        swal("Info", "Diperlukan data transaksi untuk generate map!");
        return;
    }
    const route = {
        origin:
        {
            lat: $("#form [name=FromLat]").val(),
            lng: $("#form [name=FromLng]").val()
        },
        destination: {
            lat:
                $("#form [name=ToLat]").val(),
            lng:
                $("#form [name=ToLng]").val()
        }
    };
    const staticMap = await generateStaticMap(route.origin, route.destination);
    if (staticMap) {
        saveMap(staticMap, id);
    } else {
        swal("Info", "Terjadi kesalahan gagal generate map");
    }
}

const saveMap = (staticMap, ID) => {
    let data_post = {
        ID: ID,
        staticMap: staticMap
    }
    $.ajax({
        url: url_save_map,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            if (json.Status) {
                edit('<span data-id="' + ID + '" data-method="edit"></span>');
                swal("Info", "Berhasil generate map");
                reload_table();
            } else {
                swal("Info", "Terjadi kesalahan gagal generate map")
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
        }
    });
}
