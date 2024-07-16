var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "transaction_stp/list_data/";
var url_edit = host + "transaction_receive_order/edit/";
var url_hapus = host + "transaction_receive_order/delete/";
var url_simpan = host + "transaction_receive_order/save/";
var url_approve = host + "transaction_receive_order/approve_data/";

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
    jenisTrans = $('#form-filter [name=jenisTrans]').find(':selected').val();
    ApproveStatus = $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post = {
        Filter: filter,
        InvoiceID: id,
        MenuID: menuid,
        StartDate: StartDate,
        EndDate: EndDate,
        VendorID: VendorID,
        jenisTrans: jenisTrans,
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
}
function tambah(modul) {
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $(".main-input").next().show();
    $(".sub-input").attr("type", "hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total, .detail2-agentname, .detail2-price").text("");
    $(".detail2-agentname, .detail2-price").hide();
    $(".detail2-agentidx, .detail2-pricex").show();
    // add_data_detail('add_new','<span data-method="new_data"></span>');
    div_form("open");
    $("#form [name=TransactionReceiveOrderID], #form [name=TransactionSurveyRequestID]").val("");
    $("#form [name=Date], #form [name=TransactionStartDate], #form [name=TransactionEndDate]").val(CurrentDate);
    $("#form [name=Date], #form [name=TransactionStartDate], #form [name=TransactionEndDate]").datepicker("setDate", CurrentDate);
    $("#form .select2").val('none').trigger('change');
    $("#form .select2_new").val('0').trigger('change');
    $("#form [name=WorkType]").val('derek').trigger('change');
    $(".div-vehicle-condition").hide();
    approval_status_msg({ method: "close" });
}
function edit(element) {
    dt = $(element).data();
    id = dt.id;
    console.log(id);
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
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total, .detail2-agentname, .detail2-price").text("");
    $(".detail2-agentname, .detail2-price").show();
    $(".detail2-agentidx, .detail2-pricex").hide();
    $(".div-vehicle-condition").hide();
    $.ajax({
        url: url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            console.log(json)
            // if (json.HakAkses == "rc") {
            //     console.log(json);
            // }
            if (json.Status) {
                console.log(json);
                div_form(method);
                $("#form .input-group-addon").addClass("disabled");
                $("#form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                $("#form .select2_new").val('0').trigger('change');
                a = json.Data;
                approval_status_msg({ method: "open", data: a });
                NextID = a.NextID;
                PrevID = a.PrevID;

                $("#form [name=TransactionReceiveOrderID]").val(a.TransactionReceiveOrderID);
                $("#form [name=TransactionSurveyResultID]").val(a.TransactionSurveyResultID);
                $("#form [name=TransactionSurveyRequestID]").val(a.TransactionSurveyRequestID);
                if (a.WorkType == "STP") {
                    $("#form [name=VendorID]").val("556");
                } else {
                    $("#form [name=VendorID]").val(a.VendorID);
                }
                $("#form [name=Code]").val(a.Code);
                $("#form [name=ReferenceCode]").val(a.ReferenceCode);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=ResultCode]").val(a.ResultCode);
                $("#form [name=RequestCode]").val(a.RequestCode);
                $("#form [name=Date]").val(a.Date);
                $("#form [name=TransactionStartDate]").val(a.StartDate);
                $("#form [name=TransactionEndDate]").val(a.EndDate);
                $("#form [name=Name]").val(a.Name);
                if (a.WorkType == "STP" || a.WorkType == "DEREK" || a.WorkType == "PERBAIKAN" || a.WorkType == "LANJUTAN" || a.WorkType == "KIR") {
                    $("#form [name=PIC]").val(a.Name);
                } else {
                    $("#form [name=PIC]").val(a.PIC);
                }
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorID").val(a.VendorID).trigger('change');
                if (a.WorkType == "STP") {
                    $("#form [name=VendorName]").val("JASA MARGA");
                } else {
                    $("#form [name=VendorName]").val(a.VendorName);
                }
                $("#form [name=AgentID]").val(a.AgentID);
                $("#form [name=AgentID").val(a.AgentID).trigger('change');
                $("#form [name=AgentName]").val(a.AgentName);
                $("#form [name=MarketingID]").val(a.MarketingID);
                $("#form [name=MarketingID").val(a.MarketingID).trigger('change');
                $("#form [name=MarketingName]").val(a.MarketingName);
                $("#form [name=BillingName]").val(a.BillingName);
                $("#form [name=BillingAddress]").val(a.BillingAddress);
                $("#form [name=BillingCity]").val(a.BillingCity);
                $("#form [name=BillingNPWP]").val(a.BillingNPWP);
                $("#form [name=ProductType]").val(a.ProductType);
                $("#form [name=FromCityID]").val(a.FromCityID);
                $("#form [name=FromCityID").val(a.FromCityID).trigger('change');
                $("#form [name=FromCityName]").val(a.FromCityName);
                $("#form [name=FromAddress]").val(a.FromAddress);
                $("#form [name=FromGoogleAddress]").val(a.FromGoogleAddress);
                $("#form [name=FromLatLng]").val(a.FromLatLng);
                $("#form [name=ToCityID]").val(a.ToCityID);
                $("#form [name=ToCityID").val(a.ToCityID).trigger('change');
                $("#form [name=ToCityName]").val(a.ToCityName);
                $("#form [name=ToAddress]").val(a.ToAddress);
                $("#form [name=ToGoogleAddress]").val(a.ToGoogleAddress);
                $("#form [name=FromLat]").val(a.FromLat);
                $("#form [name=FromLng]").val(a.FromLng);
                $("#form [name=ToLat]").val(a.ToLat);
                $("#form [name=ToLng]").val(a.ToLng);
                $("#form [name=ToLatLng]").val(a.ToLatLng);
                $("#form [name=BrandID]").val(a.BrandID);
                $("#form [name=BrandID").val(a.BrandID).trigger('change');
                $("#form [name=BrandName]").val(a.BrandName);
                $("#form [name=TypeID]").val(a.TypeID);
                $("#form [name=TypeID").val(a.TypeID).trigger('change');
                $("#form [name=TypeName]").val(a.TypeName);
                console.log(a.WorkType);
                console.log(a.VehicleCondition);
                if (a.WorkType != "DEREK" && a.WorkType != "PERBAIKAN" && a.WorkType != "LANJUTAN" && a.WorkType != "KIR" && a.WorkType != "LAINNYA") {
                    $("#form [name=VehicleCondition]").val(a.VehicleCondition.toLowerCase());
                } else {
                    $("#form [name=VehicleCondition]").val(a.VehicleCondition);
                }
                $("#form [name=VehicleConditionRemark]").val(a.VehicleConditionRemark);
                $("#form [name=VehicleNo]").val(a.VehicleNo);
                $("#form [name=Color]").val(a.Color);

                $("#form [name=WorkType]").val(a.WorkType).trigger('change');
                GetWorkType(a.WorkType);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=TotalPrice]").val(a.TotalPrice);
                $("#form [name=Price]").val(a.TotalPrice);
                $(".table-data-detail tfoot .item-total").text(a.TotalPriceTxt);
                $("#table-detail-2 tfoot .item-total").text(a.TotalCommission);

                if (a.PPN == 1) {
                    $("#form [name=PPN]").prop("checked", true);
                } else {
                    $("#form [name=PPN]").prop("checked", false);
                }
                if (a.VehicleCondition == "lain-lain") {
                    $(".div-vehicle-condition").show();
                }
                if (method_before == "view") {
                    $(".main-input").next().hide();
                    $(".sub-input").attr("type", "text");
                } else {
                    $(".main-input").next().hide();
                    $(".sub-input").attr("type", "text");
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled", true);
                    $("#form [name=TransactionReceiveOrderID],#form [name=Remark], #add-attachment").attr("disabled", false);
                    $("#form [name=TransactionReceiveOrderID],#form [name=Remark]").removeClass("text");
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
                            if (v.PersonID > 0) {
                                $("tr." + v.Type + ' .detail2-agentname').text(v.Name);
                                $("tr." + v.Type + ' .detail2-price').text(v.Commission);
                            }
                        })
                    }
                }

                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        add_attachment('update', v);
                    });
                }
                if (json.Data.ListAttachmentPribadi && json.Data.ListAttachmentPribadi.length > 0) {
                    $.each(json.Data.ListAttachmentPribadi, function (i, v) {
                        add_attachment('view', v);
                    });
                }
                CheckBtnNextPrev();
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
        url = host + 'transaction_stp/save/' + save_method;
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
                        $("#form [name=TransactionReceiveOrderID]").val(json.TransactionReceiveOrderID);
                        $("#form [name=Codex]").val(json.Code);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="' + json.TransactionReceiveOrderID + '" data-method="edit"></span>');
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                    $(".FileB64Attachment, .FormatFileB64Attachment").remove();
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
        TransactionReceiveOrderID: id,
        ApproveStatus: status,
        ApproveRemark: remark
    }
    $.ajax({
        url: host + 'transaction_stp/approve_data/',
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
        $.each(list, function (i, v) {
            rowid = v.classList[1];
            class_rowid = "." + rowid;
            id = $(class_rowid + " .item-id").val();
            price = $(class_rowid + " .item-price").val();
            if (id == "") { id = 0; }
            if (price == "") { price = 0; }
            if (price.length > 0) {
                price = price.replace(/\,/g, '');
            }
            id = parseInt(id);
            price = parseInt(price);
            sub_total = price;
            if (id > 0) {
                total += sub_total;
                price = $(class_rowid + " .item-sub-total-txt").text(number_format(sub_total));
            }
        });
        $("#form [name=Price]").val(number_format(total));
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    } else {
        $("#form [name=Price]").val(number_format(total));
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    }
}

function GetPPNVendor(element) {
    dt = $('#form [name=VendorID]').find(':selected').data();
    value = $('#form [name=VendorID]').find(':selected').val();
    if (dt) {
        if (dt.name && dt.name.toLowerCase() != "umum") {
            $("#BillingName").val(dt.name);
            $("#BillingAddress").val(dt.address);
            $("#BillingCity").val(dt.city);
            $("#BillingNPWP").val(dt.npwp);
        }

        if (dt.ppn == 1) {
            $("#PPN").prop("checked", true);
            $("#BillingNPWP").val(dt.npwp);
        } else {
            $("#PPN").prop("checked", false);
            $("#BillingNPWP").val("");
        }

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
    $("#form [name=FromCityID]").val(0);
    $("#form [name=FromCityID").val(0).trigger('change');
    $("#form [name=ToCityID]").val(0);
    $("#form [name=ToCityID").val(0).trigger('change');
    $("#form [name=ProductID]").val("0");
    $("#form [name=Price]").val("");
    $(".table-data-detail tbody").empty();
    $(".v_paket, .v_vehicle, .from_city, .to_city, .detail_tarif").hide();
    if (value == "derek" || value == "STP" || value == "DEREK" || value == "LANJUTAN") {
        $(".v_vehicle, .from_city, .to_city").show();
    } else if (value == "emergency") {
        $(".to_city").hide();
        $(".v_vehicle, .from_city, .detail_tarif").show();
    } else if (value == "paket") {
        $(".v_vehicle").hide();
        $(".from_city, .to_city, .v_paket").show();
    }
}
function CheckHargaTarifTransaction() {
    WorkType = $("#form [name=WorkType]").find(":selected").val();
    FromCityID = $("#form [name=FromCityID]").find(":selected").val();
    FromCityData = $("#form [name=FromCityID]").find(":selected").data();
    ToCityID = $("#form [name=ToCityID]").find(":selected").val();
    ToCityData = $("#form [name=ToCityID]").find(":selected").data();
    if (FromCityData && FromCityData.name) {
        $("#form [name=FromCityName]").val(FromCityData.name);
    }
    if (ToCityData && ToCityData.name) {
        $("#form [name=ToCityName]").val(ToCityData.name);
    }
    $("#form [name=ProductID]").val("0");
    $("#form [name=Price]").val("");
    actionx = true;
    if (WorkType == "emergency") {
        $(".table-data-detail tbody").empty();
        calculation_total_price();
    }
    if (WorkType != "emergency" && FromCityID > 0 && ToCityID > 0 && save_method == "add") {
        if (WorkType == "emergency") {
            if (FromCityID == 0) {
                actionx = false;
                toastr.error("Kota Asal tidak boleh kosong", "Information");
            }
        } else {
            if (FromCityID == 0) {
                actionx = false;
                toastr.error("Kota Asal tidak boleh kosong", "Information");
            }
            if (ToCityID == 0) {
                toastr.error("Kota Tujuan tidak boleh kosong", "Information");
                actionx = false;
            }
        }
        if (actionx == true) {
            Data = CheckHargaTarif(WorkType, FromCityID, ToCityID);
        }
    }

}

function add_item_map(element) {
    dt = $(element).data();
    ItemID = dt.id;
    if (ItemID == "view") {
        Lat = dt.lat;
        Lng = dt.lng;
        Radius = dt.radius;
        GoogleAddress = dt.googleaddress;
    } else {
        Lat = $("." + ItemID + ' .item-lat').val();
        Lng = $("." + ItemID + ' .item-lng').val();
        Radius = $("." + ItemID + ' .item-radius').val();
        GoogleAddress = $("." + ItemID + ' .item-google-address').val();
    }
    $("#form-address [name=ItemID]").val(dt.id);
    $("#form-address [name=Lat]").val(Lat);
    $("#form-address [name=Lng]").val(Lng);
    $("#form-address [name=Radius]").val();
    $("#form-address [name=GoogleAddress]").val(GoogleAddress);
    if (Lat && Lng) {
        set_radius();
        resizeMap(Lat, Lng);
    }
    if (save_method == "add") {
        $("#modal-address input").attr("disabled", false);
        $("#modal-address .div-btn-save").show();
        $("#modal-address .div-btn-view").hide();
        enablePanningAndScrolling();
    } else {
        disablePanningAndScrolling();
        $("#modal-address input").attr("disabled", true);
        $("#modal-address .div-btn-save").hide();
        $("#modal-address .div-btn-view").show();
    }
    // $("#modal-address").modal("show");
    $("#modal-address").modal({ backdrop: 'static', keyboard: false });
}
function save_address(element) {
    ItemID = $("#form-address [name=ItemID]").val();
    Lat = $("#form-address [name=Lat]").val();
    Lng = $("#form-address [name=Lng]").val();
    Radius = $("#form-address [name=Radius]").val();
    GoogleAddress = $("#form-address [name=GoogleAddress]").val();
    $("." + ItemID + ' .item-lat').val(Lat);
    $("." + ItemID + ' .item-lng').val(Lng);
    $("." + ItemID + ' .item-radius').val(Radius);
    $("." + ItemID + ' .item-google-address').val(GoogleAddress);
    $("#modal-address").modal("hide");
}
function GetVehicleCondition() {
    VehicleCondition = $("#form [name=VehicleCondition]").find(":selected").val();
    if (VehicleCondition == "lain-lain") {
        $(".div-vehicle-condition").show(300);
    } else {
        $(".div-vehicle-condition").hide(300);
    }
}

var map;
var markers = [];
var lat;
var lng;
var zoom;
var myCenter;
var marker;
var zoom = 2;
var statusmap;
var infowindow;
var geocoder;
var cityCircle;

$(document).ready(function () {

    // if(modul == "konsumen"){
    google.maps.event.addDomListener(window, 'load', initialize);
    google.maps.event.addDomListener(window, "resize", resizingMap());

    $(".radius_val").text("100 Meter");
    $("[name=Radius]").val(100);
    $("[name=Radius]").change(function () {
        set_radius();
    });
    // }
});
function initialize() {
    myCenter = new google.maps.LatLng(20, -10);
    infowindow = new google.maps.InfoWindow;
    geocoder = new google.maps.Geocoder;
    marker = new google.maps.Marker({
        position: myCenter
    });

    var mapProp = {
        center: myCenter,
        zoom: zoom,
        gestureHandling: 'greedy'
        // mapTypeId:google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), mapProp);

    cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: myCenter,
        radius: Math.sqrt(0) * 100
    });

    map.addListener('click', function (event) {
        if (MarkerClick == true) {
            deleteMarkers();
            myCenter = event.latLng;
            addMarker(myCenter);
            geocodeLatLng(myCenter, geocoder, map, infowindow);
        }
    });
    autocomplete();
}
var lat_real;
var lng_real;
function resizeMap(lat, lng) {
    lat_real = lat;
    lng_real = lng;
    if (lat_real == 0 && lng_real == 0) {
        lat = -6.917463899999999;
        lng = 107.61841830489406;
    }

    if (typeof map == "undefined") return;
    setTimeout(function () {
        resizingMap(lat, lng);
    }, 400);
}

function resizingMap(lat, lng) {
    if (typeof map == "undefined") return;
    statusmap = false;
    if (lat != "" && lng != "") {
        deleteMarkers();

        myCenter = new google.maps.LatLng(lat, lng);
        marker = new google.maps.Marker({
            position: myCenter
        });
        statusmap = true;
        center = myCenter;
        zoom = 15;
    } else {
        deleteMarkers();
        zoom = 2;
        myCenter = new google.maps.LatLng(10, -20);
        center = map.getCenter();
    }

    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
    map.setZoom(zoom);
    if (statusmap) {
        if (lng_real == 0 && lat_real == 0) {

        } else {
            addMarker(myCenter);
        }
    }
}
function addMarker(location) {
    deleteMarkers();
    cityCircle.setMap(null);
    marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        // draggable : true

    });
    cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: radius_val
    });
    markers.push(marker);
    setMarkerinput(location);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function clearMarkers() {
    setMapOnAll(null);
}
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
function setMarkerinput(location) {
    $("#form-address [name=Lat]").val(location.lat());
    $("#form-address [name=Lng]").val(location.lng());
}

function disabled(status) {
    if (status) {
        $(".disabled").attr("disabled", true);
    } else {
        $(".disabled").attr("disabled", false);
    }
}
function autocomplete() {
    var input = (document.getElementById('pac-input'));
    var types = document.getElementById('type-selector');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("Autocomplete's returned place contains no geometry");
            return;
        }
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setZoom(15);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13); // Why 17? Because it looks good.
        }
        addMarker(place.geometry.location);
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
        // map.getUiSettings().setMyLocationButtonEnabled(true);
    });
}
function geocodeLatLng(latlng, geocoder, map, infowindow) {
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[1]) {
                // map.setZoom(11);
                addMarker(latlng);
                address = results[1].formatted_address;
                $("#form-address [name=GoogleAddress]").val(address);
                infowindow.setContent(address);
                infowindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
function set_radius() {
    radius_val = $("#form-address [name=Radius]").val();
    radius_val = parseInt(radius_val);
    if (radius_val < 1) {
        radius_val = 100;
    }

    $(".radius_val").text(radius_val + " Meter");
    // radius_val = Math.sqrt(radius_val) * 50;
    // radius_val = Math.round(radius_val);
    cityCircle.setRadius(radius_val);
}
function disablePanningAndScrolling() {
    map.setOptions({
        zoomControl: false,
        gestureHandling: 'none'
    });
    MarkerClick = false;
}
function enablePanningAndScrolling() {
    map.setOptions({
        zoomControl: true,
        gestureHandling: 'greedy' // or 'cooperative'*
    });
    MarkerClick = true;
    // map.addListener('click', function(event) {
    //     if(MarkerClick == true){
    //         deleteMarkers();
    //         myCenter = event.latLng;
    //         addMarker(myCenter);
    //         geocodeLatLng(myCenter,geocoder, map, infowindow);
    //     }
    // });
}