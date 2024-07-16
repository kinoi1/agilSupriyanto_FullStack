var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "coa/list_data/";
var url_edit    = host + "coa/edit/";
var url_hapus   = host + "coa/delete/";
var url_simpan  = host + "coa/save/";
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
    ConnectToSAP = data_page.connecttosap;
    data_post   = {
        MenuID : menuid,
    }

    if(modul == "pengaturan_coa"){
        pengaturan_coa();
    } else {
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
    }

});
function tambah(modul){
    save_method = 'add';
    $(".panel-form .panel-title").text("Tambah Data");
    div_form("open");
}
function edit(element)
{
    dt      = $(element).data();
    id      = dt.id;
    method  = dt.method;
    LastID  = id;
    if(method == "view" || method == "view_next" || method == "view_prev"){
        save_method = 'view';
        method_before = 'view';
        $(".panel-form .panel-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".panel-form .panel-title").text("Ubah Data");
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
                $("#form [name=COAID]").val(a.COAID);
                $("#form [name=CodeCOA]").val(a.Code);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Position]").val(a.Position);
                $("#form [name=Remark]").val(a.Remark);
                change_level(a.Position,a.ParentID);
                // if(json_respons.used>0){
                //     $('#form [name=Position]').attr('disabled', true);
                // }else{
                //     $('#form [name=Position]').attr('disabled', false);
                // }
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
        url = host + 'coa/save/'+save_method;
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
                        $("#form [name=COAID]").val(json.COAID);
                        $("#form [name=Code]").val(json.Code);
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
function hapus_data(id)
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
function active_data(id){
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
$('#form [name=Position]').change(function(){
    val = $(this).val();
    change_level(val);
});

function change_level(val,data){
    if(val == 1){
        $('.vparent').hide(300);
        $('.coa_select_level').empty();
    }else{
        $('.vparent').show(300);
        parent_level(val,data);
    }
}

function parent_level(position,data){
    coa_tb          = $(".coa_select"); 
    coa             = $(coa_tb).data();
    coa_tipe_op     = $(".coa_select option");
    $(".coa_select_level").empty();
    item = '<option value="none">Pilih COA</option>';
    $(".coa_select_level").append(item);
    $.each(coa_tipe_op,function(i,v){
        dt = $(v).data();
        item = '<option value="'+dt.id+'">'+dt.code+" - "+dt.name+'</option>';
        if(position == 2 && dt.position == 1){
            $(".coa_select_level").append(item);
        }else if(position == 3 && dt.position == 2){
            $(".coa_select_level").append(item);
        }else if(position == 4 && dt.position == 3){
            $(".coa_select_level").append(item);
        }
    });
    if(data){
        $('#ParentID').val(data);
    }
}
function pengaturan_coa(){
    url = host + "coa/load_pengaturan_coa";
    $.ajax({
        url : url,
        type: "GET",
        dataType: "JSON",
        success: function(json)
        {
            $.each(json.ListData,function(i,v){
                value = v.Value;
                Label = v.COA_CODE+' '+v.COA_NAME;
                Input = v.ID+'|'+v.COA_CODE+'|'+v.COA_NAME;
                $("[name="+v.Code+"Label]").val(Label);
                $("[name="+v.Code+"Input]").val(Input);
            });

            if(json.ListBank){
                if(json.ListBank.length > 0){
                    $.each(json.ListBank,function(i,v){
                        $(".div-bank-"+v.Code+' .COAName').val(v.COAName);
                        $(".div-bank-"+v.Code+' .COAInput').val(v.COAInput);
                        $(".div-bank-"+v.Code+' .Code').val(v.Code);
                        $(".div-bank-"+v.Code+' .BankCode').val(v.BankCode);
                        $(".div-bank-"+v.Code+' .BankName').val(v.BankName);
                        $(".div-bank-"+v.Code+' .AccountName').val(v.AccountName);
                        $(".div-bank-"+v.Code+' .AccountNumber').val(v.AccountNumber);
                        $(".div-bank-"+v.Code+' .BankBranch').val(v.BankBranch);
                    });
                }
            }
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            swal("gagal mengambil data pengaturan coa","","warning");
            console.log(jqXHR.responseText);
        }
    });
}

function save_pengaturan_coa(element)
{
    $(element).button('loading');
    url = host + "coa/save_pengaturan_coa";
    $.ajax({
        url : url,
        type: "POST",
        data: $('#form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
            if(data.Status){
                swal("Info","Transaksi berhasil");
            } else {
            }
            $(element).button('reset');
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            swal("Info","Terjadi kesalahan gagal melakukan transaksi");
            $(element).button('reset');
            console.log(jqXHR.responseText);
        }
    });
}