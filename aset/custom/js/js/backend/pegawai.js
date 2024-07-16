var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "pegawai/list_data/";
var url_edit = host + "pegawai/edit/";
var url_hapus = host + "pegawai/delete/";
var url_simpan = host + "pegawai/save/";
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

function select_type() {
    value = $("[name=Type]").val();
    HakAkses = $("[name=HakAksesID]").val();
    // console.log(value);
    // console.log(HakAkses);
    if (value == 1) {
        $(".v_date").show(300);
    } else {
        $(".v_date").hide(300);
    }

    if (HakAkses == 36) {
        $('.for-supir').show(300);
        if (value == 3) {
            $('.wajib-supir').show(300);
        } else if (value == 10) {
            $('.wajib-supir').hide(300);
        }
    } else {
        $('.for-supir').hide(300);
    }

    if (value == 1 || value == 2 || value == 3) {
        $("#simsio").show(300);
    } else {
        $("#simsio").hide(300);
    }
    if (value == 3) {
        $(".v_sio").hide(300);
    } else {
        $(".v_sio").show(300);
    }
}
function tambah(modul) {
    save_method = 'add';
    $(".panel-form .form-title").text("Tambah Data");
    $("#form [name=Type]").attr("disabled", false);
    $("[name=HakAksesID]").attr("disabled", false);
    img_preview("reset");
    div_form("open");
    $(".for-supir").hide();
    $("#simsio").hide();
    $("#BranchBandung").val(1);
    $("#BranchCirebon").val(2);
    $("#BranchPurbaleunyi").val(3);
    $("#BranchBogor").val(4);
    $("#BranchKunciran").val(5);
    $("#BranchCikampek").val(6);
    $("#BranchCinere").val(7);
    $("#BranchCengkareng").val(8);
    $("#BranchCibitung").val(10);
    $("#BranchCimanggis").val(11);
    $("#BranchSerbaraja").val(12);
    $("#BranchJagorawi").val(13);
    $("#BranchPalikanci").val(14);
    $("#BranchPadalarang").val(15);
    $("#BranchBuahBatu").val(16);
    $("#BranchJatiluhur").val(17);
    $("#BranchCikampek2").val(18);
    $("#BranchSurabayaGempol").val(19);
    $("#BranchSurabayaMojokerto").val(20);
    $("#BranchGempolPasuruan").val(21);
}
function edit(element) {
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    $("#form #table-qr tbody").html('');
    LastID = id;
    if (method == "view" || method == "view_next" || method == "view_prev") {
        save_method = 'view';
        method_before = 'view';
        $(".form-title").text("Lihat Data");
        $(".active-qr").removeClass('hidden');
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    img_preview("reset");
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
                a = json.Data;
                NextID = a.NextID;
                PrevID = a.PrevID;
                // added branch 15-21
                $("#BranchBandung").val(1);
                $("#BranchCirebon").val(2);
                $("#BranchPurbaleunyi").val(3);
                $("#BranchBogor").val(4);
                $("#BranchKunciran").val(5);
                $("#BranchCikampek").val(6);
                $("#BranchCinere").val(7);
                $("#BranchCengkareng").val(8);
                $("#BranchCibitung").val(10);
                $("#BranchCimanggis").val(11);
                $("#BranchSerbaraja").val(12);
                $("#BranchJagorawi").val(13);
                $("#BranchPalikanci").val(14);

                $("#BranchPadalarang").val(15);
                $("#BranchBuahBatu").val(16);
                $("#BranchJatiluhur").val(17);
                $("#BranchCikampek2").val(18);
                $("#BranchSurabayaGempol").val(19);
                $("#BranchSurabayaMojokerto").val(20);
                $("#BranchGempolPasuruan").val(21);

                $("#form [name=UserID]").val(a.UserID);
                $("#form [name=HakAksesID]").val(a.HakAksesID);
                $("#form [name=Type]").val(a.Type);
                $("#form [name=Typex]").val(a.Type);
                // $("#form [name=Type]").attr("disabled",true);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=NIK]").val(a.NIK);
                $("#form [name=BPJS]").val(a.BPJS);
                $("#form [name=Jamsostek]").val(a.Jamsostek);
                $("#form [name=NickName]").val(a.NickName);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Division]").val(a.Division);
                $("#form [name=Branch]").val(a.Branch);
                $("#form [name=WorkPlace]").val(a.WorkPlace);
                $("#form [name=RegisterDate]").val(a.RegisterDate);
                $("#form [name=RegisterDate]").datepicker("setDate", a.RegisterDate);
                $("#form [name=BornDate]").val(a.BornDate);
                $("#form [name=BornDate]").datepicker("setDate", a.BornDate);
                $("#form [name=ResignDate]").val(a.ResignDate);
                $("#form [name=ResignDate]").datepicker("setDate", a.ResignDate);
                $("#form [name=SIMDate]").val(a.SIMDate);
                $("#form [name=SIODate]").val(a.SIODate);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=City]").val(a.City);
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=Email]").val(a.Email);
                $("#form [name=Password]").val(a.Password);
                $("#form [name=KK]").val(a.KK);
                $("#form [name=NPWP]").val(a.NPWP);
                $("#form [name=SIM]").val(a.SIM);
                $("#form [name=SIO]").val(a.SIO);
                $("#form [name=Branch]").val(a.Branch);
                $("#form [name=Kendaraan]").val(a.Kendaraan);
                $("#form [name=Kelompok]").val(a.Kelompok);
                $("#form [name=StatusBPJS]").val(a.StatusBPJS);
                $("#form [name=PlaceOfBirth]").val(a.PlaceOfBirth);
                // console.log(a.QrCode);
                if (a.QrCode) {
                    item = "";
                    $.each(a.QrCode, function (i, v) {
                        qrc = v.QRValue + '.png';
                        if (v.Active) {
                            buttonAct = `<button type="button" class="btn-` + v.QRCodeID + ` btn btn-danger" onclick="act('deact', '` + v.QRCodeID + `')">Deactivate</button>`
                            labelAct = `<span style="width:25%;" class="txt-` + v.QRCodeID + ` badge text-bg-success">Active</span>`
                        } else {
                            buttonAct = `<button type="button" class="btn-` + v.QRCodeID + ` btn btn-success" onclick="act('act', '` + v.QRCodeID + `')">Activate</button>`
                            labelAct = `<span style="width:25%;" class="txt-` + v.QRCodeID + ` badge text-bg-danger">Non-Active</span>`
                        }
                        item += `
                        <tr>
                            <td>
                            <div style="display:flex;flex-direction:column;">
                            <a style="cursor:pointer;" onclick='view_qr("`+ qrc + `")' ><img style="box-shadow: 0px 2px 5px 3px #888888;" src="https://qa.lccd.rcelectronic.co.id/qr/` + qrc + `" width="20%"/></a>
                            `+ labelAct + `
                            </div>
                            </td>
                            <td>
                                `+ v.DateActive + `
                            </td>
                            <td>
                                `+ v.DateAdd + `
                            </td>
                            <td>
                            `+ buttonAct + `
                            </td>
                        </tr>`
                        $("#form #table-qr tbody").html(item);
                    })
                    console.log(item);
                }
                // console.log(a.QrCode);
                if (a.Image) {
                    img_preview("set", host + a.Image);
                }

                if (a.HakAksesID == 36) {
                    $('.for-supir').show(300);
                } else {
                    $('.for-supir').hide(300);
                }
                if (a.Type == 1 || a.Type == 2 || a.Type == 3 || a.Type == 10) {
                    $("#simsio").show(300);

                } else {
                    $("#simsio").hide(300);

                }
                if (a.Type == 3) {
                    $(".v_sio").hide(300);
                }
                $("#form [name=Codex]").attr("disabled", true);
                console.log(method);
                if (json.HakAksesID == 1 || json.HakAksesID == 2 || json.HakAksesID == 11 || json.HakAksesID == 12 || json.HakAksesID == 21 || json.HakAksesID == 22) {
                    if(method == "view"){
                        $("[name=HakAksesID]").attr("disabled", true);
                    }else{
                        $("[name=HakAksesID]").attr("disabled", false);
                    }
                } else {
                    $("[name=HakAksesID]").attr("disabled", true);
                }
                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        add_attachment('update', v);
                    });
                }
                // console.log(a.BranchID);
                let Branch = '';
                if (a.BranchID) {
                    for (let i = 0; i < a.BranchID.length; i++) {
                        if (a.BranchID[i] == "1") {
                            $("#BranchBandung").prop("checked", true);
                        }
                        if (a.BranchID[i] == "2") {
                            $("#BranchCirebon").prop("checked", true);
                        }
                        if (a.BranchID[i] == "3") {
                            $("#BranchPurbaleunyi").prop("checked", true);
                        }
                        if (a.BranchID[i] == "4") {
                            $("#BranchBogor").prop("checked", true);
                        }
                        if (a.BranchID[i] == "5") {
                            $("#BranchKunciran").prop("checked", true);
                        }
                        if (a.BranchID[i] == "6") {
                            $("#BranchCikampek").prop("checked", true);
                        }
                        if (a.BranchID[i] == "7") {
                            $("#BranchCinere").prop("checked", true);
                        }
                        if (a.BranchID[i] == "8") {
                            $("#BranchCengkareng").prop("checked", true);
                        }
                        if (a.BranchID[i] == "10") {
                            $("#BranchCibitung").prop("checked", true);
                        }
                        if (a.BranchID[i] == "11") {
                            $("#BranchCimanggis").prop("checked", true);
                        }
                        if (a.BranchID[i] == "12") {
                            $("#BranchSerbaraja").prop("checked", true);
                        }
                        if (a.BranchID[i] == "13") {
                            $("#BranchJagorawi").prop("checked", true);
                        }
                        if (a.BranchID[i] == "14") {
                            $("#BranchPalikanci").prop("checked", true);
                        }
                        if (a.BranchID[i] == "15") {
                            $("#BranchPadalarang").prop("checked", true);
                        }
                        if (a.BranchID[i] == "16") {
                            $("#BranchBuahBatu").prop("checked", true);
                        }
                        if (a.BranchID[i] == "17") {
                            $("#BranchJatiluhur").prop("checked", true);
                        }
                        if (a.BranchID[i] == "18") {
                            $("#BranchCikampek2").prop("checked", true);
                        }
                        if (a.BranchID[i] == "19") {
                            $("#BranchSurabayaGempol").prop("checked", true);
                        }
                        if (a.BranchID[i] == "20") {
                            $("#BranchSurabayaMojokerto").prop("checked", true);
                        }
                        if (a.BranchID[i] == "21") {
                            $("#BranchGempolPasuruan").prop("checked", true);
                        }
                    }
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
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'pegawai/save/' + save_method;
        var form = $('#form')[0];
        console.log(form);
        var formData = new FormData(form);
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            mimeType: "multipart/form-data", // upload
            contentType: false, // upload
            cache: false, // upload
            processData: false, //upload
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
                        img_preview("reset");
                        div_form("reset");
                    } else if (method == "keep") {
                        save_method = "update";
                        $("#form [name=UserID]").val(json.UserID);
                        $("#form [name=Code]").val(json.Code);
                        $("#form [name=Codex]").val(json.Code);
                    }
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

