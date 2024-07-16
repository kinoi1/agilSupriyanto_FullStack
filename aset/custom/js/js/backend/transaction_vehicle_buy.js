var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "transaction_vehicle_buy/list_data/";
var url_edit    = host + "transaction_vehicle_buy/edit/";
var url_hapus   = host + "transaction_vehicle_buy/delete/";
var url_simpan  = host + "transaction_vehicle_buy/save/";
var url_approve = host + "transaction_vehicle_buy/approve_data/";
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
var CurrentDate;
var LastID;
var count_dd = 0;
var DATA_DETAIL;
$(document).ready(function() {
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
function load_datatables(){
    data_page    = $(".data-page, .page-data").data();
    modul        = data_page.modul;
    app          = data_page.app;
    page_name    = data_page.page_name;
    menuid       = data_page.menuid;
    ConnectToSAP = data_page.connecttosap;
    CurrentDate  = data_page.currentdate;
    id           = data_page.id;
    filter       = data_page.filter;

    StartDate    = $("#form-filter [name=StartDate]").val();
    EndDate      = $("#form-filter [name=EndDate]").val();
    DealerID   = $('#form-filter [name=DealerID]').find(':selected').val();
    ApproveStatus= $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post   = {
        Filter    : filter,
        InvoiceID : id,
        MenuID    : menuid,
        StartDate : StartDate,
        EndDate   : EndDate,
        DealerID   : DealerID,
        ApproveStatus : ApproveStatus,
    }
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
    if(id && id > 0){
    	edit('<span data-id="'+id+'" data-method="view"></span>');
    }
}
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=DealerID]").next().show();
    $("#form [name=DealerName]").attr("type","hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    close_panel_tambahan('<span data-method="reset"></span>');
    div_form("open");
    add_data_detail('add_new','<span data-method="new_data"></span>');
    $("#form [name=TransactionBuyVehicleID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
    approval_status_msg({method:"close"});

    $("#form [name=Remark]").val("1. Harga sudah termasuk kaca film\n\
2. Kendaraan terkirim menggunakan STCK\n\
3. Mohon pengiriman dapat dibantu secepatnya\n\
4. Mohon kendaraan terkirim sudah terpasang bungkus jok dan karpet\n\
5. STNK atas nama: PT. Multi Adhi Perkasa\n\
6. STNK memakai Plat B.");

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
        $(".form-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total").text("");
    $.ajax({
        url : url_edit + id,
        type: "GET",
        dataType: "JSON",
        success: function(json){
            if(json.HakAkses == "rc"){
                console.log(json);
            }
            if(json.Status){
                if(dt.method == "save_tambah_kendaraan"){

                } else {
                    close_panel_tambahan('<span data-method="reset"></span>');
                }
                div_form(method);
                $(".panel-form .input-group-addon").addClass("disabled");
                $(".panel-form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                approval_status_msg({method:"open",data:a});
                NextID = a.NextID;
                PrevID = a.PrevID;

                $("#form [name=TransactionBuyVehicleID]").val(a.TransactionBuyVehicleID);
                $("#form [name=DealerID]").val(a.DealerID);
                $("#form [name=DealerID").val(a.DealerID).trigger('change');
                $("#form [name=DealerName]").val(a.DealerName);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Date]").val(a.Date);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=TotalUnit]").val(a.TotalQty);
                $("#form [name=TotalPrice]").val(a.TotalPrice);


                $(".table-data-detail tfoot .item-total1").text(a.TotalQty);
                $(".table-data-detail tfoot .item-total5").text(a.TotalPrice);
                if(method_before == "view"){
                    $("#form [name=DealerID]").next().hide();
                    $("#form [name=DealerName]").attr("type","text");
                } else {
                    $("#form [name=DealerID]").next().hide();
                    $("#form [name=DealerName]").attr("type","text");
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=TransactionBuyVehicleID], #form [name=Remark], #add-attachment").attr("disabled",false);
                    $("#form [name=TransactionBuyVehicleID], #form [name=Remark]").removeClass("text");
                }
                if(json.Data.ListData){
                    if(json.Data.ListData.length > 0){
                        $.each(json.Data.ListData,function(i,v){
                            add_data_detail(method_before,v,json.Data);
                        })
                    } else {
                        add_data_detail('empty');
                    }
                } else {
                    add_data_detail('empty');
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
        $('div, input, span, form, td, tr').removeClass('has-error');
        $(".item-alert").hide();
        $('.help-block').empty();
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'transaction_vehicle_buy/save/'+save_method;
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
                        // div_form("reset");
                        tambah();
                    } else if(method == "keep"){
                        save_method = "update";
                        $("#form [name=TransactionBuyVehicleID]").val(json.TransactionBuyVehicleID);
                        $("#form [name=Code]").val(json.Code);
                        $("#form [name=Codex]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="'+json.TransactionBuyVehicleID+'" data-method="edit"></span>');
                    }
                    reload_table();
                    btn_saving(element,'reset');
                    count_save = 0;
                    $(".FileB64Attachment, .FormatFileB64Attachment").remove();
                } else {
                    $('.form-group').removeClass('has-error');
                    $('.help-block').empty();
                    if(json.inputerror){                
                        console.log(json);
                        for (var i = 0; i < json.inputerror.length; i++){
                            toastr.error(json.error_string[i],"Information");
                            if(json.type[i] == "alert"){
                                $('[name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                            } else if(json.type[i] == "alert_2"){
                                $('[name="'+json.inputerror[i]+'"]').parent().parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                            } else {
                                $('[name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                                $('[name="'+json.inputerror[i]+'"]').next().text(json.error_string[i]);
                            }
                        }
                    }
                    if(json.inputerrordetail){
                        $.each(json.inputerrordetail,function(i,v){
                            toastr.error(v,"Information");
                            if(json.inputerrordetailid[i] != ""){                        
                                $("."+json.inputerrordetailid[i]).addClass("has-error");
                                $("."+json.inputerrordetailid[i]+' .item-alert').show();
                            }
                        });
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
             text: "Apakah anda yakin akan membatalkan transaksi ini ?",   
             // type: "warning",   
             showCancelButton: true,   
             confirmButtonColor: "#DD6B55",   
             confirmButtonText: "Ya",   
             cancelButtonText: "Tidak",   
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
                            swal("Info", "Transaksi berhasil dibatalkan");   
                        },
                        error: function (jqXHR, textStatus, errorThrown){
                            swal("Info", "Terjadi kesalahan gagal melakukan transaksi data");
                            console.log(jqXHR.responseText);
                        }
                    });
                } else {
                    swal("Info", "Transaksi tidak jadi");   
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
function approve_data(element)
{
    dt     = $(element).data();
    action = dt.action;
    id     = dt.id;
    status = dt.status;
    remark = "";
    if(action == "agree"){
        pesan = "Apa anda yakin akan menyetujui data ini ?";
    } else if(action == "decline"){
        pesan = "Apa anda yakin akan menolak data ini ?";
    } else if(action == "send"){
        pesan = "Apa anda yakin akan mengirim ulang data ini ?";
    } else {
        return false;
    }
    if(action == "decline"){
        htmltext = pesan + "<textarea class='form-control' id='RemarkTolak' style='margin-top:20px;' placeholder='tulis alasan anda menolak'></textarea>";
        swal({
          title: "Info",
          text: htmltext,
          html: true,
          showCancelButton: true,
          closeOnConfirm: false,
          confirmButtonColor: "#DD6B55",   
          showLoaderOnConfirm: true,
          animation: "slide-form-top",
          inputPlaceholder: ""
        }, function(inputValue) {
          var remark        = $('#RemarkTolak').val();
          if(remark === "") {
            swal.showInputError("Keterangan tidak boleh kosong");
            return false
          } else{
            approve_data_save({action:action,id:id,status:status,remark:remark});
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
            closeOnCancel: true }, 
            function(isConfirm){   
                if (isConfirm) { 
                    approve_data_save({action:action,id:id,status:status,remark:remark});
                }
        });
    }
}
function approve_data_save(element){
    if(element && element.action){
        dt = element;
        action  = dt.action;
        id      = dt.id;
        status  = dt.status;
        remark  = dt.remark;
    } else {
        dt = $(element).data();
        action  = dt.action;
        id      = dt.id;
        status  = dt.status;
        remark  = dt.remark;
    }
    data_post = {
        TransactionBuyVehicleID : id,
        ApproveStatus : status,
        ApproveRemark : remark
    }
    $.ajax({
        url : host+'transaction_vehicle_buy/approve_data/',
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(json){
            if(json.Status){
                toastr.success(json.Message,"Information");
                reload_table();
            } else {
                toastr.error(json.Message,"Information");
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            toastr.error("Terjadi kesalahan gagal mengirim data","Information");
            console.log(jqXHR.responseText);
        }
    });
}

function add_data_detail(method,element,main_data){
    count_dd    = 1 + count_dd;
    rowid       = "item-detail-"+count_dd;
    td_width    = "80px";
    td_width2   = "130px";
    i_search    = "";
    i_remove    = "";
    i_alert     = "";
    disabled    = "";
    TransactionBuyVehicleID = "";
    TransactionBuyVehicleDetailID = "";
    TransactionDetailID = "";
    ID          = "";
    Merk        = "";
    Category    = "";
    Type        = "";
    Tranmission = "";
    Color       = "";
    Year        = "";
    Qty         = "";
    Price       = "";
    Diskon      = "";
    NettPrice     = "";
    TotalPrice    = "";
    addclass      = "";
    ApproveStatus = "";
    Active        = "";
    if(element && element.ID){
        a = element;
        if(method == "view"){
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionBuyVehicleID = a.TransactionBuyVehicleID;
        TransactionBuyVehicleDetailID = a.TransactionBuyVehicleDetailID;
        TransactionDetailID = a.TransactionDetailID;
        ID          = a.ID;
        Merk        = a.Merk;
        Category    = a.Category;
        Type        = a.Type;
        Tranmission = a.Tranmission;
        TranmissionLabel = a.TranmissionLabel;
        Color       = a.Color;
        Qty         = a.Quantity;
        Year        = a.Year;
        Price       = a.Price;
        Diskon      = a.Diskon;
        NettPrice   = a.NettPrice;
        TotalPrice  = a.TotalPrice;

        ApproveStatus = main_data.ApproveStatus;
        Active        = main_data.Active;

    } else {
        dt = $(element).data();
    }
    if(method == "add_new"){
        i_alert  = '<i class="item-alert sembunyi ti-alert"></i>'
        // i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="'+rowid+'"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a> ';
    }
    if(method == "empty"){
        item = '<tr class="empty"><td colspan="10">Data tidak ada</td></tr>';
    } else if(method == "view" || method == "update" || method == "edit"){   
        datadiv = '';
        datadiv += 'data-method="tambah_kendaraan" ';
        datadiv += 'data-transactionbuyid="'+TransactionBuyVehicleID+'" ';
        datadiv += 'data-transactionbuydetailid="'+TransactionBuyVehicleDetailID+'" ';
        datadiv += 'data-merk="'+Merk+'" ';
        datadiv += 'data-category="'+Category+'" ';
        datadiv += 'data-type="'+Type+'" ';
        datadiv += 'data-tranmission="'+Tranmission+'" ';
        datadiv += 'data-year="'+Year+'" ';
        datadiv += 'data-color="'+Color+'" ';
        datadiv += 'data-otrprice="'+NettPrice+'" ';

        itemx = '<table class="table table-normal" style="padding:10px;margin:0px;">';
        itemx += '<thead>';
        itemx += '<tr>';
        itemx += '<td>No. Induk Kendaraan</td>';
        itemx += '<td>No. Polisi</td>';
        itemx += '<td>No. Aset</td>';
        itemx += '<td>No. STNK</td>';
        itemx += '<td>Atas Nama</td>';
        itemx += '<td>Merk</td>';
        itemx += '<td>Jenis</td>';
        itemx += '<td>Tranmission</td>';
        itemx += '</tr>';
        itemx += '</thead>';
        itemx += '<tbody>';
        NO = 0;
        $.each(a.ListVehicle,function(i,v){
            NO += 1;
            itemx += '<tr>';
            itemx += '<td><a href="'+host+'/backend/kendaraan?id='+v.VehicleID+'" target="_blank">'+v.VehicleIndexNo+'</a></td>';
            itemx += '<td>'+v.VehicleNo+'</td>';
            itemx += '<td>'+v.Code+'</td>';
            itemx += '<td>'+v.STNKNo+'</td>';
            itemx += '<td>'+v.InName+'</td>';
            itemx += '<td>'+v.Merk+'</td>';
            itemx += '<td>'+v.Category+'</td>';
            itemx += '<td>'+v.TranmissionLabel+'</td>';
            itemx += '</tr>';
        });
        itemx += '</tbody>';
        trclass = "";
        if(a.ListVehicle.length < Qty){
            trclass = "tr-red";
            if(ApproveStatus == 1){        
                itemx += '<tfoot>';
                itemx += '<tr><td colspan="8"><a href="javascript:void(0);" onclick="tambah_kendaraan(this)" '+datadiv+'>+ Input Data Kendaraan</a></td></tr>';
                itemx += '</tfoot>';
            } else {
                if(ApproveStatus == 0){
                    pesanx = "Transaksi beli kendaraan belum disetujui";
                } else if(ApproveStatus == 2){
                    pesanx = "Transaksi beli kendaraan ditolak";
                } else if(ApproveStatus == 3){
                    pesanx = "Transaksi beli kendaraan dibatalkan";
                } else {
                    pesanx = "Data Tidak ada";
                }
                itemx += '<tfoot>';
                itemx += '<tr><td colspan="8">'+pesanx+'</td></tr>';
                itemx += '</tfoot>';
            }
        }
        itemx += '</table>';


        item = '<tr class="pointer '+trclass+' item '+rowid+'" data-toggle="collapse" data-target="#tr-'+rowid+'">';
        item += '<td class="text-center"><i class="fa fa-search"></i></td>';
        item += '<td>'+Merk+'</td>';
        item += '<td>'+Type+'</td>';
        item += '<td>'+Category+'</td>';
        item += '<td>'+TranmissionLabel+'</td>';
        item += '<td>'+Color+'</td>';
        item += '<td>'+Year+'</td>';
        item += '<td>'+Qty+'</td>';
        item += '<td class="text-right">'+Price+'</td>';
        item += '<td class="text-right">'+Diskon+'</td>';
        item += '<td class="text-right">'+NettPrice+'</td>';
        item += '<td class="text-right">'+TotalPrice+'</td>';
        item += '</tr>';

        item += '<tr id="tr-'+rowid+'" class="collapse">';
        item += '<td colspan="112" style="background: rgba(0, 0, 0, 0.1);">';
        item += itemx;
        item += '</td>';
        item += '</tr>';

    } else {    
        input_h  = '<input type="hidden" name="DetailCount[]" class="item-count" value="'+rowid+'">';
        input_h  += '<input type="hidden" name="TransactionDetailID[]" value="'+TransactionDetailID+'">';
        input_h  += '<input type="hidden" name="DetailID[]" class="item-id" value="'+ID+'">';
        selected1 = "";
        selected2 = "";
        if(Tranmission == "manual"){
            selected1 = 'selected="selected"';
        } else {
            selected2 = 'selected="selected"';
        }
        item = '<tr class="item '+rowid+'">';
        item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
        item += '<td><input name="DetailMerk[]" class="item-merk" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()" value="'+Merk+'"></td>';
        item += '<td><input name="DetailType[]" class="item-type" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Type+'"></td>';
        item += '<td><input name="DetailCategory[]" class="item-category" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Category+'"></td>';
        item += '<td style="font-variant: small-caps;">';
        item += '<select name="DetailTranmission[]">';
        item += '<option value="manual" '+selected1+'>M/T</option>';
        item += '<option value="automatic" '+selected2+'>A/T</option>';
        item += '</select>';
        item += '</td>';
        item += '<td><input name="DetailColor[]" class="item-color" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Color+'"></td>';
        item += '<td><input name="DetailYear[]" class="item-year" type="text" maxlength="4" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Year+'"></td>';
        item += '<td><input name="DetailQty[]" class="item-qty" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Qty+'"></td>';
        item += '<td class="text-right"><input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-format="duit" data-rowid="'+rowid+'" style="width:'+td_width2+';"></td>';
        item += '<td class="text-right"><input name="DetailDiskon[]" class="item-diskon" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-format="duit" data-rowid="'+rowid+'" style="width:'+td_width2+';"></td>';
        item += '<td class="text-right"><input name="DetailNettPrice[]" class="item-nett-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+';"></td>';
        item += '<td class="text-right"><input name="DetailTotalPrice[]" class="item-total-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+';"></td>';
        item += '</tr>';
        // <input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
    }
    // console.log(item);
    $("#tbody-table-detail-1").append(item);
    input_uppersize();
}
function remove_data_detail(element){
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    $("."+dt.rowid).remove();
    calculation_total_price();
}
function calculation_total_price(){
    total1 = 0;
    total2 = "";
    total3 = "";
    total4 = "";
    total5 = 0;
    list = $("#table-detail-1.table-data-detail tbody tr");
    if(list.length > 0){
        $.each(list,function(i,v){
            rowid = v.classList[1];
            class_rowid = "."+rowid;
            id    = $(class_rowid + " .item-id").val();
            merk  = $(class_rowid + " .item-merk").val();
            qty   = $(class_rowid + " .item-qty").val();
            price = $(class_rowid + " .item-price").val();
            diskon = $(class_rowid + " .item-diskon").val();
            if(id == ""){id=0;}
            if(merk == ""){merk="";}
            if(qty == ""){qty=0;}
            if(price == ""){price=0;} else { price = price.replace(/\,/g,'');}
            if(diskon == ""){diskon=0;} else { diskon = diskon.replace(/\,/g,'');}
            id    = parseInt(id);
            qty   = parseInt(qty);
            price = parseInt(price);
            diskon = parseInt(diskon);
            total_bill = 0;
            if(merk && merk != "" && merk.length > 0){
                nett_price = price - diskon;
                total_price = nett_price * qty;
                total1 += qty;
                total5 += total_price;
                $(class_rowid + " .item-nett-price").val(number_format(nett_price));
                $(class_rowid + " .item-total-price").val(number_format(total_price));
            }
        });
    }
    $(".table-data-detail tfoot .item-total1").text(number_format(total1));
    $(".table-data-detail tfoot .item-total2").text(number_format(total2));
    $(".table-data-detail tfoot .item-total3").text(number_format(total3));
    $(".table-data-detail tfoot .item-total4").text(number_format(total4));
    $(".table-data-detail tfoot .item-total5").text(number_format(total5));
    $("#form [name=TotalUnit]").val(number_format(total1));
    $("#form [name=TotalPrice]").val(number_format(total5));
}
function GetDataVendor(element){
    dt    = $('#form [name=DealerID]').find(':selected').data();
    value = $('#form [name=DealerID]').find(':selected').val();
    phone   = "";
    address = "";
    if(dt){
        if(dt.phone){
            phone   = dt.phone;
        }
        if(dt.address){
            address = dt.address;
        }
    }
    // $("[name=Phone]").val(phone);
    // $("[name=Address]").val(address);
}
function HitungTagihan(element){
	dt = $(element).data();
	id = dt.id;
	swal({   
        title: "Info",   
        text: "Apakah anda yakin akan menghitung ulang tagihan kontrak ini ?",   
        showCancelButton: true,   
        confirmButtonText: "Ya",   
        cancelButtonText: "Tidak",   
        closeOnConfirm: true,   
        closeOnCancel: true }, 
        function(isConfirm){   
            if (isConfirm) { 
               $.ajax({
			        url : host+'transaction_vehicle_buy/HitungTagihan/'+id+'/post',
			        type: "POST",
			        data: data_post,
			        dataType: "JSON",
			        success: function(json){
			            if(json.Status){
			                toastr.success(json.Message,"Information");
			            } else {
			                toastr.error(json.Message,"Information");
			            }
			        },
			        error: function (jqXHR, textStatus, errorThrown){
			            toastr.error("Terjadi kesalahan gagal mengirim data","Information");
			            console.log(jqXHR.responseText);
			        }
			    });
            }
    });
}
function close_panel_tambahan(element){

    dt = $(element).data();
    if(dt.method == "close"){
        swal({   
            title: "Info",   
            text: "Apakah anda yakin akan menutup form ini ?",   
            showCancelButton: true,   
            confirmButtonText: "Ya",   
            cancelButtonText: "Tidak",   
            closeOnConfirm: true,   
            closeOnCancel: true }, 
            function(isConfirm){   
                if (isConfirm) { 
                    $(".panel-form-tambahan, .panel-form-tambahan .form-design-1").addClass("sembunyi");
                    $(".panel-form-tambahan, .panel-form-tambahan .form-design-1").hide();
                    $('html,body').animate({scrollTop: $("#table-detail-1").offset().top - 120},'slow');
                    $(".panel-form-tambahan input, .panel-form-tambahan textarea").val("");
                }
        });
    } else {
        $(".panel-form-tambahan, .panel-form-tambahan .form-design-1").addClass("sembunyi");
        $(".panel-form-tambahan, .panel-form-tambahan .form-design-1").hide();
        $(".panel-form-tambahan input, .panel-form-tambahan textarea").val("");
        if(dt.method == "reset"){

        } else {
            $('html,body').animate({scrollTop: $("#table-detail-1").offset().top - 120},'slow');
        }
    }

}
var dt_before = [];
function tambah_kendaraan(element){

    $(".panel-form-tambahan .form-design-1").addClass("sembunyi");
    $(".panel-form-tambahan .form-design-1").hide();

    $(".panel-form-tambahan").removeClass("sembunyi");
    $(".panel-form-tambahan").show();
    $(".panel-form-tambahan input, .panel-form-tambahan select, .panel-form-tambahan textarea, .panel-form-tambahan .input-group-addon").removeClass("text");
    $(".panel-form-tambahan input, .panel-form-tambahan select, .panel-form-tambahan textarea, .panel-form-tambahan .input-group-addon, .panel-form-tambahan .add-attachment").removeClass("disabled");
    $(".panel-form-tambahan input, .panel-form-tambahan select, .panel-form-tambahan textarea").attr("disabled",false);

    $(".panel-form-tambahan #form-lease, .panel-form-tambahan #form-insurance").hide();
    $(".panel-form-tambahan #form-vehicle").show();
    if($(".panel-form-tambahan #form-vehicle div").hasClass("div-tranmission")){
        $("#form-vehicle .div-tranmission").empty();
        div_tranmission = ' <label class="control-label">Tranmisi</label>';
        div_tranmission += '<input type="text" class="form-control" name="Tranmission">';
        div_tranmission += '<span class="help-block"></span>';
        $("#form-vehicle .div-tranmission").append(div_tranmission);
    }
    $("[name=Codex]").attr("disabled",true);
    dt = $(element).data();
    if(dt_before.length == 0){
        dt_before = dt;
    } else {
        dt = dt_before;
    }
    if(dt.method == "tambah_kendaraan"){    
        TransactionBuyVehicleID = dt.transactionbuyid;
        TransactionBuyVehicleDetailID = dt.transactionbuydetailid;
        Merk = dt.merk;
        Category = dt.category;
        Type = dt.type;
        Tranmission = dt.tranmission;
        Year = dt.year;
        Color = dt.color;
        OTRPrice = dt.otrprice;
        if(Tranmission == "automatic"){
            Tranmission = "A/T";
        } else {
            Tranmission = "M/T";
        }
        if(dt_before.length == 0){
            $('[name=VehicleID]').val("");
        }
        $('[name=TransactionBuyVehicleID]').val(TransactionBuyVehicleID);
        $('[name=TransactionBuyVehicleDetailID]').val(TransactionBuyVehicleDetailID);
        $('[name=Merk]').val(Merk);
        $('[name=Category]').val(Category);
        $('[name=Type]').val(Type);
        $('[name=Tranmission]').val(Tranmission);
        $('[name=Year]').val(Year);
        $('[name=Color]').val(Color);
        $('[name=OTRPrice]').val(OTRPrice);
        $('[name=Merk]').val(Merk).attr("readonly",true);
        $('[name=Category]').val(Category).attr("readonly",true);
        $('[name=Type]').val(Type).attr("readonly",true);
        $('[name=Tranmission]').val(Tranmission).attr("readonly",true);
        $('[name=Year]').val(Year).attr("readonly",true);
        $('[name=Color]').val(Color).attr("readonly",true);
        $('[name=OTRPrice]').val(OTRPrice).attr("readonly",true);
        $(".panel-form-tambahan .div-btn-prev, .panel-form-tambahan .div-btn-next").hide();
    } else {
        dt_before = [];
        $(".panel-form-tambahan .list-attachment .item-attachment").remove();
    }
    $('html,body').animate({scrollTop: $("#form-vehicle").offset().top - 70},'slow');
}
function tambah_leasing(){

    $(".panel-form-tambahan .form-design-1").addClass("sembunyi");
    $(".panel-form-tambahan .form-design-1").hide();
    $(".panel-form-tambahan #form-lease").removeClass("sembunyi");
    $(".panel-form-tambahan #form-lease").show();
    $('html,body').animate({scrollTop: $("#form-lease").offset().top - 70},'slow');
}
function save_tambah_leasing(element){
    $(".panel-form-tambahan #form-lease").hide();
    $(".panel-form-tambahan #form-lease").addClass("sembunyi");
    tambah_asuransi();
}
function tambah_asuransi(){

    $(".panel-form-tambahan .form-design-1").addClass("sembunyi");
    $(".panel-form-tambahan .form-design-1").hide();
    $(".panel-form-tambahan #form-insurance").removeClass("sembunyi");
    $(".panel-form-tambahan #form-insurance").show();
    $('html,body').animate({scrollTop: $("#form-insurance").offset().top - 70},'slow');
}
function save_tambah_asuransi(element){
    swal({   
        title: "Info",   
        text: "Apakah anda yakin akan menyelesaikannya ?",   
        showCancelButton: true,   
        confirmButtonText: "Ya",   
        cancelButtonText: "Tidak",   
        closeOnConfirm: true,   
        closeOnCancel: true }, 
        function(isConfirm){   
            if (isConfirm) { 
                save_detail('<span data-modul="insurance"></span>');
            }
    });
}
function save_detail(element){
    dt = $(element).data();
    modul = dt.modul;
    VehicleID = $("#form-vehicle [name=VehicleID]").val();
    url = host;
    if(VehicleID && VehicleID > 0){
        save_methodx = "update";
    } else {
        save_methodx = "add";
    }
    if(modul == "vehicle"){
        url = host + 'vehicle/save/'+save_methodx;
        data_post = $('#form-vehicle').serialize();
    } else if(modul == "lease"){
        url = host + 'vehicle/save_lease/';
        data_post = $('#form-lease').serialize();
    } else if(modul == "insurance"){
        url = host + 'vehicle/save_insurance/';
        data_post = $('#form-insurance').serialize();
    }
    $.ajax({
        url : url,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(json)
        {
            console.log(json);
            if(json.Status){
                $('.form-group').removeClass('has-error');
                $('.help-block').empty();
                if(modul == "vehicle"){
                    $("[name=VehicleID]").val(json.VehicleID);
                    $("#form-vehicle [name=Code]").val(json.Code);
                    $("#form-vehicle [name=Codex]").val(json.Code);
                    TransactionBuyVehicleID = $("#form [name=TransactionBuyVehicleID]").val();
                    edit('<span data-id="'+TransactionBuyVehicleID+'" data-method="save_tambah_kendaraan"></span>');
                    btn_saving(element,'reset');
                    count_save = 0;
                    $(".panel-form-tambahan #form-vehicle").hide();
                    $(".panel-form-tambahan #form-vehicle").addClass("sembunyi");
                    $(".panel-form-tambahan .FileB64Attachment").val("");
                    tambah_leasing();
                    reload_table();
                } else if(modul == "lease"){
                    $("[name=VehicleLeaseID]").val(json.VehicleLeaseID);
                    tambah_asuransi();
                } else if(modul == "insurance"){
                    $("[name=VehicleInsuranceID]").val(json.VehicleInsuranceID);
                    close_panel_tambahan('<span></span>');
                }
            } else {
                $('.form-group').removeClass('has-error');
                $('.help-block').empty();
                if(json.inputerror){                
                    console.log(json);
                    for (var i = 0; i < json.inputerror.length; i++){
                        toastr.error(json.error_string[i],"Information");
                        if(json.type[i] == "alert"){
                            $('[name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                            $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                        } else if(json.type[i] == "alert_2"){
                            $('[name="'+json.inputerror[i]+'"]').parent().parent().addClass('has-error'); 
                            $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                        } else {
                            $('[name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                            $('[name="'+json.inputerror[i]+'"]').next().text(json.error_string[i]);
                        }
                    }
                }
                if(json.inputerrordetail){
                    $.each(json.inputerrordetail,function(i,v){
                        toastr.error(v,"Information");
                        if(json.inputerrordetailid[i] != ""){                        
                            $("."+json.inputerrordetailid[i]).addClass("has-error");
                            $("."+json.inputerrordetailid[i]+' .item-alert').show();
                        }
                    });
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