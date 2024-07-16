var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "transaction_invoice/list_data/";
var url_edit = host + "transaction_invoice/edit/";
var url_hapus = host + "transaction_invoice/delete/";
var url_simpan = host + "transaction_invoice/save/";
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
var PaymentStatusGlobal = 0;
var ApproveStatusNewGlobal = 0;

$(document).ready(function() {
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
            $(".table-data-detail tbody .item-checked[type=checkbox]").prop("checked", true);
        } else {
            $(".table-data-detail tbody .item-checked[type=checkbox]").prop("checked", false);
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
    PPN = $('#form-filter [name=PPN]').find(':selected').val();
    ApproveStatus = $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post = {
        Filter: filter,
        InvoiceID: id,
        MenuID: menuid,
        StartDate: StartDate,
        EndDate: EndDate,
        VendorID: VendorID,
        PPN: PPN,
        ApproveStatus: ApproveStatus,
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
                "targets": [0], //last column
                "orderable": false, //set not orderable
            },
        ],
    });
    if (id && id > 0) {
        edit('<span data-id="' + id + '" data-method="view"></span>');
    }
}
function tambah(modul){
    $("#btn-sendEmail").hide()
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().show();
    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    // add_data_detail('add_new','<span data-method="new_data"></span>');
    div_form("open");
    $("#form [name=InvoiceID], #form [name=VendorID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    // $("#form [name=SentDate]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
    $(".div-check-all").show();
    $(".div-umum").hide();
    approval_status_msg({ method: "close" });
}
function edit(element)
{
    PaymentStatusGlobal     = 0;
    ApproveStatusNewGlobal  = 0;
    saved   = 0
    
    dt      = $(element).data();
    id      = dt.id;
    method  = dt.method;
    LastID  = id;
    PaymentStatus  = dt.paymentstatus;
    if(method == "view" || method == "view_next" || method == "view_prev"){
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
    $(".div-umum").hide();
    $.ajax({
        url: url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.HakAkses == "rc") {
                console.log(json);
            }
            console.log(json);

            if (json.Status) {
                div_form(method);
                $("#form .input-group-addon").addClass("disabled");
                $("#form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                console.log(a);
                approval_status_msg({ method: "open", data: a });
                NextID = a.NextID;
                PrevID = a.PrevID;
                $("#form [name=InvoiceID]").val(a.InvoiceID);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=TaxCode]").val(a.TaxCode);
                $("#form [name=FakturNo]").val(a.FakturNo);
                $("#form [name=ReferenceCode]").val(a.ReferenceCode);
                $("#form [name=Date]").val(a.Date);
                if(a.SentDate != null && a.SentDate != '01-01-1970'){
                    $("#form [name=SentDate]").val(a.SentDate);    
                } else {
                    $("#form [name=SentDate]").val(" ");
                }
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorName]").val(a.VendorName);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Email]").val(a.Email);
                $("#form [name=City]").val(a.City);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=Price]").val(a.TotalPrice);
                $("#form [name=Pembulatan]").val(a.Pembulatan);
                $("#form [name=Pricex]").val(a.TotalPrice);
                $("#form [name=TotalDownPayment]").val(a.TotalDownPaymentTxt);
                $("#form [name=TotalPrice]").val(a.TotalPrice);
                $("#bankid-" + a.BankID).prop("checked", true);
                if (a.VendorName == "UMUM") {
                    $(".div-umum").show();
                }
                if (method_before == "view") {
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "text");
                } else {
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type", "text");

                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=InvoiceID], #form [name=Remark], #form [name=SentDate], #form [name=Email], #add-attachment").attr("disabled",false);
                    $("#form [name=InvoiceID], #form [name=Remark], #form [name=SentDate], #form [name=Email]").removeClass("text");
                    // CAN EDIT
                    $("#form .can-edit").removeClass("text");
                    $("#form .can-edit").attr("disabled", false);
                }

                PaymentStatusGlobal     = PaymentStatus;
                ApproveStatusNewGlobal  = a.ApproveStatusNew;

                // if(PaymentStatus > 0){
                //     $("#btn-sendEmail").hide()
                // }else{
                //     $("#btn-sendEmail").show()
                //     if(a.ApproveStatusNew == 1){
                //         $("#btn-sendEmail").attr("disabled", false)
                //         $("#btn-sendEmail").removeClass("disabled");
                //     }else{
                //         $("#btn-sendEmail").attr("disabled", true)
                //         $("#btn-sendEmail").addClass("disabled");
                //     }
                // }

                if(json.Data.ListData){
                    if(json.Data.ListData.length > 0){
                        $(".table-data-detail tfoot .item-total").text(a.TotalPrice);
                        $.each(json.Data.ListData, function (i, v) {
                            add_data_detail(method_before, v);
                        })
                    } else {
                        add_data_detail('empty');
                        $(".table-data-detail tfoot .item-total").text("");
                    }
                } else {
                    add_data_detail('empty');
                    $(".table-data-detail tfoot .item-total").text("");
                }
                if(json.Data.ListAttachment && json.Data.ListAttachment.length > 0){
                    $.each(json.Data.ListAttachment,function(i,v){
                        // if(method_before == "view"){
                            if(PaymentStatusGlobal > 0){
                                $("#btn-sendEmail").hide()
                                save_img = '';
                            }else{
                                $("#btn-sendEmail").show()
                                if(ApproveStatusNewGlobal == 1){
                                    // save_img = 'save_img';
                                    // $("#btn-sendEmail").text("Loading...")
                                    // kalo mau send attachment buka aja yg dikomen diatas, yang dibawah komen:
                                    save_img = '';
                                    $("#btn-sendEmail").text("Kirim Email Invoice")
                                    $("#btn-sendEmail").attr("disabled", false)
                                    $("#btn-sendEmail").removeClass("disabled");
                                }else{
                                    save_img = '';
                                    $("#btn-sendEmail").text("Kirim Email Invoice")
                                    $("#btn-sendEmail").attr("disabled", true)
                                    $("#btn-sendEmail").addClass("disabled");
                                }
                                
                            }
                        // }else{
                        //     $("#btn-sendEmail").hide()
                        // }
                        add_attachment('update',v, save_img, '', '', json.Data.ListAttachment.length);
                    });
                    
                }else{
                    // if(method_before == "view"){
                        if(PaymentStatusGlobal > 0){
                            $("#btn-sendEmail").hide()
                        }else{
                            $("#btn-sendEmail").show()
                            if(ApproveStatusNewGlobal == 1){
                                if(json.Data.ListAttachment && json.Data.ListAttachment.length > 0){
                                    // $("#btn-sendEmail").text("Loading...")
                                    // $("#btn-sendEmail").attr("disabled", true)
                                    // $("#btn-sendEmail").addClass("disabled");
                                    // saveAttachment('spk')
                                    // kalo mau send spk buka aja yg dikomen diatas, yang dibawah komen:
                                    $("#btn-sendEmail").text("Kirim Email Invoice")
                                    $("#btn-sendEmail").attr("disabled", false)
                                    $("#btn-sendEmail").removeClass("disabled");
                                }else{
                                    $("#btn-sendEmail").text("Kirim Email Invoice")
                                    $("#btn-sendEmail").attr("disabled", true)
                                    $("#btn-sendEmail").addClass("disabled");
                                }
                            }else{
                                $("#btn-sendEmail").text("Kirim Email Invoice")
                                $("#btn-sendEmail").attr("disabled", true)
                                $("#btn-sendEmail").addClass("disabled");
                            }
                        }
                    // }else{
                    //     $("#btn-sendEmail").hide()
                    // }
                }
                CheckBtnNextPrev();
                $(".div-check-all").hide();
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
        url = host + 'transaction_invoice/save/' + save_method;
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
                        $("#form [name=InvoiceID]").val(json.InvoiceID);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="' + json.InvoiceID + '" data-method="edit"></span>');
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                    $(".FileB64Attachment, .FormatFileB64Attachment").remove();

                    if (json.Status) {
                        DATA = {
                            ID: id,
                            TypeID: 'InvoiceID',
                            Kondisi: 'invoice_derek',
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
                                TypeID: 'InvoiceID/JB',
                                Kondisi: 'invoice_derek_cancel',
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
        InvoiceID: id,
        ApproveStatus: status,
        ApproveRemark: remark
    }
    $.ajax({
        url: host + 'transaction_invoice/approve_data/',
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
    CheckPool = 0;
    TransactionReceiveOrderID = 0;
    TransactionReceiveOrderDetailID = 0;
    TransactionValidationOrderID = 0;
    TransactionCranePoolingID = 0;
    TransactionDetailID = "";
    PPN = 0;
    PPH = 0;
    ID = "";
    VendorID = "";
    VendorName = "";
    SPKCode = "";
    SPKDate = "";
    OrderCode = "";
    OrderDate = "";
    WorkType = "";
    Price = "";
    AdditionalPrice = "";
    TotalPPN = "";
    TotalGrandFinal = "";
    TotalDP = "";
    TotalSisa = "";
    TotalPayment = "";
    Discount = "";
    TotalPrice = "";
    PaymentTypeName = "";
    Remark = "";
    classtr = "";
    addppn = "";
    BillingName = "";
    BillingAddress = "";
    BillingCity = "";

    bookingLabel = "";
    membershipLabel = "";
    PPH_Label = '<i class="fa fa-close"></i>';
    if (element && element.ID) {
        a = element;
        if (method == "view") {
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionValidationOrderID = a.TransactionValidationOrderID;
        TransactionCranePoolingID = a.TransactionCranePoolingID;
        TransactionDetailID = a.TransactionDetailID;
        PPN = a.PPN;
        PPH = a.PPH;
        ID = a.ID;
        VendorID = a.VendorID;
        VendorName = a.VendorName;
        SPKCode = a.SPKCode;
        SPKDate = a.SPKDate;
        Price = a.Price;
        AdditionalPrice = a.AdditionalPrice;
        TotalPPN = a.TotalPPN;
        TotalGrandFinal = a.TotalGrandFinal;
        TotalPayment = a.TotalPayment;
        TotalPrice = a.TotalPrice;
        Discount = a.Discount;
        PaymentTypeName = a.PaymentTypeName;
        Remark = a.Remark;
        BillingName = a.BillingName;
        BillingAddress = a.BillingAddress;
        BillingCity = a.BillingCity;
        BillingEmail    = a.BillingEmail
        OrderCode = '<a href="' + host + 'backend/terima-order?id=' + TransactionReceiveOrderID + '" target="_blank">' + OrderCode + '</a>';
        SPKCode = '<a href="' + host + 'backend/validasi-order?id=' + TransactionValidationOrderID + '" target="_blank">' + SPKCode + '</a>';

        bookingLabel = a.BookingOrder == 1 ? "<br><span class='badge badge-primary'>Booking Order</span>" : "";
        membershipLabel = a.TransactionMembershipID > 0 ? "<br><span class='badge badge-warning'>Membership</span>" : "";
        if (a.CheckPayment == 1) {
            Remark += ", Lunas " + a.DateAdd;
        }
    } else {
        dt = $(element).data();
    }

    if (PPN == 1) {
        addppn = '<span style="font-size: 8pt;">+ppn</span>';
    }
    if (PPH == 1) {
        PPH_Label = '<i class="fa fa-check"></i>';
    }

    if (method == "add_new") {
        i_alert = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_receive_order(this)" data-rowid="' + rowid + '" data-modul="transaction_invoice"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
    }
    if (method == "empty") {
        item = '<tr class="empty"><td colspan="9">Data tidak ada</td></tr>';
    } else if (method == "view" || method == "update" || method == "edit") {
        if (TransactionCranePoolingID > 0) {
            classtr = " tr-green";
        }
        if (PPN == 1) {
            PPNLabel = '<i class="fa fa-check"></i>';
        } else {
            PPNLabel = '<i class="fa fa-close"></i>';
        }
        item = '<tr class="item ' + rowid + classtr + '">';
        item += '<td></td>';
        item += '<td>' + SPKCode + bookingLabel + membershipLabel + '</td>';
        item += '<td>' + SPKDate + '</td>';
        item += '<td>' + VendorName + '</td>';
        item += '<td class="text-right">' + Price + '</td>';
        item += '<td class="text-right">' + Discount + '</td>';
        // item += '<td class="text-right">'+AdditionalPrice+'</td>';
        item += '<td class="text-right">' + TotalPPN + '</td>';
        item += '<td class="item-total-ppn-txt" style="text-align:center;">' + PPH_Label + '</td>';
        item += '<td class="text-right">' + TotalGrandFinal + '</td>';
        item += '<td>' + PaymentTypeName + '</td>';
        item += '<td>' + Remark + '</td>';
        item += '</tr>';
    } else if (method == "add_new_2") {
        input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
        input_h += '<input type="hidden" name="DetailID[]" class="item-id">';
        input_h += '<input type="hidden" name="DetailVendorID[]" class="item-vendorid">';
        item = '<tr class="item ' + rowid + '">';
        item += '<td>' + i_alert + '<div class="btn-group btn-xs">' + i_search + i_remove + '</div>' + input_h + '</td>';
        item += '<td class="item-code-txt"></td>';
        item += '<td class="item-date-txt"></td>';
        item += '<td><input type="text" name="DetailRemark[]" class="item-remark"></td>';
        item += '<td><input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="' + rowid + '" data-format="duit"></td>';
        item += '</tr>';
    } else {
        // if(TransactionCranePoolingID > 0){
        //     classtr = " tr-green";
        // }
        PPNCheked = '';
        if (PPN == 1) {
            PPNCheked = 'checked="checked"';
        } else {
            PPNCheked = 'readonly="readonly" ';
        }
        input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
        input_h += '<input type="hidden" name="TransactionDetailID[]" value="' + TransactionDetailID + '">';
        input_h += '<input type="hidden" name="DetailTransactionValidationOrderID[]" value="' + TransactionValidationOrderID + '">';
        input_h += '<input type="hidden" name="DetailTransactionCranePoolingID[]" value="' + TransactionCranePoolingID + '">';
        input_h += '<input type="hidden" name="DetailVendorID[]" value="' + VendorID + '">';
        input_h += '<input type="hidden" name="DetailID[]" class="item-id" value="' + ID + '">';
        input_h += '<input type="hidden" name="DetailPPN[]" class="item-ppn" value="' + PPN + '">';
        input_h += '<input type="hidden" name="DetailPrice[]" class="item-price" value="' + Price + '">';
        input_h += '<input type="hidden" name="DetailAdditionalPrice[]" class="item-additional-price" value="' + AdditionalPrice + '">';
        input_h += '<input type="hidden" name="DetailTotalPPN[]" class="item-total-ppn" value="' + TotalPPN + '">';
        input_h += '<input type="hidden" name="DetailTotalGrandFinal[]" class="item-total-grand-final" value="' + TotalGrandFinal + '">';
        input_h += '<input type="hidden" name="DetailPaymentPrice[]" class="item-payment-price" value="' + TotalPayment + '">';
        input_h += '<input type="hidden" name="DetailDiscount[]" class="item-discount" value="' + Discount + '">';
        input_h += '<input type="hidden" name="DetailTotalPrice[]" class="item-payment-price" value="' + TotalPrice + '">';

        input_h  += '<input type="hidden" name="DetailBillingName[]" class="item-billing-name" value="'+BillingName+'">';
        input_h  += '<input type="hidden" name="DetailBillingAddress[]" class="item-billing-address" value="'+BillingAddress+'">';
        input_h  += '<input type="hidden" name="DetailBillingCity[]" class="item-billing-city" value="'+BillingCity+'">';
        input_h  += '<input type="hidden" name="Emails[]" class="item-email" value="'+BillingEmail+'">';
        item = '<tr class="item '+rowid+classtr+'">';
        // item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
        item += '<td>\
                <div class="checkbox checkbox-primary" style="margin:0px;text-align:left;">\
                  <input name="Checkbox[]" class="item-checked" type="checkbox" onclick="calculation_total_price()" data-rowid="'+ rowid + '" id="' + rowid + '-ppn" value="' + TransactionDetailID + '" tab-index="-1">\
                  <label for="'+ rowid + '-ppn"></label>\
                </div>'
        item += '<td>' + SPKCode + input_h + bookingLabel + membershipLabel + '</td>';
        item += '<td>' + SPKDate + '</td>';
        item += '<td>' + VendorName + '</td>';
        item += '<td class="text-right">' + Price + '</td>';
        item += '<td class="text-right">' + Discount + '</td>';
        // item += '<td class="text-right">'+AdditionalPrice+'</td>';
        item += '<td class="text-right">' + TotalPPN + '</td>';
        item += '<td class="item-total-ppn-txt" style="text-align:center;">' + PPH_Label + '</td>';
        item += '<td class="text-right">' + TotalGrandFinal + '</td>';
        item += '<td>' + PaymentTypeName + '</td>';
        item += '<td>' + Remark + '</td>';
        cal_total_price = "'checked'";
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
function calculation_total_price(method_cal) {
    total = 0;
    Type  = $("#form [name=Type]").find(':selected').val();
    list  = $("#table-detail-1.table-data-detail tbody tr");
    email = '';
    frmEmail = $("#form [name=Email]");

    pembulatan = $('[name=Pembulatan]').val().replace(/,/g,'');
    if(pembulatan == ''){
        pembulatan = 0;
    }else{
        pembulatan = parseFloat(pembulatan);
    }

    if(list.length > 0){
        checkedcount = 0;
        $.each(list, function (i, v) {
            rowid = v.classList[1];
            class_rowid = "." + rowid;
            id = $(class_rowid + " .item-id").val();
            price = $(class_rowid + " .item-payment-price").val();
            total_ppn = $(class_rowid + " .item-total-ppn").val();
            total_grand_final = $(class_rowid + " .item-total-grand-final").val();
            total_sisa = $(class_rowid + " .item-total-sisa").val();

            billingName = $(class_rowid + " .item-billing-name").val();
            billingAddress = $(class_rowid + " .item-billing-address").val();
            billingCity = $(class_rowid + " .item-billing-city").val();

            $("#form [name=Name]").val(billingName);
            $("#form [name=City]").val(billingAddress);
            $("#form [name=Address]").val(billingCity);

            if (price.length > 0) {
                price = price.replace(/\,/g, '');
            }
            if (total_ppn.length > 0) {
                total_ppn = total_ppn.replace(/\,/g, '');
            }
            if (total_grand_final.length > 0) {
                total_grand_final = total_grand_final.replace(/\,/g, '');
            }
            if (id == "") { id = 0; }
            if (price == "") { price = 0; }
            if (total_ppn == "") { total_ppn = 0; }
            if (total_grand_final == "") { total_grand_final = 0; }
            if (total_sisa == "") { total_sisa = 0; }
            id = parseInt(id);
            price = parseFloat(price);
            total_ppn = parseFloat(total_ppn);
            total_grand_final = parseFloat(total_grand_final);
            total_sisa = parseFloat(total_sisa);
            sub_total = total_grand_final;
            if ($(class_rowid + " .item-checked").is(":checked")) {
                if (id > 0) {
                    checkedcount += 1;
                    // total += Math.floor(sub_total);
                    total += sub_total;
                    price = $(class_rowid + " .item-sub-total-txt").text(number_format(sub_total));
                    // pembulatan += Math.round(sub_total) - Math.floor(sub_total);
                }
                billingEmail = $(class_rowid +" .item-email").val();
                if(billingEmail != ""){
                    email   = billingEmail
                }
            }

        });
        if (list.length == checkedcount) {
            $("[name=CekAll]").prop("checked", true);
        } else {
            $("[name=CekAll]").prop("checked", false);
            $("#form [name=Name]").val("");
            $("#form [name=City]").val("");
            $("#form [name=Address]").val("");
        }
        selectedValue = $('[name="VendorID"]').val();
        dataName = $('[name="VendorID"] option[value="' + selectedValue + '"]').data('name');
        if(dataName.toLowerCase() == 'umum'){
            frmEmail.val(email);
        }
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    } else {
        $(".table-data-detail tfoot .item-total").text(number_format(total));
        $("#form [name=Name]").val("");
        $("#form [name=City]").val("");
        $("#form [name=Address]").val("");
    }
    // totaldp = $("[name=TotalDownPayment]").val();
    // if(totaldp.length > 0){
    //     totaldp = totaldp.replace(/\,/g,'');
    //     totaldp = parseInt(totaldp);
    //     total   = (total - totaldp);
    // }
    $("[name=Pricex]").val(number_format(total+pembulatan));
    $("[name=Pembulatan]").val(number_format(pembulatan));
}
function calculation_last_price() {
    Price = $("[name=Price]").val();
    EstimationPrice = $("[name=EstimationPrice]").val();
    if (Price == "") { Price = 0; }
    if (EstimationPrice == "") { EstimationPrice = 0; }
    Price = parseFloat(Price);
    if (EstimationPrice.length > 0) {
        EstimationPrice = EstimationPrice.replace(/\,/g, '');
    }
    EstimationPrice = parseFloat(EstimationPrice);
    TotalPrice = (Price + EstimationPrice);
    $("[name=TotalPrice]").val(number_format(TotalPrice));
}

function GetListDataByVendor(element) {
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .item-total").text("");
    dt = $('#form [name=VendorID]').find(':selected').data();
    value = $('#form [name=VendorID]').find(':selected').val();
    Type = $("#form [name=Type]").find(':selected').val();
    // if(Type == 0){
    //     $(".div-down-payment").show(300);
    //     $(".div-check-all").show();
    //     $(".table-data-detail tfoot .action").hide();
    // } else {
    //     $(".div-down-payment").hide(300);
    //     $(".div-check-all").hide();
    //     $(".table-data-detail tfoot .action").show();
    //     list = $("#table-detail-1.table-data-detail tbody tr");
    //     if(list.length == 0){
    //         add_data_detail("add_new");
    //     }
    // }
    $(".div-umum").hide(300);
    if (dt) {
        name = dt.name;
        name = name.toUpperCase();
        name = name.trim();
        $("#form [name=VendorName]").val(name);
        if (name == "UMUM") {
            $(".div-umum").show(300);
        }
    }
    if (value != "none") {
        $.ajax({
            url: host + 'transaction_invoice/GetListDataByVendor/' + value,
            type: "POST",
            dataType: "JSON",
            success: function(json){
                if(json.Status){
                    Email   = json.dataVendor.Email;
                    $("#form [name=Email]").val(Email);
                    if(json.ListData){
                        if(json.ListData.length > 0){
                            $.each(json.ListData,function(i,v){
                                add_data_detail("add_new",v);
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
var url_taxcode;
function update_taxcode(element) {
    dt = $(element).data();
    action = dt.action;
    url = url_hapus;
    ArrayID = [];
    ArrayChecked = [];
    ArrayList = [];

    if (action == "invoice_internal") {
        url_taxcode = host + 'transaction_invoice/save_taxcode/taxcode';
        $("#table-taxcode .ppn").hide();
        $("#table-taxcode .spk").hide();
        $("#table-taxcode .invoice").show();
    } else {
        url_taxcode = host + 'transaction_invoice/save_taxcode/spkcode';
        $("#table-taxcode .ppn").show();
        $("#table-taxcode .spk").show();
        $("#table-taxcode .invoice").hide();
    }
    list_id = $(".table tbody .th-checkbox [type=checkbox]");
    $.each(list_id, function (i, v) {
        if ($(v).is(":checked")) {
            dtx = $(v).data();
            item_ar = {
                id: dtx.id,
                ppn: dtx.ppn,
                code: dtx.code,
                taxcode: dtx.taxcode,
                referencecode: dtx.referencecode,
                vendorname: dtx.vendorname,
                totalprice: dtx.totalprice,
            };
            ArrayChecked.push(dtx.id);
            if (action == "invoice_internal") {
                if (dtx.active == "1" && dtx.ppn == "1") {
                    ArrayID.push(dtx.id);
                    ArrayList.push(item_ar);
                } else {
                    $(v).prop("checked", false);
                }
            } else if (action == "spk_internal") {
                if (dtx.active == "1") {
                    ArrayID.push(dtx.id);
                    ArrayList.push(item_ar);
                } else {
                    $(v).prop("checked", false);
                }
            }
        }
    });
    $("#table-taxcode tbody").empty();
    $("#modal-taxcode .div-loader").show();
    if (ArrayList.length > 0) {
        console.log(ArrayList);
        $.each(ArrayList, function (i, v) {
            i += 1;
            taxcode = '';
            referencecode = '';
            ppn_label = '';
            if (v.taxcode) {
                taxcode = v.taxcode;
            }
            if (v.referencecode) {
                referencecode = v.referencecode
            }
            if (v.ppn == 1) {
                ppn_label = '<span class="label label-purple">PPN</span>';
            }
            th_hidden = '<input type="hidden" name="InvoiceID[]" value="' + v.id + '" class="item-id"> ';
            item = '<tr>';
            item += '<td>' + i + th_hidden + '</td>';
            item += '<td>' + v.code + '</td>';
            item += '<td>' + v.vendorname + '</td>';
            item += '<td class="text-right">' + v.totalprice + '</td>';
            if (action == "invoice_internal") {
                item += '<td><input type="text" name="TaxCode[]" value="' + taxcode + '" class="item-taxcode form-control" maxlength="50" style="height:30px;"></td>';
            } else {
                item += '<td>' + ppn_label + '</td>';
                item += '<td><input type="text" name="ReferenceCode[]" value="' + referencecode + '" class="item-referencecode form-control" maxlength="50" style="height:30px;"></td>';
            }

            item += '</tr>';
            $("#modal-taxcode #table-taxcode tbody").append(item);
        });
        $("#modal-taxcode .div-loader").hide();
        $("#modal-taxcode .modal-title").text("Update No. Invoice Internal");
        $("#modal-taxcode").modal("show");
    } else {
        toastr.danger("Maaf tidak ada data yang ber-PPN", "Information");
    }

}
function save_taxcode(element) {
    $(element).button("loading");
    $.ajax({
        url: url_taxcode,
        type: "POST",
        data: $('#form-taxcode').serialize(),
        dataType: "JSON",
        success: function (json) {
            if (json.Status) {
                toastr.success(json.Message, "Information");
                reload_table();
                $("#th-check-all").prop("checked", false);
                $("#modal-taxcode").modal("hide");
            } else {
                toastr.error(json.Message, "Information");
            }
            $(element).button("reset");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            toastr.error("Terjadi kesalahan gagal mendapatkan data", "Information");
            $(element).button("reset");
        }
    });
}

// DN 220324
function sendEmailInvoice(){
    $("#btn-sendEmail").text("Loading...")
    email        = $("[name = 'Email']").val();
    linkLampiran = $("[name = 'linkLampiran']").val();
    linkSPK      = $("[name = 'linkSPK']").val(); 
    AttId        = [];
    $("[name='CheckAttachment[]']:checked").each(function() {
        AttId.push($(this).val());
    });
    id           = $("[name = 'InvoiceID']").val(); 
    url          = host + "transaction_invoice/sendEmailInvoice/";
    data_post    = {
        email : email,
        linkLampiran : linkLampiran,
        linkSPK : linkSPK,
        AttId : AttId
    }

    $.ajax({
        url : url + id,
        type: "POST",
        dataType: "JSON",
        data: data_post,
        success: function(json){
            $("#btn-sendEmail").text("Kirim Email Invoice")
            swal({ html: true, type: "success", title: "", text: json.message });
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            $("#btn-sendEmail").text("Kirim Email Invoice")
            swal("Info","Terjadi kesalahan gagal mendapatkan data");
        }
    });
}

function saveAttachment(page){
    if(page == 'lampiran' || page == 'spk'){
        id      = $("[name = 'InvoiceID']").val(); 
        url     = host + "transaction_invoice/save_attachment/";
        $.ajax({
            url : url + id + "/" + page,
            type: "POST",
            dataType: "JSON",
            data: data_post,
            success: function(json){
                if(page == 'lampiran'){
                    $("[name = 'linkLampiran']").val(json.link);
                    saveAttachment('spk')
                }else{
                    // yang dibawah buat kirim spk, kalo dibuka berarti attachment spk ikut terkirim
                    // $("[name = 'linkSPK']").val(json.link);
                    if(PaymentStatusGlobal > 0){
                        $("#btn-sendEmail").hide()
                    }else{
                        $("#btn-sendEmail").show()
                        if(ApproveStatusNewGlobal == 1){
                            $("#btn-sendEmail").attr("disabled", false)
                            $("#btn-sendEmail").removeClass("disabled");
                        }else{
                            $("#btn-sendEmail").attr("disabled", true)
                            $("#btn-sendEmail").addClass("disabled");
                        }
                    }
                    $("#btn-sendEmail").text("Kirim Email Invoice")
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
                $("#btn-sendEmail").text("Kirim Email Invoice")
                swal("Info","Terjadi kesalahan gagal mendapatkan data");
            }
        });
    }
}

function calcPembulatan(){
    // var Pembulatan = $('[name="Pembulatan"]').val().replace(/,/g, '');
    // var Pricex  = $('[name="Pricex"]').val().replace(/,/g, '');

    // if(Pembulatan == 0){
        calculation_total_price(null);
    // }else{
    //     var total = parseInt(Pricex) + parseInt(Pembulatan);
    //     $('[name="Pricex').val(total);
    // }
}