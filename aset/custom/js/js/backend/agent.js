var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method     = "add";
var table;
var url_list    = host + "agent/list_data/";
var url_edit    = host + "agent/edit/";
var url_hapus   = host + "agent/delete/";
var url_simpan  = host + "agent/save/";
var addressno   = 0;
var contactno   = 0;
var modul       = "";
var app         = "";
var radius_val  = 0;
var page_name;
var menuid;
var ConnectToSAP;
var CountAddress;
var MarkerClick = true;
var NextID = "0";
var PrevID = "0";
var method_before;
var LastID;
$(document).ready(function() {
    dp    = $(".data-page, .page-data").data();
    modul        = dp.modul;
    app          = dp.app;
    page_name    = dp.page_name;
    menuid       = dp.menuid;
    id           = dp.id;
    ConnectToSAP = dp.connecttosap;
    Applikasi    = dp.aplikasi;
    data_post    = {
        Modul : modul,
        AgentID : id,
        MenuID : menuid,
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
        var data = table.row( this ).data();
        element = this.childNodes[1].childNodes[0];
        if(element.classList.contains("active")){
            element.classList.remove("active");
            $(this).removeClass("active");
        } else {
            $(".table div").removeClass("active");
            $(this).addClass("active");
            element.classList.add("active");
        }
    } ); 
    document.getElementById("add-attachment").addEventListener("change", readFile);
    if(id && id > 0){
        edit('<span data-id="'+id+'" data-method="view"></span>');
    }   

    if(Applikasi == "crane"){
        ChangeColorBackground('83a95c');
    } else if(Applikasi == "rental"){
        ChangeColorBackground('cc9b6d');
    } 
});
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form .main-input").next().show();
    $("#form .sub-input").attr("type","hidden");
    $("#form .select2").val('none').trigger('change');
    div_form("open");
}
function edit(element)
{  
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    LastID  = id;
    if(method == "view" || method == "view_next" || method == "view_prev"){
        save_method = 'view';
        method_before = 'view';
        $(".form-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    $.ajax({
        url : url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function(json){
            if(json.HakAkses == "rc"){
                console.log(json);
            }
            if(json.Status){
                div_form(method);
                a = json.Data;
                NextID = a.NextID;
                PrevID = a.PrevID;
                $("#form .select2").val('none').trigger('change');
                $("#form [name=AgentID]").val(a.AgentID);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Gender]").val(a.Gender);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=City]").val(a.City);
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=Email]").val(a.Email);
                // data-company
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorID").val(a.VendorID).trigger('change');
                $("#form [name=VendorName]").val(a.VendorName);
                
                $("#form [name=CompanyName]").val(a.CompanyName);
                $("#form [name=CompanyAddress]").val(a.CompanyAddress);
                $("#form [name=CompanyCity]").val(a.CompanyCity);
                $("#form [name=CompanyPhone]").val(a.CompanyPhone);
                // data keungan
                $("#form [name=BankName]").val(a.BankName);
                $("#form [name=BankBranch]").val(a.BankBranch);
                $("#form [name=AccountName]").val(a.AccountName);
                $("#form [name=AccountNumber]").val(a.AccountNumber);
                $("#form [name=Codex]").attr("disabled",true);
                if(method_before == "view"){
                    $("#form .main-input").next().hide();
                    $("#form .sub-input").attr("type","text");
                } else {
                    $("#form .main-input").next().show();
                    $("#form .sub-input").attr("type","hidden");
                }
                if(json.Data.ListAttachment && json.Data.ListAttachment.length > 0){
                    $.each(json.Data.ListAttachment,function(i,v){
                        add_attachment('update',v);
                    });
                }
                CheckBtnNextPrev();

            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            swal("Info","Terjadi kesalahan gagal mendapatkan data");
        }
    });
}
function reload_table()
{
    table.ajax.reload(null,false); //reload datatable ajax
}
var count_save = 0;
function save(element)
{
    btn_saving(element);
    if(save_method == "view"){
        swal("Info","Maaf anda tidak bisa melakukan transaksi");
        return;
    }

    if(count_save == 0){
        count_save = 1; 
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'agent/save/'+save_method;
        $.ajax({
            url : url,
            type: "POST",
            data: $('#form').serialize(),
            dataType: "JSON",
            success: function(json)
            {
                if(json.Status){
                    NextID = json.NextID;
                    PrevID = json.PrevID;
                    CheckBtnNextPrev();
                    
                    toastr.success(json.Message,"Information");
                    if(method == "close"){
                        div_form("close");
                    } else if(method == "new"){
                        save_method = "add";
                        div_form("reset");
                    } else if(method == "keep"){
                        save_method = "update";
                        $("#form [name=AgentID]").val(json.AgentID);
                        $("#form [name=Code], #form [name=Codex]").val(json.Code);
                    }
                    reload_table();
                    btn_saving(element,'reset');
                    count_save = 0;
                } else {
                    $('.form-group').removeClass('has-error');
                    $('.help-block').empty();
                    if(json.inputerror){                
                        for (var i = 0; i < json.inputerror.length; i++){
                            toastr.error(json.error_string[i],"Information");
                            $('[name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                            $('[name="'+json.inputerror[i]+'"]').next().text(json.error_string[i]);
                        }
                    }
                    if(json.popup){
                        swal("Info",json.Message);
                    }
                    btn_saving(element,'reset');
                    count_save = 0;
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                count_save = 0;
                console.log(jqXHR.responseText);
                btn_saving(element,'reset');
                toastr.error("Terjadi kesalahan gagal menyimpan data","Information");
            }
        });
    }
}
function hapus(id)
{
    swal({   title: "Info",   
             text: language_app.are_you_sure,   
             // type: "warning",   
             showCancelButton: true,   
             confirmButtonColor: "#DD6B55",   
             confirmButtonText: language_app.yes,   
             cancelButtonText: language_app.no,   
             closeOnConfirm: false,   
             closeOnCancel: false }, 
             function(isConfirm){   
                 if (isConfirm) { 
                    $.ajax({
                        url : url_hapus+id+"/nonactive",
                        type: "POST",
                        dataType: "JSON",
                        success: function(data){
                            reload_table();
                            swal("Info", language_app.success_deleted);   
                        },
                        error: function (jqXHR, textStatus, errorThrown){
                            swal("Info",language_app.error_transaction);
                            console.log(jqXHR.responseText);
                        }
                    });
                } else {
                    swal("Info", language_app.cancel_deleted);   
                } 
    });
}
function active(id){
    $.ajax({
        url : url_hapus+id+"/active",
        type: "POST",
        dataType: "JSON",
        success: function(data){
            reload_table();
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            swal("Info",language_app.error_transaction);
        }
    });
}
function GetVendor(element){
    dt    = $('#form [name=VendorID]').find(':selected').data();
    value = $('#form [name=VendorID]').find(':selected').val();
    if(dt){    
        // console.log(dt);
        $("#form [name=CompanyAddress]").val(dt.address);
        $("#form [name=CompanyCity]").val(dt.city);
        $("#form [name=CompanyPhone]").val(dt.phone);
        if(dt.ppn == 1){
            $("#PPN").prop("checked",true);
        } else {
            $("#PPN").prop("checked",false);
        }
    }
}