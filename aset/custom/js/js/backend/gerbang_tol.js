var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "Gerbang_tol/list_data/";
var url_edit = host + "Gerbang_tol/edit/";
var url_del = host + "Gerbang_tol/delete/";
var url_simpan = host + "Gerbang_tol/save/";
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
    data_page = $(".data-page, .page-data").data();
    modul = data_page.modul;
    app = data_page.app;
    page_name = data_page.page_name;
    menuid = data_page.menuid;
    ConnectToSAP = data_page.connecttosap;
    Applikasi = data_page.aplikasi;
    data_post = {
        MenuID: menuid,
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

    if (Applikasi == "crane") {
        ChangeColorBackground('83a95c');
    } else if (Applikasi == "rental") {
        ChangeColorBackground('cc9b6d');
    }

});

function tambah(modul) {
    save_method = 'add';
    $(".panel-form .form-title").text("Tambah Data");
    $("#form [name=Code]").attr("disabled", true);
    div_form("open");
}
function edit(element) {
    dt = $(element).data();
    id = dt.id;
    console.log(id)
    method = dt.method;
    $("#form #table-qr tbody").html('');
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
                a = json.Data;
                console.log(a);
                $('#Code').val(a.Code);
                $('#Nama_tol').val(a.Nama);
                $('#KM').val(a.KM);
                $('#Kota').val(a.CityID);
                $('#Cabang').val(a.CompanyID);
                //Get select object
                //objSelect = document.getElementById("Cabang");
                //Set selected
                //setSelectedValue(objSelect, a.BranchID);
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
    console.log(save_method);
    btn_saving(element);
    if (save_method == "view") {
        swal("Info", "Maaf anda tidak bisa melakukan transaksi");
        return;
    }
    if(count_save == 0){
        count_save = 1;
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'Gerbang_tol/save/' + save_method;
        Nama_Tol = $('#Nama_tol').val();
        Codexx = $('#Code').val();
        KM = $('#KM').val();
        Cabang = $('#Cabang').val();
        Kota = $('#Kota').val();
        data_post = {
            Nama_Tol: Nama_Tol,
            KM: KM,
            Cabang: Cabang,
            Kota: Kota,
            Codex: Codexx
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
                    if(method == "close"){
                        div_form("close");
                    } else if(method == "new"){
                        save_method = "add";
                        div_form("reset");
                    } else if(method == "keep"){
                        save_method = "update";
                        $("#form [name=ProductID]").val(json.ProductID);
                        $("#form [name=Code]").val(json.Code);
                    };
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                } else {
                    $('.form-group').removeClass('has-error');
                    $('.help-block').empty();
                    if (json.inputerror) {
                        for (var i = 0; i < json.inputerror.length; i++) {
                            toastr.error(json.error_string[i], "Information");
                            $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                            $('[name="' + json.inputerror[i] + '"]').next().text(json.error_string[i]);
                        }
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
function hapus(element) {
    dt = $(element).data();
    action_delete = dt.action;
    if (action_delete == "delete_all" || action_delete == "undelete_all") {
        ArrayID = [];
        list_id = $(".table tbody .th-checkbox [type=checkbox]");
        $.each(list_id, function (i, v) {
            if ($(v).is(":checked")) {
                ArrayID.push($(v).data().id);
            }
        });
        data_post = {
            id: ArrayID
        }
    } else {
        data_post = {
            id: dt.id
        }
    }
    url = url_del + action_delete;
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
                    url: url,
                    type: "POST",
                    data: data_post,
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


function setSelectedValue(selectObj, valueToSet) {
    for (var i = 0; i < selectObj.options.length; i++) {
        if (selectObj.options[i].value == valueToSet) {
            selectObj.options[i].selected = true;
            return;
        }
    }
}

