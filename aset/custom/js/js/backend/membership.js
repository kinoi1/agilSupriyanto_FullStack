var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "membership/ajax_list/";
var url_edit = host + "membership/edit/";
var url_hapus = host + "membership/delete/";
var url_simpan = host + "membership/save/";
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
    data_post = {
        Modul: modul,
        MenuID: menuid
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

    $("#Diskon").on("keyup", function () {
        if ($(this).val() > 100) {
            $(this).val(0);
        }
    });

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
}
function tambah(modul) {
    dp = $(".data-page, .page-data").data();
    modul = dp.modul;
    save_method = 'add';
    img_preview("reset");
    div_form("open");
    $(`[name="BranchFilter[]"]`).prop("checked", false);
    $(".panel-form .form-title").text("Tambah Data");
    $("#PPN").val(1);
    $("#form [name=Type]").attr("disabled", false);
    $("#form [name=Modul]").val(modul);
    $("#table-history-order tbody").empty();
    $("#table-history-order tbody").append('<tr><td colspan="5" class="empty">Data tidak ada</td></tr>');
    $(".v_diskon_rp").hide();

}
function bad_debt(element) {
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    $("#form-bad-debt [name=membershipID]").val(id);
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
    $(`[name="BranchFilter[]"]`).prop("checked", false);
    $.ajax({
        url: url_edit + id + '/' + modul,
        type: "GET",
        dataType: "JSON",
        success: function (json) {
            console.log(json);
            if (json.Status) {
                div_form(method);
                $("#form [name=Modul]").val(modul);
                a = json.data;
                $("#form [name=MembershipID]").val(a.MembershipID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Keuntungan]").val(a.Keuntungan);
                if (a.IsNominal > 0) {
                    $("#form [name=DiskonRP]").val(a.Diskon).trigger("keyup");
                    $("#isNominal").prop("checked", true).trigger("change");
                } else {
                    $("#isNominal").prop("checked", false).trigger("change");
                    $("#form [name=Diskon]").val(a.Diskon);
                }
                $("#form [name=Harga]").val(a.Harga);
                $("#form [name=MaxPrice]").val(a.MaxPrice);
                $("#form [name=MaxUse]").val(a.MaxUse);
                $("#form [name=Periode]").val(a.Periode);
                const branches = JSON.parse(a.CompanyID);
                for (let i = 0; i < branches.length; i++) {
                    $(`#Branch${branches[i]}`).prop("checked", true);
                }
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
        url = host + 'membership/save/' + save_method;

        let branches = $(`[name="BranchFilter[]"]`).map(function () {
            if ($(this).is(":checked")) {
                return $(this).val();
            }
        }).get();

        let data_post = new FormData($("#form")[0]);
        data_post.append("Branches", JSON.stringify(branches));
        $.ajax({
            url: url,
            type: "POST",
            data: data_post,
            processData: false, // Prevent jQuery from processing the form data
            contentType: false, // Prevent jQuery from setting content type
            dataType: "JSON",
            success: function (json) {
                console.log(json);
                if (json.Status) {
                    NextID = json.NextID;
                    PrevID = json.PrevID;

                    toastr.success(json.Message, "Information");
                    div_form("close");

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
function hapus(id) {
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
                    url: url_hapus + id + "/nonactive",
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
function active(id) {
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

const changeIsNominal = () => {
    if ($("#isNominal").is(":checked")) {
        $(".v_diskon_rp").show(300);
        $(".v_diskon").hide(300);
    } else {
        $(".v_diskon_rp").hide(300);
        $(".v_diskon").show(300);
    }
}