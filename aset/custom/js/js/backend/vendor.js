var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "vendor/list_data/";
var url_edit = host + "vendor/edit/";
var url_hapus = host + "vendor/delete/";
var url_simpan = host + "vendor/save/";
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
var LastID;
$(document).ready(function () {
    load_datatables();
});
function load_datatables() {
    dp = $(".data-page, .page-data").data();
    modul = dp.modul;
    app = dp.app;
    page_name = dp.page_name;
    menuid = dp.menuid;
    id = dp.id;
    ConnectToSAP = dp.connecttosap;
    Applikasi = dp.aplikasi;
    CustomerTypes = $('#form-filter [name=CustomerTypes]').find(':selected').val();
    data_post = {
        Modul: modul,
        VendorID: id,
        MenuID: menuid,
        CustomerTypes: CustomerTypes,
    }
    table = $('#table').DataTable({
        "pageLength": 25,
        "destroy": true,
        "processing": true, //Feature control the processing indicator.
        "serverSide": true, //Feature control DataTables' server-side processing mode.
        "searching": true,
        "order": [], //Initial no order.
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


    if (Applikasi == "crane") {
        ChangeColorBackground('83a95c');
    } else if (Applikasi == "rental") {
        ChangeColorBackground('cc9b6d');
    }


    $('#table tbody').on('click', 'tr', function () {
        $("#table tbody, .table tr").removeClass("active");
        row = table.row(this);
        var data = table.row(this).data();
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
    document.getElementById("add-attachments").addEventListener("change", readFiles);
    if (id && id > 0) {
        edit('<span data-id="' + id + '" data-method="view"></span>');
    }
}
function tambah(modul) {
    dp = $(".data-page, .page-data").data();
    modul = dp.modul;
    save_method = 'add';
    img_preview("reset");
    div_form("open");
    $(".panel-form .form-title").text("Tambah Data");
    $("#PPN").val(1);
    $("#form [name=Type]").attr("disabled", false);
    $("#form [name=Modul]").val(modul);
    $("#table-history-order tbody").empty();
    $("#table-history-order tbody").append('<tr><td colspan="5" class="empty">Data tidak ada</td></tr>');

}
function bad_debt(element) {
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    $("#form-bad-debt [name=VendorID]").val(id);
    $("#form-bad-debt [name=Date]").attr("disabled", true);
    $("#form-bad-debt textarea").val("");
    if (method == "delete") {
        save_method = 'delete_bad_debt';
        $(".v_baddebt_info").show();
        $(".v_baddebt").hide();
        $(".v_baddebt_remark2").show();
        $("#modal-bad-debt .modal-title").text("Hapus Bad Debt");
    } else {
        save_method = 'add_bad_debt';
        $(".v_baddebt_info").hide();
        $(".v_baddebt").show();
        $(".FileB64Attachment, .FormatFileB64Attachment").remove();
        $("#modal-bad-debt .modal-title").text("Bad Debt");
    }
    $("#modal-bad-debt").modal("show");
}
function edit(element) {
    dp = $(".data-page, .page-data").data();
    modul = dp.modul;
    dt = $(element).data();
    id = dt.id;
    userid = dt.userid;
    method = dt.method;
    LastID = id;
    if (method == "view" || method == "view_next" || method == "view_prev") {
        save_method = 'view';
        method_before = 'view';
        $(".panel-form .form-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".panel-form .form-title").text("Ubah Data");
    }
    img_preview("reset");
    $.ajax({
        url: url_edit + id + '/' + modul,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            if (json.HakAkses == "rc") {
                console.log(json);
            }
            if (json.Status) {
                div_form(method);
                $("#form [name=Modul]").val(modul);
                a = json.Data;
                NextID = a.NextID;
                PrevID = a.PrevID;
                $("#PPN").val(1);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=UserID]").val(a.UserID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=NickName]").val(a.NickName);
                $("#form [name=Type]").val(a.Type);
                $("#form [name=Type]").attr("disabled", true);
                $("#form [name=Category]").val(a.Category);
                $("#form [name=Category]").attr("disabled", false);
                $("#form [name=CustomerType]").val(a.CustomerType);
                $("#form [name=CustomerType]").attr("disabled", false);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=City]").val(a.City);
                $("#form [name=Email]").val(a.Email);
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=MobilePhone]").val(a.MobilePhone);
                $("#form [name=PIC]").val(a.PIC);
                $("#form [name=Fax]").val(a.Fax);
                $("#form [name=Term]").val(a.Term);
                $("#form [name=NPWP]").val(a.NPWP);
                $("#form [name=TaxName]").val(a.TaxName);
                $("#form [name=TaxAddress]").val(a.TaxAddress);
                $("#form [name=TaxCity]").val(a.TaxCity);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=LimitPiutang]").val(a.LimitPiutang);
                $("#form [name=UnBadDebtRemark]").val(a.UnBadDebtRemark);

                // data-company
                $("#form [name=CompanyName]").val(a.CompanyName);
                $("#form [name=CompanyAddress]").val(a.CompanyAddress);
                $("#form [name=CompanyCity]").val(a.CompanyCity);
                $("#form [name=CompanyPhone]").val(a.CompanyPhone);

                if (a.PPN == 1) {
                    $("#form #PPN").prop("checked", true);
                    $(".div-ppn").show();
                } else {
                    $(".div-ppn").hide();
                }

                console.log(a.Aplikasi);
                if (a.Aplikasi == "derek" || a.Aplikasi == "crane") {
                    if (a.ListHistoryOrder) {
                        $("#table-history-order tbody").empty();
                        if (a.ListHistoryOrder.length > 0) {
                            $.each(a.ListHistoryOrder, function (i, v) {
                                item = '<tr>';
                                item += '<td><a href="' + v.Link + '" target="_blank">' + v.WorkType + '</a></td>';
                                item += '<td>' + v.Code + '</td>';
                                item += '<td>' + v.Date + '</td>';
                                item += '<td>' + v.PIC + '</td>';
                                item += '<td>' + v.Phone + '</td>';
                                item += '</tr>';
                                $("#table-history-order tbody").append(item);
                            });
                        } else {
                            $("#table-history-order tbody").append('<tr><td colspan="5" class="empty">Data tidak ada</td></tr>');
                        }
                    }
                }
                if (a.Aplikasi == "rental") {
                    $("#table-history-order tbody").empty();
                    if (a.ListHistoryOrder.length > 0) {
                        $.each(a.ListHistoryOrder, function (i, v) {
                            if (v.Code) {
                                CustomerContractCode = v.Code;
                            } else {
                                CustomerContractCode = "-";
                            }
                            item = '<tr>';
                            item += '<td><a href="' + v.Link + '" target="_blank">Kontrak</a></td>';
                            item += '<td>' + CustomerContractCode + '</td>';
                            item += '<td>' + v.Date + '</td>';
                            item += '<td>' + v.Phone + '</td>';
                            // item += '<td>'+v.Merk+'</td>';
                            // item += '<td>'+v.Category+'</td>';
                            item += '</tr>';
                            $("#table-history-order tbody").append(item);
                        });
                    } else {
                        $("#table-history-order tbody").append('<tr><td colspan="5" class="empty">Data tidak ada</td></tr>');
                    }
                }

                if (a.ListBadDebt) {
                    if (a.ListBadDebt.length > 0) {
                        $.each(a.ListBadDebt, function (i, v) {

                            ItemDate = v.Date;
                            if (v.Finish == 1) {
                                ItemDate = v.Date + ' - ' + v.DateEnd;
                            }

                            idx = 'li-' + v.VendorBadDebtID;

                            item = '<li class="item">';
                            item += '<p data-toggle="collapse" data-target="#' + idx + '" class="pointer"><i class="ti-calendar icon-green" aria-hidden="true" style="margin-right:5px;"></i> ' + ItemDate + ', Keterangan : ' + v.Remark + '</p>';
                            if (v.ListAttachment) {
                                item += '<div id="' + idx + '" class="collapse list-attachment row" style="margin-left: 0px;margin-right: 0px">';
                                $.each(v.ListAttachment, function (ia, va) {
                                    item += add_attachment('return', va);
                                });
                                item += '</div>';
                            }
                            item += '</li>';
                            $(".list-debt").append(item);
                        });
                    } else {
                        item = '<li class="item">';
                        item += '<p style="text-align:center; vertical-align:middle;padding:20px;"><i class="fa fa-warning"></i> Tidak ada history bad debt</p>';
                        item += '</li>';
                        $(".list-debt").append(item);
                    }
                }
                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        console.log(v);
                        add_attachments('update', v);
                    });
                }
                CheckBtnNextPrev();
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
        $('.form-group').removeClass('has-error');
        $('.help-block').empty();
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'vendor/save/' + save_method;
        if (save_method == "add_bad_debt") {
            url = host + 'vendor/save_bad_debt/' + save_method;
            data_post = $('#form-bad-debt').serialize();
        } else if (save_method == "delete_bad_debt") {
            url = host + 'vendor/delete_bad_debt/' + save_method;
            data_post = $('#form-bad-debt').serialize();
        } else {
            data_post = $('#form').serialize();
        }
        $.ajax({
            url: url,
            type: "POST",
            data: data_post,
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
                        $("#PPN").val(1);
                        img_preview("reset");
                        div_form("reset");
                    } else if (method == "keep") {
                        save_method = "update";
                        $("#form [name=VendorID]").val(json.VendorID);
                        $("#form [name=Code]").val(json.Code);
                        $("#form [name=Codex]").val(json.Code);
                    } else if (save_method == "add_bad_debt" || save_method == "delete_bad_debt") {
                        $(".FileB64Attachment, .FormatFileB64Attachment").remove();
                        $("#modal-bad-debt").modal("hide");
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
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
                            } else if (json.type[i] == "alert_3") {
                                $('.' + json.inputerror[i] + 'Alert').parent().addClass('has-error');
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
                toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
                btn_saving(element, 'reset');
            }
        });
    }
}
function hapus(id, userid) {
    swal({
        title: "Info",
        text: language_app.are_you_sure,
        // type: "warning",   
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: language_app.yes,
        cancelButtonText: language_app.no,
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                $.ajax({
                    url: url_hapus + id + "/nonactive/" + userid,
                    type: "POST",
                    dataType: "JSON",
                    success: function (data) {
                        reload_table();
                        swal("Info", language_app.success_deleted);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Info", language_app.error_transaction);
                        console.log(jqXHR.responseText);
                    }
                });
            } else {
                swal("Info", language_app.cancel_deleted);
            }
        });
}
function active(id, userid) {
    $.ajax({
        url: url_hapus + id + "/active/" + userid,
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
function check_ppn(element) {
    if ($(element).is(":checked")) {
        $(".div-ppn").show(300);
        console.log("show");
    } else {
        $(".div-ppn").hide(300);
        console.log("hide");
    }
}

function readFiles() {
    var files = this.files;
    // console.log(files[0].name.split(".")[0]);
    namefile = files[0].name.split(".")[0];
    var reader;
    var file;
    var i;
    for (i = 0; i < files.length; i++) {
        file = files[i];
        reader = new FileReader();
        reader.onload = (function (file) {
            return function (e) {
                add_attachments('add_new', e, '', '', file.name.split(".")[0]);
            };
        })(file);
        reader.readAsDataURL(file);
    }
}
function add_attachments(modul, e, column, setting, namefile) {
    add_list = '';
    limit = 10;
    limit_big = 2000; //2MB
    HakDelete = 1;
    dt = $(".list-attachments").data();
    list_att = $(".list-attachments .item-attachments");
    CategoryB64 = $("[name=ADD-CategoryB64s]").find(':selected').val();
    CategoryB64Label = CategoryB64;
    if (dt) {
        if (dt.limit) {
            limit = dt.limit;
        }
    }

    if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
        add_list = '-null';
        list_att = $(".list-attachments-null .item-attachments");
    }

    if (setting) {
        if (setting.add_list != 'null') {
            add_list = setting.add_list;
        }
        if (setting.limit != 'null') {
            limit = setting.limit;
        }
        if (setting.limit_big != 'null') {
            limit_big = setting.limit_big;
        }
    }
    if (modul == "add_new") {
        link = "javascript:;";
        b64 = e.target.result;
        id = 0;
        if (list_att.length >= limit) {
            toastr.error('Maximum file up to ' + limit + ' file', "Information");
            return;
        }
        limit_big = limit_big * 1000;
        if (e && e.total > limit_big) {
            limit_big_txt = limit_big / 1000000;
            toastr.error('File size too big, size maximum is ' + limit_big_txt + 'MB', "Information");
            return;
        }
        TypeFileb64 = b64.split(';')[0].split('/')[1];
    } else {
        link = host + e.File;
        b64 = host + e.File;
        id = e.AttachmentID;
        TypeFileb64 = e.FormatFile;
    }
    if (TypeFileb64 == 'pdf') {
        img_div = '<img src="' + host + '/aset/icon/icon-pdf.jpg" height="100px" >';
    } else if (TypeFileb64 == 'xlsx' || TypeFileb64 == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
    } else if (TypeFileb64 == "xls" || TypeFileb64 == "vnd.ms-excel") {
        img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
    } else if (TypeFileb64 == "docx" || TypeFileb64 == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
        img_div = '<img src="' + host + '/aset/icon/icon-docx.jpg" height="100px" >';
    } else if (TypeFileb64 == "doc" || TypeFileb64 == "msword") {
        img_div = '<img src="' + host + '/aset/icon/icon-doc.jpg" height="100px" >';
    } else if (TypeFileb64 == "txt" || TypeFileb64 == "plain") {
        img_div = '<img src="' + host + '/aset/icon/icon-txt.jpg" height="100px" >';
    } else {
        img_div = '<img src="' + b64 + '" height="100px" >';
    }
    // var getX = function(boat, logo) {
    //     return 50;
    //   };

    //   var getY = function(boat, logo) {
    //     return 650;
    //   };
    //   var getXX = function(boat, logo) {
    //     return 795;
    //   };

    //   var getYY = function(boat, logo) {
    //     return 460;
    //   };
    // watermark([''+b64+'', ''+host+'/aset/img/sosial_media.jpg'])
    // .image(watermark.image.atPos(getX, getY, 1))
    // .load([''+host+'/aset/img/qr.jpg'])
    // .image(watermark.image.atPos(getXX, getYY, 1))
    // .load([''+host+'/aset/img/icon_derek.png'])
    // // .image(watermark.image.upperLeft(0.5))
    // .image(watermark.image.center(0.3))
    // .then(function (img) {
    //     console.log(img.src);
    //     document.getElementById('alpha-image').appendChild(img);
    // });
    if (TypeFileb64 == 'pdf' ||
        TypeFileb64 == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        TypeFileb64 == 'vnd.ms-excel' ||
        TypeFileb64 == 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        TypeFileb64 == 'msword' ||
        TypeFileb64 == 'plain' ||
        TypeFileb64 == 'png' ||
        TypeFileb64 == 'jpeg' ||
        TypeFileb64 == 'jpg' ||
        TypeFileb64 == 'txt' ||
        TypeFileb64 == 'xlsx' ||
        TypeFileb64 == 'xls' ||
        TypeFileb64 == 'docx' ||
        TypeFileb64 == 'doc'
    ) { } else {
        toastr.error('Format file not allowed, please use file format (png,jpg,pdf,doc,docx,xls,xlsx,txt)', "Information");
        return;
    }
    Name = '';
    no = 0;
    if (list_att.length > 0) {
        $.each(list_att, function (i, v) {
            if (i == 0) {
                dt = $(v).data();
                no = dt.no;
            }
        });
    }
    no = no + 1;
    item_no = 'item-attachments-' + no;
    if (Name == "") {
        Name = 'untitled-' + no;
    }
    if (e.NameOriginal) {
        Name = e.NameOriginal;
    }
    div_delete = "";
    if (HakDelete == 1) {
        if (modul == "update" || modul == "add_new") {
            div_delete = '<div class="item-remove pointer" onclick="remove_attachments(this)" data-item="' + item_no + '" data-modul="' + modul + '" data-id="' + id + '"><i class="fa fa-trash"></i></div>';
        }
    }
    if (mobile) {
        col = "col-sm-6";
    } else {
        if (column == 1) {
            col = "col-sm-12";
        } else if (column == 2) {
            col = "col-sm-6";
        } else if (column == 3) {
            col = "col-sm-4";
        } else {
            col = "col-sm-3";
        }
    }

    item = '<div class="' + col + ' col-xs-4 text-center item item-attachments ' + item_no + '" data-no="' + no + '">\
        <div class="item-body">\
        '+ div_delete + '\
            <a href="'+ link + '" target="_blank">\
                <div class="div-img">\
                '+ img_div + '\
                </div>\
            </div>\
        </a>'
    if (modul == "add_new") {
        item += '<input class="NameAttachments" type="hidden" name="NameAttachments[]" value="' + namefile + '">';
        item += '<input class="FileB64Attachments" type="hidden" name="FileB64s[]" value="' + b64 + '">';
        item += '<input class="FormatFileB64Attachments" type="hidden" name="FormatFileB64s[]" value="' + TypeFileb64 + '">';
        if (CategoryB64) {
            item += '<input class="CategoryB64s" type="hidden" name="CategoryB64s[]" value="' + CategoryB64 + '">';
        }
    }
    if (modul != "add_new") {
        item += '<a href="' + link + '" class="title" title="' + Name + '" target="_blank">' + Name + '</a>';
        item += '<a href="' + link + '" class="btn" title="' + Name + '" download="' + Name + '" target="_blank">Download</a>';
    }
    if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
        item += '<span>' + CategoryB64Label + '</span>';
    }
    item += '</div>';
    if (modul == 'return') {
        return item;
    } else {
        list_class = ".list-attachments" + add_list;
        $(list_class).prepend(item);
    }
}
function remove_attachments(element) {
    dt = $(element).data();
    item = dt.item;
    modul = dt.modul;
    ProductImageID = dt.id;
    if (modul == "add_new") {
        $("." + item).remove();
    } else {
        swal({
            title: "Info",
            text: "Apakah anda yakin akan menghapus data ini ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: true,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: host + 'api/remove_attachment/' + ProductImageID,
                        type: "POST",
                        dataType: "JSON",
                        success: function (json) {
                            if (json.Status) {
                                dx = json.data;
                                toastr.success(json.Message, "Information");
                                $("." + item).remove();
                            } else {
                                toastr.error(json.Message, "Information");
                            }
                            remove_overlay();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            toastr.error("Terjadi kesalahan, gagal menghapus data", "Information");
                            remove_overlay();
                            console.log(jqXHR.responseText);
                        }
                    });
                }
            });
    }
}