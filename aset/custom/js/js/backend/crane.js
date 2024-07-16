var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method     = "add";
var table;
var url_list    = host + "crane/list_data/";
var url_edit    = host + "crane/edit/";
var url_hapus   = host + "crane/delete/";
var url_simpan  = host + "crane/save/";
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
    data_page    = $(".data-page, .page-data").data();
    modul        = data_page.modul;
    app          = data_page.app;
    page_name    = data_page.page_name;
    menuid       = data_page.menuid;
    id           = data_page.id;
    ConnectToSAP = data_page.connecttosap;
    data_post   = {
        CraneID : id,
        MenuID : menuid,
    }
    table = $('#table').DataTable({
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
            "targets": [], //last column
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
    });
});
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
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
                $("#form [name=CraneID]").val(a.CraneID);
                $("#form [name=BackNo]").val(a.BackNo);
                $("#form [name=VehicleNo]").val(a.VehicleNo);
                $("#form [name=VehicleNoSTNK]").val(a.VehicleNoSTNK);
                $("#form [name=GpsNo]").val(a.GpsNo);
                $("#form [name=Merk]").val(a.Merk);
                $("#form [name=Type]").val(a.Type);
                $("#form [name=Year]").val(a.Year);
                $("#form [name=UnitCrane]").val(a.UnitCrane);
                $("#form [name=Capacity]").val(a.Capacity);
                $("#form [name=StandarFuel]").val(a.StandarFuel);
                $("#form [name=BBMPerHour]").val(a.BBMPerHour);
                $("#form [name=Color]").val(a.Color);
                $("#form [name=Cylinder]").val(a.Cylinder);
                $("#form [name=FrameNo]").val(a.FrameNo);
                $("#form [name=MachineNo]").val(a.MachineNo);
                $("#form [name=BPKBNo]").val(a.BPKBNo);
                $("#form [name=InName]").val(a.InName);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=STNKDate]").val(a.STNKDate);
                $("#form [name=STNKDate]").datepicker( "setDate" , a.STNKDate);
                $("#form [name=InsuranceDate]").val(a.InsuranceDate);
                $("#form [name=InsuranceDate]").datepicker( "setDate" , a.InsuranceDate);
                $("#form [name=KIRDate]").val(a.KIRDate);
                $("#form [name=KIRDate]").datepicker( "setDate" , a.KIRDate);
                $("#form [name=SIADate]").val(a.SIADate);
                $("#form [name=SIADate]").datepicker( "setDate" , a.SIADate);
                $("#form [name=SIAMigasDate]").val(a.SIAMigasDate);
                $("#form [name=SIAMigasDate]").datepicker( "setDate" , a.SIAMigasDate);
                $("#form [name=PlateDate]").val(a.PlateDate);
                $("#form [name=PlateDate]").datepicker( "setDate" , a.PlateDate);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=Percentage]").val(a.Percentage);
                $("#form [name=PercentageRigger]").val(a.PercentageRigger);
                $("#form [name=PercentageOperator]").val(a.PercentageOperator);

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
        url = host + 'crane/save/'+save_method;
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
                        $("#form [name=CraneID]").val(json.CraneID);
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