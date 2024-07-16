var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "transaction_payment/list_data/";
var url_edit = host + "transaction_payment/edit/";
var url_hapus = host + "transaction_payment/delete/";
var url_simpan = host + "transaction_payment/save/";
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
$(document).ready(function () {
    load_datatables();
    $('#table tbody').on('click', 'tr', function () {
        $("#table tbody, .table tr").removeClass("active");
        row = table.row(this);
        data = table.row(this).data();
        element = this.childNodes[1].childNodes[0];
        if (element.classList.contains("active")) {
            element.classList.remove("active");
            $(this).removeClass("active");
        } else {
            $(".table div").removeClass("active");
            $(this).addClass("active");
            element.classList.add("active");
        }
    });
    document.getElementById("add-attachment").addEventListener("change", readFile);
    $(".table-data-detail [name=CekAll]").click(function () {
        if ($(this).is(':checked')) {
            $(".table-data-detail tbody [type=checkbox]").prop("checked", true);
        } else {
            $(".table-data-detail tbody [type=checkbox]").prop("checked", false);
        }
        calculation_total_price(null);
    });
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
    data_post = {
        Filter: filter,
        InvoiceID: id,
        MenuID: menuid,
        StartDate: StartDate,
        EndDate: EndDate,
        VendorID: VendorID,
    }
    console.log(data_post);
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
                // Do something here
                console.log(jqXHR.responseText);
            }
        },
        "columnDefs": [
            {
                "targets": [], //last column
                "orderable": false, //set not orderable
            },
        ],
    });
    if (id && id > 0) {
        edit('<span data-id="' + id + '" data-method="view"></span>');
    }
}
function tambah(modul) {
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().show();
    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    // add_data_detail('add_new','<span data-method="new_data"></span>');
    div_form("open");
    $("#form [name=PaymentID], #form [name=VendorID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker("setDate", CurrentDate);
    $("#form .select2").val('none').trigger('change');
    $(".div-check-all").show();
    approval_status_msg({ method: "close" });
}
function edit(element) {
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
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
    $(".div-check-all").hide();
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total").text("");
    $.ajax({
        url: url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.HakAkses == "rc") {
                console.log(json);
            }
            if (json.Status) {
                div_form(method);
                $("#form .input-group-addon").addClass("disabled");
                $("#form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                approval_status_msg({ method: "open", data: a });
                NextID = a.NextID;
                PrevID = a.PrevID;
                console.log(a);
                $("#form [name=PaymentID]").val(a.PaymentID);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=ReferenceCode]").val(a.ReferenceCode);
                $("#form [name=Date]").val(a.Date);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorName]").val(a.VendorName);
                $("#form [name=PaymentType]").val(a.PaymentType);
                $("#form [name=BankName]").val(a.BankName);
                $("#form [name=AccountNo]").val(a.AccountNo);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=Price]").val(a.Price);
                $("#form [name=Price]").val(a.TotalPricePaymentTxt);
                $("#form [name=TotalPrice]").val(a.TotalPriceTxt);
                $("#form [name=TotalPricePayment]").val(a.TotalPriceTxt);
                $(".table-data-detail tfoot .item-total").text(a.TotalPriceTxt);
                if (method_before == "view") {
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "text");
                } else {
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "text");

                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled", true);
                    $("#form [name=PaymentID],#form [name=Remark], #add-attachment").attr("disabled", false);
                    $("#form [name=PaymentID],#form [name=Remark]").removeClass("text");
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
                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        add_attachment('update', v);
                    });
                }
                CheckBtnNextPrev();
            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}
function reload_table() {
    table.ajax.reload(null, false); //reload datatable ajax
}
var count_save = 0;
function save(element) {
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
        url = host;
        url = host + 'transaction_payment/save/' + save_method;
        $.ajax({
            url: url,
            type: "POST",
            data: $('#form').serialize(),
            dataType: "JSON",
            success: function (json) {
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
                        $("#form [name=PaymentID]").val(json.PaymentID);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="' + json.PaymentID + '" data-method="edit"></span>');
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                    $(".FileB64Attachment, .FormatFileB64Attachment").remove();

                    DATA = {
                        ID: json.PaymentID,
                        TypeID: 'PaymentID',
                        Kondisi: 'payment_derek',

                    }
                    GenerateJurnal(DATA);

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
                console.log(jqXHR.responseText);
                btn_saving(element, 'reset');
                toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
            }
        });
    }
}
function hapus_data(id) {
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
                    url: url_hapus + id + "/nonactive",
                    type: "POST",
                    dataType: "JSON",
                    success: function (data) {
                        reload_table();
                        swal("Info", "Transaksi berhasil dibatalkan");
                        if (data) {
                            DATA = {
                                ID: id,
                                TypeID: 'PaymentID/JB',
                                Kondisi: 'payment_derek_cancel',
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
        PaymentID: id,
        ApproveStatus: status,
        ApproveRemark: remark
    }
    $.ajax({
        url: host + 'transaction_payment/approve_data/',
        type: "POST",
        data: data_post,
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
            toastr.error("Terjadi kesalahan gagal mengirim data", "Information");
            console.log(jqXHR.responseText);
        }
    });
}

function add_data_detail(method, element) {
    console.log(element);
    count_dd = 1 + count_dd;
    rowid = "item-detail-" + count_dd;
    td_width = "70px";
    i_search = "";
    i_remove = "";
    i_alert = "";
    disabled = "";
    InvoiceID = "";
    BalanceID = "";
    TransactionDetailID = "";
    ID = "";
    VendorID = "";
    VendorName = "";
    Code = "";
    Datex = "";
    Price = "";
    TotalSisa = "";
    TotalPrice = "";
    TotalPayment = "";
    Diskon = "";
    PPH = "";
    Lainnya = "";
    Remark = "";

    bookingLabel = "";
    membershipLabel = "";
    if (element && element.ID) {
        a = element;
        if (method == "view") {
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        InvoiceID = a.InvoiceID;
        BalanceID = a.BalanceID;
        ID = a.ID;
        VendorID = a.VendorID;
        VendorName = a.VendorName;
        Code = a.Code;
        Datex = a.Date;
        Price = a.Price;
        TotalSisa = a.TotalSisa;
        TotalPrice = a.TotalPrice;
        TotalPayment = a.TotalPayment;
        Diskon = a.Diskon;
        PPH = a.PPH;
        Lainnya = a.Lainnya;
        Remark = a.Remark;

        Code = '<a href="' + host + 'backend/invoice?id=' + InvoiceID + '" target="_blank">' + Code + '</a>';
        bookingLabel = a.BookingOrder == 1 ? "<br><span class='badge badge-primary'>Booking Order</span>" : "";
        membershipLabel = a.TransactionMembershipID > 0 ? "<br><span class='badge badge-warning'>Membership</span>" : "";

    } else {
        dt = $(element).data();
    }
    if (method == "add_new") {


        i_alert = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="' + rowid + '"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
    }


    if (method == "empty") {
        item = '<tr class="empty"><td colspan="9">Data tidak ada</td></tr>';
    } else if (method == "view" || method == "update" || method == "edit") {
        item = '<tr class="item ' + rowid + '">';
        item += '<td></td>';
        item += '<td>' + Code + bookingLabel + membershipLabel + '</td>';
        item += '<td>' + Datex + '</td>';
        item += '<td>' + VendorName + '</td>';
        // item += '<td>'+Price+'</td>';
        item += '<td class="text-right">' + TotalSisa + '</td>';
        item += '<td class="text-right">' + TotalPayment + '</td>';
        item += '<td class="text-right">' + PPH + '</td>';
        item += '<td class="text-right">' + Diskon + '</td>';
        item += '<td class="text-right">' + Lainnya + '</td>';
        item += '</tr>';
    } else {
        input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
        input_h += '<input type="hidden" name="InvoiceID[]" value="' + InvoiceID + '">';
        input_h += '<input type="hidden" name="BalanceID[]" value="' + BalanceID + '">';
        input_h += '<input type="hidden" name="DetailVendorID[]" value="' + VendorID + '">';
        input_h += '<input type="hidden" name="DetailID[]" class="item-id" value="' + rowid + '">';
        input_h += '<input type="hidden" name="DetailPrice[]" class="item-price" value="' + Price + '">';
        input_h += '<input type="hidden" name="DetailTotalSisa[]" class="item-price" value="' + TotalSisa + '">';
        item = '<tr class="item ' + rowid + '">';
        // item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
        item += '<td>\
                <div class="checkbox checkbox-primary" style="margin:0px;text-align:left;">\
                  <input name="Checkbox[]" class="item-checked" type="checkbox" onclick="calculation_total_price()" data-rowid="'+ rowid + '" id="' + rowid + '" value="' + rowid + '">\
                  <label for="'+ rowid + '"></label>\
                </div>'
        item += '<td>' + Code + input_h + bookingLabel + membershipLabel + '</td>';
        item += '<td>' + Datex + '</td>';
        item += '<td>' + VendorName + '</td>';
        item += '<td class="text-right">' + TotalSisa + '</td>';
        item += '<td class="text-right"><input name="DetailPaymentPrice[]" class="item-payment-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit_keep_max" data-value="' + TotalSisa + '" value="' + TotalSisa + '" style="text-align:left;padding-left:5px;width: 140px;"></td>';
        item += '<td class="text-right"><input name="DetailPPH[]" class="item-pph" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit" style="text-align:left;padding-left:5px;width: 100px;"></td>';
        item += '<td class="text-right"><input name="DetailDiskon[]" class="item-diskon" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit" style="text-align:left;padding-left:5px;width: 100px;"></td>';
        item += '<td class="text-right"><input name="DetailLainnya[]" class="item-lainnya" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit" style="text-align:left;padding-left:5px;width: 100px;"></td>';
        item += '</tr>';
    }
    $("#table-detail-1 tbody").append(item);
}
function remove_data_detail(element) {
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    $("." + dt.rowid).remove();
    calculation_total_price();
}
function calculation_total_price() {
    total = 0;
    list = $("#table-detail-1.table-data-detail tbody tr");
    if (list.length > 0) {
        checkedcount = 0;
        $.each(list, function (i, v) {
            rowid = v.classList[1];
            class_rowid = "." + rowid;
            id = $(class_rowid + " .item-id").val();
            price = $(class_rowid + " .item-payment-price").val();
            pph = $(class_rowid + " .item-pph").val();
            diskon = $(class_rowid + " .item-diskon").val();
            lainnya = $(class_rowid + " .item-lainnya").val();
            if ($(class_rowid + " .item-checked").is(":checked")) {
                if (id.length > 0) {
                    if (price == "") { price = 0; }
                    if (pph == "") { pph = 0; }
                    if (diskon == "") { diskon = 0; }
                    if (lainnya == "") { lainnya = 0; }
                    if (price.length > 0) {
                        price = price.replace(/\,/g, '');
                    }
                    if (pph.length > 0) {
                        pph = pph.replace(/\,/g, '');
                    }
                    if (diskon.length > 0) {
                        diskon = diskon.replace(/\,/g, '');
                    }
                    if (lainnya.length > 0) {
                        lainnya = lainnya.replace(/\,/g, '');
                    }
                    price = parseInt(price);
                    pph = parseInt(pph);
                    diskon = parseInt(diskon);
                    lainnya = parseInt(lainnya);
                    checkedcount += 1;
                    sub_total = price + pph + lainnya - diskon;
                    total += sub_total;
                    price = $(class_rowid + " .item-sub-total-txt").text(number_format(sub_total));
                }
            }
        });
        if (list.length == checkedcount) {
            $("[name=CekAll]").prop("checked", true);
        } else {
            $("[name=CekAll]").prop("checked", false);
        }
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    } else {
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    }
    $("[name=Price]").val(number_format(total));
    $("[name=TotalPrice]").val(number_format(total));
    calculation_last_price();
}
function calculation_last_price() {
    Price = $("[name=Price]").val();
    if (Price == "") { Price = 0; }
    if (Price.length > 0) {
        Price = Price.replace(/\,/g, '');
    }
    Price = parseInt(Price);
    TotalPrice = (Price);
    $("[name=TotalPrice]").val(number_format(TotalPrice));
    $("[name=TotalPayment]").val(number_format(TotalPrice));
}

function GetListDataByVendor(element) {
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total").text("");
    dt = $(element).find(':selected').data();
    value = $(element).find(':selected').val();
    if (value != "none") {
        $.ajax({
            url: host + 'transaction_payment/GetListDataByVendor/' + value,
            type: "POST",
            dataType: "JSON",
            success: function (json) {
                console.log(json);
                if (json.Status) {
                    if (json.ListData) {
                        if (json.ListData.length > 0) {
                            $.each(json.ListData, function (i, v) {
                                add_data_detail("add_new", v);
                            });
                        } else {
                            add_data_detail("empty");
                        }
                    } else {
                        add_data_detail("empty");
                    }
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
}