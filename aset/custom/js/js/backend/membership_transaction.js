var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "membership_transaction/ajax_list/";
var url_edit = host + "membership_transaction/edit/";
var url_hapus = host + "membership_transaction/delete/";
var url_simpan = host + "membership_transaction/save/";
var url_get_vendor = host + "api/vendor_select/";
var url_get_vendor_id = host + "vendor/edit/";
var url_get_vehicle = host + "api/vehicle_select_cust/";
var url_get_membership = host + "api/membership_select/";
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
let vendorSet = new Set();

$(document).ready(function () {
    load_datatables();
    $('.select2').select2({
        dropdownParent: $('body')
    });
    dropdownMembership();
    dropdownVendor();
    // dropdownVehicle();
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
    $(".panel-form .form-title").text("Tambah Data");
    $("#PPN").val(1);
    $(".dt-konsumen input, .dt-kendaraan input").attr("disabled", false);
    $("#form [name=Type]").attr("disabled", false);
    $("#form [name=Modul]").val(modul);
    $("#table-history-order tbody").empty();
    $("#table-history-order tbody").append('<tr><td colspan="5" class="empty">Data tidak ada</td></tr>');
    $("#MembershipID").val("0").trigger("change");
    $("#VendorID").val("0").trigger("change");
    const waitBrand = (resolve) => {
        if (brandDone) {
            resolve();
        } else {
            setTimeout(() => { waitBrand(resolve) }, 1000);
        }
    };

    new Promise(waitBrand).then(() => {
        $("#BrandID, #TypeID").val("none").trigger("change");
    });

    vechID = null;
    $("#VehicleID").val("0").trigger("change");
    $(".main-input").next().show();
    $(".sub-input").attr("type", "hidden");

}
function old_edit(element) {
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
                let dateFormated = new Date(a.Date);
                dateFormated = `${dateFormated.getDate()}-${dateFormated.getMonth() + 1}-${dateFormated.getFullYear()}`;
                $("#form [name=TransactionMembershipID]").val(a.TransactionMembershipID);
                $("#form [name=MembershipID]").val(a.MembershipID).trigger("change");
                $("#form [name=VendorID]").val(a.VendorID).trigger("change");
                vechID = a.VehicleID;
                // $("#form [name=VehicleID]").val(a.VehicleID).trigger("change");
                $("#form [name=Code]").val(a.Code).trigger("change");
                $("#form [name=Date]").datepicker("setDate", dateFormated);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}
const edit = function (element) {
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

    $(".main-input").next().hide();
    $(".sub-input").attr("type", "text");

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
                let dateFormated = new Date(a.Date);
                dateFormated = `${dateFormated.getDate()}-${dateFormated.getMonth() + 1}-${dateFormated.getFullYear()}`;
                $("#form [name=TransactionMembershipID]").val(a.TransactionMembershipID);
                $("#form [name=VendorName]").val(`${a.VendorName} - ${a.VendorName}`);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=MembershipID]").val(a.MembershipID).trigger("change");
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Date]").datepicker("setDate", dateFormated);

                $("#form [name=NickName]").val(a.NickName);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Email]").val(a.Email);
                $("#form [name=Phone]").val(a.Phone);

                $("#form [name=NickNameBefore]").val(a.NickName);
                $("#form [name=NameBefore]").val(a.Name);
                $("#form [name=EmailBefore]").val(a.Email);
                $("#form [name=PhoneBefore]").val(a.Phone);

                $("#form [name=VehicleNo]").val(a.VehicleNo);
                $("#form [name=FrameNo]").val(a.FrameNo);
                $("#form [name=MachineNo]").val(a.MachineNo);
                $("#form [name=BrandName]").val(a.Merk);
                $("#form [name=TypeName]").val(a.Type);
                $("#form [name=Color]").val(a.Color);
                $(".dt-konsumen input, .dt-kendaraan input").attr("disabled", true);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
};
function reload_table() {
    table.ajax.reload(null, false); //reload datatable ajax
}
var count_save = 0;
async function save(element) {
    let isConfirm = $("#VendorID").val() == '0' ? await checkMatchVendor() : await changeOfVendorVal();
    if (
        !isConfirm
    ) {
        return;
    }
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
        url = host + 'membership_transaction/save/' + save_method;

        data_post = $('#form').serialize();

        $.ajax({
            url: url,
            type: "POST",
            data: data_post,
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
                            } else if (json.type[i] == "select2") {
                                $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                                $('[name="' + json.inputerror[i] + '"]').next().next().text(json.error_string[i]);
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
const checkMatchVendor = async () => {
    let data = "";

    if (vendorSet.has($("#NickName").val())) {
        data = "Nama Pendek";
    } else if (vendorSet.has($("#Name").val())) {
        data = "Nama";
    } else if (vendorSet.has($("#Email").val())) {
        data = "Email";
    } else if (vendorSet.has($("#Phone").val())) {
        data = "No. Telepon";
    }

    if (data !== "") {
        return await new Promise((resolve, reject) => {
            swal({
                title: "Info",
                text: `${data} ditemukan di list Konsumen terdaftar`,
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Lanjutkan dan simpan",
                cancelButtonText: "Periksa",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    resolve(isConfirm);
                });
        });
    } else {
        return true;
    }
}

const changeOfVendorVal = async () => {
    let data = "";

    if ($("#NickName").val() != $("#NickNameBefore").val()) {
        data = "Nama Pendek";
    } else if ($("#Name").val() != $("#NameBefore").val()) {
        data = "Nama";
    } else if ($("#Email").val() != $("#EmailBefore").val()) {
        data = "Email";
    } else if ($("#Phone").val() != $("#PhoneBefore").val()) {
        data = "No. Telepon";
    }

    if (data != "") {
        return await new Promise((resolve, reject) => {
            swal({
                title: "Warning",
                text: `Perubahan ${data} ditemukan, program akan mengubah data di master Konsumen`,
                // type: "warning",   
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Lanjutkan dan simpan",
                cancelButtonText: "Periksa",
                closeOnConfirm: true,
                closeOnCancel: true
            },
                function (isConfirm) {
                    resolve(isConfirm);
                })
        });
    } else {
        return true;
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
                    type: "GET",
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
        type: "GET",
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

const dropdownVendor = function () {
    let options = `<option value="0">Pilih Konsumen</option>`;
    let data_post = {
        needEmail: 1
    };
    $.ajax({
        url: url_get_vendor,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (data) {
            let vendors = data.Data;
            for (let i = 0; i < vendors.length; i++) {
                vendorSet.add(vendors[i].Email);
                vendorSet.add(vendors[i].Phone);
                vendorSet.add(vendors[i].NickName);
                vendorSet.add(vendors[i].Name);
                let label = vendors[i].Email != '' ? `${vendors[i].Email} - ${vendors[i].Phone}` : vendors[i].Phone;
                options += `<option value="${vendors[i].ID}" data-userid="${vendors[i].UserID}" data-nickname="${vendors[i].NickName}" data-name="${vendors[i].Name}" data-phone="${vendors[i].Phone}" data-email="${vendors[i].Email}">${vendors[i].Label}</option>`;
            }
            $("#VendorID").html(options);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", language_app.error_transaction);
            console.log(jqXHR.responseText);
        }
    });
};

const dropdownMembership = function () {
    let options = `<option value="0">Pilih membership</option>`;
    $.ajax({
        url: url_get_membership,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            let memberships = data.Data;
            for (let i = 0; i < memberships.length; i++) {
                options += `<option value="${memberships[i].ID}">${memberships[i].Label}</option>`;
            }
            $("#MembershipID").html(options);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", language_app.error_transaction);
            console.log(jqXHR.responseText);
        }
    });
};
var vechID;
const dropdownVehicle = function (ID) {
    let options = `<option value="0">Pilih kendaraan</option>`;
    $.ajax({
        url: url_get_vehicle + ID,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            let vehicles = data.Data;
            for (let i = 0; i < vehicles.length; i++) {
                options += `<option value="${vehicles[i].ID}" class="userid-${vehicles[i].UserID}" data-userid="${vehicles[i].UserID}">${vehicles[i].Name}</option>`;
            }
            $("#VehicleID").html(options);
            if (vechID) {
                $("#form [name=VehicleID]").val(vechID).trigger("change");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", language_app.error_transaction);
            console.log(jqXHR.responseText);
        }
    });
};
const getVechByVen = function () {
    let UserID = $("#VendorID").find(":selected").data("userid");
    dropdownVehicle(UserID);
};

const changeVendor = (e) => {
    let ID = $("#VendorID").val();
    if (ID == 0) {
        $("#UserID").val('0');
        $("#NickName").val('');
        $("#Name").val('');
        $("#Email").val('');
        $("#Phone").val('');

        $("#NickNameBefore").val('');
        $("#NameBefore").val('');
        $("#EmailBefore").val('');
        $("#PhoneBefore").val('');
        return;
    }
    $.ajax({
        url: url_get_vendor_id + ID,
        type: "GET",
        dataType: "JSON",
        success: function (data) {
            let dt = data.Data;
            $("#UserID").val(dt.UserID ? dt.UserID : '0');
            $("#NickName").val(dt.NickName ? dt.NickName : '');
            $("#Name").val(dt.Name ? dt.Name : '');
            $("#Email").val(dt.Email ? dt.Email : '');
            $("#Phone").val(dt.Phone ? dt.Phone : '');

            $("#NickNameBefore").val(dt.NickName ? dt.NickName : '');
            $("#NameBefore").val(dt.Name ? dt.Name : '');
            $("#EmailBefore").val(dt.Email ? dt.Email : '');
            $("#PhoneBefore").val(dt.Phone ? dt.Phone : '');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", language_app.error_transaction);
            console.log(jqXHR.responseText);
        }
    });
}

function GetType() {
    selected = $('#form [name=BrandID]').find(':selected');
    dt = selected.data();
    value = selected.val();
    brandName = value == "none" ? '' : selected.html();
    $("#BrandName").val(brandName);
    type_tipe_op = $(".type_select option");
    $(".type_select_level").empty();
    $("#TypeName").val('');
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

function changeType() {
    selected = $('#form [name=TypeID]').find(':selected');
    TypeName = value == "none" ? '' : selected.html();
    $("#TypeName").val(TypeName);
}