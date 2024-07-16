var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "transaction_contract/list_data/";
var url_edit    = host + "transaction_contract/edit/";
var url_hapus   = host + "transaction_contract/delete/";
var url_simpan  = host + "transaction_contract/save/";
var url_approve = host + "transaction_contract/approve_data/";
var url_price   = host + "transaction_contract/save_price_detail/";
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
    
    $("#table-detail-2 #tbody-table-detail-2 .fa-search").hide();
    $("#item-customer").hide();
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
    Type         = $('#form-filter [name=Type]').find(':selected').val();
    CustomerID   = $('#form-filter [name=CustomerID]').find(':selected').val();
    ApproveStatus= $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post   = {
        Filter    : filter,
        InvoiceID : id,
        MenuID    : menuid,
        StartDate : StartDate,
        EndDate   : EndDate,
        Type      : Type,
        CustomerID   : CustomerID,
        ApproveStatus : ApproveStatus,
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
    if(id && id > 0){
    	edit('<span data-id="'+id+'" data-method="view"></span>');
    }
}
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=CustomerID]").next().show();
    // $("#form [name=CustomerName]").attr("type","hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    div_form("open");
    $(".div-customer-novasi").hide();
    SelectType();
    add_data_detail('add_new','<span data-method="new_data"></span>');
    $("#form [name=TransactionContractID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
    // $("#form #PPNx").attr("disabled",true);
    $("#history-addendum").hide();
    $("#history-novasi").hide();
    $("#RentalPeriode").attr('readonly', false);
    $("#StartDate").attr('disabled', false);
    $("#EndDate").attr('disabled', false);
    $("#item-customer").hide();
    $(".item-hidden").show();
    $("[name=TypeCategory]").change(function() { ChangeTypeCategory(); });
    approval_status_msg({method:"close"});
}
function edit(element)
{
    dt      = $(element).data();
    id      = dt.id;
    method  = dt.method;
    LastID  = id;
    NovasiKontrak = 0;
    AddendumKontrak = 0;
    if(method == "view" || method == "view_next" || method == "view_prev"){
        save_method = 'view';
        method_before = 'view';
        $(".form-title").text("Lihat Data");
    } else if(method == "novasi_kontrak"){
        save_method     = 'add';
        method_before   = 'view';
        method          = 'edit';
        NovasiKontrak   = 1;
        AddendumKontrak = 1;
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").hide();
    $(".table-data-detail tfoot .item-total").text("");
    $(".div-customer-novasi").hide();
    $("#history-addendum").show();
    $("#history-novasi").show();
    $("[name=TypeCategory]").off("change");

    data_post = {
    	NovasiKontrak : NovasiKontrak,
        AddendumKontrak : AddendumKontrak
    }

    $("#RentalPeriode").attr('readonly', false);
    $("#StartDate").attr('disabled', false);
    $("#EndDate").attr('disabled', false);
    $.ajax({
        url : url_edit + id,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(json){
            if(json.HakAkses == "rc"){
                console.log(json);
            }
            if(json.Status){
                div_form(method);
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                approval_status_msg({method:"open",data:a});
                NextID = a.NextID;
                PrevID = a.PrevID;
                console.log(method);
                console.log(method_before);
                $("#form [name=TransactionContractID]").val(a.TransactionContractID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Type]").val(a.Type);
                SelectType();
                $("#form [name=RFQCode]").val(a.RFQCode);
                $("#form [name=TransactionRFQID]").val(a.TransactionRFQID);
                $("#form [name=TransactionRFQID]").attr("disabled",false);
                $("#form [name=CustomerContractCode]").val(a.CustomerContractCode);
                $("#form [name=ContractDate]").val(a.ContractDate);
                $("#form [name=StartDate]").val(a.StartDate);
                $("#form [name=EndDate]").val(a.EndDate);
                $("#form [name=DueDate]").val(a.DueDate);
                $("#form [name=RentalPeriode]").val(a.RentalPeriode);
                $("#form [name=BillingSystem]").val(a.BillingSystem);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Phone]").val(a.Phone);
                // console.log($("#form [name=Phone]"));
                $("#form [name=Address]").val(a.Address);
                $("#form [name=CustomerID]").val(a.CustomerID);
                $("#form [name=CustomerID").val(a.CustomerID).trigger('change');
                $("#form [name=CustomerName]").val(a.CustomerName);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=RemarkPool]").val(a.RemarkPool);
                $("#form [name=TotalPrice]").val(a.TotalPrice);
                $("#form [name=DetailTotalPriceFIX]").val(a.DetailTotalPrice);
                $("#form [name=TypeCategory]").val(a.TypeCategory);
                if(a.PPN == 1){
                    $("[name=PPN]").prop("checked",true);
                    $("[name=PPN]").val(1);
                } else {
                    $("[name=PPN]").prop("checked",false);
                    $("[name=PPN]").val(0);
                }
                $("form [name=BWCode").val(a.BWCode);
                $("form [name=BWStartDate").val(a.BWStartDate);
                $("form [name=BWEndDate").val(a.BWEndDate);
                $("form [name=BWBankName").val(a.BWBankName);
                $("form [name=BWAccountNo").val(a.BWAccountNo);
                if(a.BWWithdrawalPeriode == "01-01-1970"){
                    BWWithdrawalPeriode = "";
                } else {
                    BWWithdrawalPeriode = a.BWWithdrawalPeriode;
                }
                $("form [name=BWWithdrawalPeriode").val(BWWithdrawalPeriode);
                $("form [name=BWPrice").val(a.BWPrice);
                $("form [name=BWHoldPrice").val(a.BWHoldPrice);
                $("form [name=BWRemark").val(a.BWRemark);

                $("#form [name=StartDatex]").val(a.StartDate);
                $("#form [name=EndDatex]").val(a.EndDate);
                $("#form [name=RentalPeriodex]").val(a.RentalPeriode);
                
                // CEK RFQ JIKA JENIS KONTRAK YAITU BELUM ADA KONTRAK / LAIN-LAIN
                if(a.TransactionRFQID == 0 || a.TransactionRFQID == ""){
                    $("#item-rfq").hide();
                }
                $("#table-detail-1 tfoot .item-total1").text(a.TotalQty1);
                $("#table-detail-1 tfoot .item-total3").text(a.TotalPriceMonth1);
                $("#table-detail-1 tfoot .item-total4").text(a.TotalPrice1);

                $("#table-detail-2 tfoot .item-total1").text(a.TotalQty2);
                $("#table-detail-2 tfoot .item-total3").text(a.TotalPriceMonth2);
                $("#table-detail-2 tfoot .item-total4").text(a.TotalPrice2);

                if(method_before == "view"){
                    $("#form [name=CustomerID]").next().hide();
                    $("#form [name=CustomerName]").attr("type","text");
                } else {
                    $("#form [name=CustomerID]").next().hide();
                    $("#form [name=CustomerName]").attr("type","text");
                    $(".panel-form .input-group-addon").addClass("disabled");
                    $(".panel-form .input-group-addon").addClass("text");                 
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=TransactionContractID],#form [name=CustomerContractCode], #form [name=Remark], .panel-BW input, .panel-BW textarea, .panel-BW .input-group-addon, #add-attachment").attr("disabled",false);
                    $("#form [name=TransactionContractID],#form [name=CustomerContractCode], #form [name=Remark], .panel-BW input, .panel-BW textarea, .panel-BW .input-group-addon").removeClass("text");
                }
                // CEK APAKAH TYPE KONTRAK "BLM ADA KONTRAK" ATAU "LAIN-LAIN"
                // if((a.TypeCategory == "4" || a.TypeCategory == "5") && a.CheckSendVehicle.CountResult == "0" && method_before != "view"){
                // if((a.TypeCategory == "4" || a.TypeCategory == "5")  && method_before == "edit"){
                // // if(method_before == "view"){
                //     $("[name=TypeCategory]").prop("onchange", null);
                //     $(".panel-form .input-group-addon").removeClass("disabled");    
                    
                //     $("#form [name=NewCustomerID]").val(a.CustomerID);
                //     $("#form [name=NewCustomerName]").val(a.CustomerName);
                //     $("#form [name=NewCustomerID]").next().hide();
                //     $("#form [name=NewCustomerName]").attr("type","text");
                //     // $("#form input, #form select,#form textarea").addClass("text");
                //     $("#form input, #form select,#form textarea").attr("disabled",false);
                //     $("#form [name=TransactionContractID],#form [name=CustomerContractCode], #form [name=Remark], .panel-BW input, .panel-BW textarea, .panel-BW .input-group-addon, #add-attachment").attr("disabled",false);
                //     method_before = 'novasi_kontrak';
                // } 
                if(NovasiKontrak == 1 && a.Addendum != 1){
                    $("#form [name=NovasiKontrak]").val(NovasiKontrak);
                    $("#form [name=NovasiType]").val(a.Type);
                    $(".form-title").text("Novasi Kontrak");
                    // $(".table-data-detail tfoot .action").show();
                    $(".table-data-detail tfoot .item-total1").text("");
                    $(".table-data-detail tfoot .item-total3").text("");
                    $(".table-data-detail tfoot .item-total4").text("");
                    $(".div-customer-novasi").show();

                    ID_DIV = "#form [name=RFQCode], #form [name=Type]";
                    $(ID_DIV).addClass("text");
                    $(ID_DIV).attr("disabled",true);
                    $(ID_DIV).next().addClass("text");
                    $(ID_DIV).next().addClass("disabled");
                    $(ID_DIV).next().attr("disabled",true);

                    approval_status_msg({method:"close",data:a});
                    method_before = 'novasi_kontrak';
                    $("#form [name=RentalPeriode]").attr('readonly', true);
                    // $(".disable-date").attr('disabled', true);
                    $(".disable-date").attr('disabled',true);
                    
                    // $("#form [name=StartDate]").val(a.StartDate);
                    // $("#form [name=EndDate]").val(a.EndDate);

                }
                if(AddendumKontrak == 1){
                    $("#form [name=AddendumKontrak]").val(a.Addendum);
                    $("#form [name=AddendumCustomerID]").val(a.CustomerID);
                    $(".form-title").text("Addendum Kontrak");
                    $(".table-data-detail tfoot .action").show();
                    $(".table-data-detail tfoot .item-total1").text("");
                    $(".table-data-detail tfoot .item-total3").text("");
                    $(".table-data-detail tfoot .item-total4").text("");

                    ID_DIV = "#form [name=RFQCode], #form [name=Type]";
                    $(ID_DIV).addClass("text");
                    $(ID_DIV).attr("disabled",true);
                    $(ID_DIV).next().addClass("text");
                    $(ID_DIV).next().addClass("disabled");
                    $(ID_DIV).next().attr("disabled",true);
                    approval_status_msg({method:"close",data:a});
                    method_before = 'addendum_kontrak';
                }
                if(json.Data.ListData){
                    if(json.Data.ListData.length > 0){
                        $.each(json.Data.ListData,function(i,v){
                            add_data_detail(method_before,v);
                        })
                    } else {
                        add_data_detail('empty');
                    }
                } else {
                    add_data_detail('empty');
                }
                if(json.Data.ListAddendum){
                    if(json.Data.ListAddendum.length > 0){
                        $.each(json.Data.ListAddendum,function(i,v){
                            item = '<tr>';
                            item += '<td><a href="'+host+'backend/kontrak-kerja?id='+v.TransactionContractID+'">'+v.Code+'</a></td>';
                            item += '<td>'+v.Name+'</td>';
                            item += '<td>'+v.ContractDate+'</td>';
                            item += '<td class="text-right">'+number_format(parseInt(v.TotalPrice))+'</td>';
                            item += '</tr>';
                            $("#table-history-addendum tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-addendum tbody").append(item);
                    }
                } else {
                    item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                    $("#table-history-addendum tbody").append(item);
                }
                if(json.Data.ListNovasi){
                    if(json.Data.ListNovasi.length > 0){
                        $.each(json.Data.ListNovasi,function(i,v){
                            item = '<tr>';
                            item += '<td><a href="'+host+'backend/kontrak-kerja?id='+v.TransactionContractID+'">'+v.Code+'</a></td>';
                            item += '<td>'+v.Name+'</td>';
                            item += '<td>'+v.ContractDate+'</td>';
                            item += '<td class="text-right">'+number_format(parseInt(v.TotalPrice))+'</td>';
                            item += '</tr>';
                            $("#table-history-novasi tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-novasi tbody").append(item);
                    }
                } else {
                    item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                    $("#table-history-novasi tbody").append(item);
                }
                if(json.Data.ListAttachment && json.Data.ListAttachment.length > 0){
                    $.each(json.Data.ListAttachment,function(i,v){
                        add_attachment('update',v,3);
                    });
                }
                if(NovasiKontrak == 1 && a.Addendum != 1){
                    calculation_total_price();
                }
                if(a.Addendum == 1){
                    calculation_total_price();
                }
                CheckBtnNextPrev();
                
            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
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
        url = host + 'transaction_contract/save/'+save_method;
        $.ajax({
            url : url,
            type: "POST",
            data: $('#form').serialize(),
            dataType: "JSON",
            success: function(json)
            {
                console.log(json);
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
                        $("#form [name=TransactionContractID]").val(json.TransactionContractID);
                        $("#form [name=Code]").val(json.Code);
                        $("#form [name=Codex]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="'+json.TransactionContractID+'" data-method="edit"></span>');
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
                                $('#form [name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                            } else if(json.type[i] == "alert_2"){
                                $('[name="'+json.inputerror[i]+'"]').parent().parent().addClass('has-error'); 
                                $('.'+json.inputerror[i]+'Alert').text(json.error_string[i]);
                            } else {
                                $('#form [name="'+json.inputerror[i]+'"]').parent().addClass('has-error'); 
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
    remark = dt.remark;
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
          animation: "slide-from-top",
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
        TransactionContractID : id,
        ApproveStatus : status,
        ApproveRemark : "",
        Remark        : remark
    }
    $.ajax({
        url : host+'transaction_contract/approve_data/',
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

function add_data_detail(method,element){
    count_dd    = 1 + count_dd;
    // index       = 1 + index;
    rowid       = "item-detail-"+count_dd;
    td_width    = "80px";
    td_width2   = "130px";
    i_search    = "";
    i_remove    = "";
    i_alert     = "";
    disabled    = "";
    TransactionDetailID = "";
    TransactionContractDetailID = "";
    ID          = "";
    Name        = "";
    Merk        = "";
    VehicleNo   = "";
    Category    = "";
    Type        = "";
    Tranmission = "";
    Color       = "";
    Qty         = "";
    Price       = "";
    TotalPrice  = "";
    TotalBillPrice  = "";
    addclass        = "";
    Accessorize     = 0;
    if(method == "add_new_ac"){
        Accessorize = 1;
        method = "add_new";
        td_width = "unset";
        td_width2 = "unset";
    }
    if(element && element.ID){
        a = element;
        if(method == "view"){
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        TransactionContractDetailID = a.TransactionContractDetailID;
        ID          = a.ID;
        Accessorize = a.Accessorize;
        Name        = a.Name;
        Merk        = a.Merk;
        VehicleNo   = a.VehicleNo;
        Category    = a.Category;
        Type        = a.Type;
        Tranmission = a.Tranmission;
        TranmissionLabel = a.TranmissionLabel;
        Color       = a.Color;
        if(Color == null){
            Color = "";
        }
        Qty         = a.Quantity;
        Price       = a.Price;
        TotalPrice  = a.TotalPrice;
        TotalBillPrice  = a.TotalBillPrice;
    } else {
        dt = $(element).data();
    }
    if(VehicleNo == null){
        VehicleNo = "";
    }
    if((method == "add_new" || method == "novasi_kontrak" || method == "addendum_kontrak")){
        i_alert  = '<i class="item-alert sembunyi ti-alert"></i>';
        if(Accessorize != 1){
            i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_vehicle(this)" data-rowid="'+rowid+'" data-modul="transaction_contract"><i class="fa fa-search"></i></a> ';
        }
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a> ';
    }
    if(method == "empty"){
        item = '<tr class="empty"><td colspan="11">Data tidak ada</td></tr>';
    } else if(method == "view" || method == "update" || method == "edit"){
        itemx = '<table class="table table-normal" style="padding:10px;margin:0px;">';
        itemx += '<thead>';
        itemx += '<tr>';
        itemx += '<td>No</td>';
        itemx += '<td>Tanggal</td>';
        itemx += '<td>Penagihan</td>';
        itemx += '<td></td>';
        itemx += '<td>Detail Tagihan</td>';
        itemx += '<td class="text-right">Tagihan Satuan</td>';
        itemx += '<td class="text-right">PPN</td>';
        itemx += '<td class="text-right">Total Tagihan</td>';
        itemx += '</tr>';
        itemx += '</thead>';
        itemx += '<tbody>';
        NO = 0;
        $.each(a.ArrayListBilling,function(i,v){
            // console.log(v);
            trclassx = 'item-billing-'+ v.TransactionContractBillingID;
            if(v.ChagePrice == 1){
                trclassx = 'tr-blue';
            }
            NO += 1;
            itemx += '<tr class="'+trclassx+'">';
            itemx += '<td>'+NO+'</td>';
            itemx += '<td>'+v.Date+'</td>';
            itemx += '<td>'+v.BillingSystem+'</td>';
            itemx += '<td><p style="visibility:hidden;">'+v.Qty+'</p></td>';
            if(v.TransactionContractBillingID == v.CheckInvoice){
                itemx += `<td>
                    <p>${v.PriceDetail}</p>
                </td>`;
            } else {
                itemx += `<td>
                <input type="hidden" name="TransactionContractDetail-${v.TransactionContractBillingID}" value="${TransactionContractDetailID}">
                <input name="PriceDetail-${v.TransactionContractBillingID}" id="PriceDetail-${v.TransactionContractBillingID}" value="${v.PriceDetail}" type="text" data-format="duit" class="form-control" oninput="isNumber(this)" onchange="savePriceDetail(${v.TransactionContractBillingID})">
                </td>`;
            }
            itemx += '<td class="text-right">'+v.Price+'</td>';
            itemx += '<td class="text-right">'+v.TotalPPN+'</td>';
            itemx += '<td class="text-right">'+v.TotalPrice+'</td>';
            itemx += '</tr>';
        });
        itemx += '</tbody>';
        itemx += '</table>';


        item = '<tr class="pointer item '+rowid+'" data-toggle="collapse" data-target="#tr-'+rowid+'">';
        item += '<td class="text-center"><i class="fa fa-search"></i></td>';
        if(Accessorize == 1){
            item += '<td>'+Name+'</td>';
        } else {        
            item += '<td>'+Merk+'</td>';
            item += '<td>'+Type+'</td>';
            item += '<td>'+Category+'</td>';
            item += '<td style="font-variant: small-caps;">'+TranmissionLabel+'</td>';
            item += '<td>'+Color+'</td>';
        }
        item += '<td>'+VehicleNo+'</td>';
        item += '<td><p style="visibility:hidden;">'+Qty+'-'+TotalBillPrice+'</td>';
        item += '<td class="text-right">'+Price+'</td>';
        item += '<td class="text-right">'+TotalPrice+'</td>';
        item += '</tr>';

        item += '<tr id="tr-'+rowid+'" class="collapse">';
        item += '<td colspan="11" style="background: rgba(0, 0, 0, 0.1);">';
        item += itemx;
        item += '</td>';
        item += '</tr>';
    } else {    
        input_h  = '<input type="hidden" name="DetailCount[]" class="item-count" value="'+rowid+'">';
        input_h  += '<input type="hidden" name="TransactionDetailID[]" value="'+TransactionDetailID+'">';
        input_h  += '<input type="hidden" name="DetailID[]" class="item-id" value="'+ID+'">';
        input_h  += '<input type="hidden" name="DetailAccessorize[]" class="item-accessorize" value="'+Accessorize+'">';
        if(Accessorize == 1){
            input_h  += '<input name="DetailVehicleID[]" class="item-vehicleid" type="hidden" maxlength="30" data-rowid="'+rowid+'"><input type="hidden" name="DetailMerk[]" class="item-merk">';
            input_h  += '<input type="hidden" name="DetailTranmission[]" class="item-tranmission">';
            input_h  += '<input type="hidden" name="DetailType[]" class="item-type">';
            input_h  += '<input type="hidden" name="DetailCategory[]" class="item-category">';
            input_h  += '<input type="hidden" name="DetailVehicleNo[]" class="item-vehicle-no">';
            input_h  += '<input type="hidden" name="DetailColor[]" class="item-color">';
        } else {
            input_h  += '<input type="hidden" name="DetailName[]" class="item-name">';
        }
        selected1 = "";
        selected2 = "";
        if(Tranmission == "manual"){
            selected1 = 'selected="selected"';
        } else if(Tranmission == "automatic"){
            selected2 = 'selected="selected"';
        } 
        // ULANGI BARIS
        if(Qty > 1){
            displayNone = "";
            if(Accessorize == 1){
                displayNone = 'none'; 
            }
            item = "";
            for(let index=1; index<= Qty; index++){
                $("#tbody-table-detail-1").append(item);
                rowid= "item-detail-"+count_dd+"-"+index;
                item = '<tr class="item '+rowid+'">';
                item += '<td>'+i_alert+'<div class="btn-group btn-xs"><a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_vehicle(this)" data-rowid="'+rowid+'" data-modul="transaction_contract" style="display: '+displayNone+'"><i class="fa fa-search"></i></a><a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a></div>'+input_h+'</td>';
                if(Accessorize == 1){
                    item += '<td colspan="2"><input name="DetailVehicleID[]" class="item-vehicleid" type="hidden" maxlength="30" data-rowid="'+rowid+'"><input  name="DetailName[]" class="item-name" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()" value="'+Name+'"></td>';
                } else {        
                    item += '<td><input name="DetailVehicleID[]" class="item-vehicleid" type="hidden" maxlength="30" data-rowid="'+rowid+'"><input name="DetailMerk[]" class="item-merk" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()" value="'+Merk+'"></td>';
                    item += '<td><input name="DetailType[]" class="item-type" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+Type+'"></td>';
                    item += '<td><input name="DetailCategory[]" class="item-category" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+Category+'"></td>';
                    item += '<td style="font-variant: small-caps;">';
                    item += '<select name="DetailTranmission[]"  class="item-tranmission" data-rowid="'+rowid+'">';
                    item += '<option value="manual" '+selected1+'>M/T</option>';
                    item += '<option value="automatic" '+selected2+'>A/T</option>';
                    item += '</select>';
                    item += '</td>';
                    item += '<td><input name="DetailColor[]" class="item-color" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Color+'"></td>';
                    item += '<td><input name="DetailVehicleNo[]" class="item-vehicle-no" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+VehicleNo+'"></td>';
                }
                item += '<td><input type="hidden" name="TransactionContractDetailID[]" value="'+TransactionContractDetailID+'"> <input name="DetailQty[]" class="item-qty" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+'; visibility:hidden;" value="1"><input name="DetailTotalBillPrice[]" class="item-total-bill-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+'; visibility: hidden;" value="'+TotalBillPrice+'"></td>';
                item += '<td class="text-right"><input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-format="duit" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+number_format(Price)+'"></td>';
                item += '<td class="text-right"><input name="DetailTotalPrice[]" class="item-total-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+TotalPrice+'"></td>';
                item += '</tr>';
            }
        } else {
            displayNone = "";
            if(Accessorize == 1){
                displayNone = 'none'; 
            }
            rowid= "item-detail-"+count_dd+"-1";
            item = '<tr class="item '+rowid+'">';
            item += '<td>'+i_alert+'<div class="btn-group btn-xs"><a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_vehicle(this)" data-rowid="'+rowid+'" data-modul="transaction_contract" style="display: '+displayNone+'"><i class="fa fa-search"></i></a><a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a></div>'+input_h+'</td>';
            if(Accessorize == 1){
                item += '<td colspan="2"><input name="DetailVehicleID[]" class="item-vehicleid" type="hidden" maxlength="30" data-rowid="'+rowid+'"><input  name="DetailName[]" class="item-name" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()" value="'+Name+'"></td>';
            } else {        
                item += '<td><input name="DetailVehicleID[]" class="item-vehicleid" type="hidden" maxlength="30" data-rowid="'+rowid+'"><input name="DetailMerk[]" class="item-merk" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()" value="'+Merk+'"></td>';
                item += '<td><input name="DetailType[]" class="item-type" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+Type+'"></td>';
                item += '<td><input name="DetailCategory[]" class="item-category" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+Category+'"></td>';
                item += '<td style="font-variant: small-caps;">';
                item += '<select name="DetailTranmission[]" class="item-tranmission" data-rowid="'+rowid+'">';
                item += '<option value="manual" '+selected1+'>M/T</option>';
                item += '<option value="automatic" '+selected2+'>A/T</option>';
                item += '</select>';
                item += '</td>';
                item += '<td><input name="DetailColor[]" class="item-color" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+Color+'"></td>';
                item += '<td><input name="DetailVehicleNo[]" class="item-vehicle-no" type="text" maxlength="30" data-rowid="'+rowid+'" style="width:'+td_width+';" value="'+VehicleNo+'"></td>';
            }
            item += '<td><input type="hidden" name="TransactionContractDetailID[]" value="'+TransactionContractDetailID+'"> <input name="DetailQty[]" class="item-qty" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+'; visibility: hidden;" value="1"><input name="DetailTotalBillPrice[]" class="item-total-bill-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+'; visibility: hidden;" value="'+TotalBillPrice+'"></td>';
            item += '<td class="text-right"><input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-format="duit" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+number_format(Price)+'"></td>';
            item += '<td class="text-right"><input name="DetailTotalPrice[]" class="item-total-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" readonly="" data-rowid="'+rowid+'" style="width:'+td_width2+';" value="'+TotalPrice+'"></td>';
            item += '</tr>';
        }
        // <input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
    }
    if(Accessorize == 1){
        $("#tbody-table-detail-2").append(item);
    } else {
        $("#tbody-table-detail-1").append(item);
    }
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
    total3 = 0;
    total4 = 0;

    total1a = 0;
    total2a = "";
    total3a = 0;
    total4a = 0;

    contract_price= 0;
    Type          = $("#form [name=Type]").find(":selected").val();
    StartDate     = $("#form [name=StartDate]").val();
    RentalPeriode = $("#form [name=RentalPeriode]").val();
    BillingSystem = $("#form [name=BillingSystem]").val();
    PPN           = $("#form [name=PPN]").val();
    if(BillingSystem == "" || BillingSystem == 0){
        BillingSystem = 1;
    }
    if(RentalPeriode == "" || RentalPeriode == 0){
        RentalPeriode = 1;
    }
    RentalPeriode = parseInt(RentalPeriode);

    list = $(".table-data-detail tbody tr");
    if(list.length > 0){
        $.each(list,function(i,v){
            rowid = v.classList[1];
            class_rowid = "."+rowid;
            id    = $(class_rowid + " .item-id").val();
            accez = $(class_rowid + " .item-accessorize").val();
            name  = $(class_rowid + " .item-name").val();
            merk  = $(class_rowid + " .item-merk").val();
            qty   = $(class_rowid + " .item-qty").val();
            price = $(class_rowid + " .item-price").val();
            if(id == ""){id=0;}
            if(merk == ""){merk="";}
            if(qty == ""){qty=0;}
            if(price == "" || price == undefined){price=0;} else { price = price.replace(/\,/g,'');}
            id    = parseInt(id);
            qty   = parseInt(qty);
            price = parseInt(price);
            if(accez == 1){
                // total_bill
                if(name && name != "" && name.length > 0){
                    total_price = qty * price;
                    if(PPN == 1){
                        total_price += total_price*10/100;
                    }
                    total_bill  = total_price * RentalPeriode;
                    total1a     += qty;
                    total3a     += total_price;
                    total4a     += total_bill;
                    $(class_rowid + " .item-total-price").val(number_format(total_price));
                    $(class_rowid + " .item-total-bill-price").val(number_format(total_bill));
                }
            } else {            
                total_bill = 0;
                if(merk && merk != "" && merk.length > 0){
                    total_price = qty * price;
                    if(PPN == 1){
                        total_price += total_price*10/100;
                    }
                    total_bill  = total_price * RentalPeriode;
                    total1      += qty;
                    total3      += total_price;
                    total4      += total_bill;
                    $(class_rowid + " .item-total-price").val(number_format(total_price));
                    $(class_rowid + " .item-total-bill-price").val(number_format(total_bill));
                }
            }
        });
    }
    $("#table-detail-1 tfoot .item-total1").text(number_format(total1));
    $("#table-detail-1 tfoot .item-total2").text(number_format(total2));
    $("#table-detail-1 tfoot .item-total3").text(number_format(total3));
    $("#table-detail-1 tfoot .item-total4").text(number_format(total4));


    $("#table-detail-2 tfoot .item-total1").text(number_format(total1a));
    $("#table-detail-2 tfoot .item-total2").text(number_format(total2a));
    $("#table-detail-2 tfoot .item-total3").text(number_format(total3a));
    $("#table-detail-2 tfoot .item-total4").text(number_format(total4a));


    contract_price += total4 + total4a;
    $("#form [name=TotalPrice]").val(number_format(contract_price));
    if(StartDate && RentalPeriode){
		datearray = StartDate.split("-");
		StartDate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
    	StartDate = new Date(StartDate);
        if(Type == 1){
            EndDate   = StartDate.addDays(RentalPeriode);
            EndDate   = EndDate.minDays(1);
        } else if(Type == 2){
            EndDate   = StartDate.addWeeks(RentalPeriode);
            EndDate   = EndDate.minDays(1);
        } else {
		    EndDate   = StartDate.addMonths(RentalPeriode);
            EndDate   = EndDate.minDays(1);
        }
    	EndDate   = formatDate(EndDate);
    	StartDate = formatDate(StartDate).split("-").reverse().join("-");
    	EndDate   = formatDate(EndDate).split("-").reverse().join("-");
    	$("#form [name=EndDate]").val(EndDate);
    	$("#form [name=EndDate]").datepicker("setDate",EndDate);
    	// $("#form [name=DueDate]").val(datearray[0]);
    }
}
function GetDataVendor(){
    dt    = $('#form [name=NovasiCustomerID]').find(':selected').data();
    value = $('#form [name=NovasiCustomerID]').find(':selected').val();
    
    phone   = "";
    address = "";
    ppn     = 0;
    if(dt){
        if(dt.phone){
            phone   = dt.phone;
        }
        if(dt.address){
            address = dt.address;
        }
        if(dt.ppn){
            ppn = dt.ppn;
        }
        if(dt.ppn == 1){
            $("#form [name=PPN]").prop("checked",true);
        } else {
            $("#form [name=PPN]").prop("checked",false);
        }
    }
    $("[name=Phone]").val(phone);
    $("[name=Address]").val(address);
    $("[name=PPN]").val(ppn);
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
			        url : host+'transaction_contract/HitungTagihan/'+id+'/post',
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
function SelectType(element){
    dt    = $('#form [name=Type]').find(':selected').data();
    value = $('#form [name=Type]').find(':selected').val();
    if(value == 1){
        $(".label-tagihan").text("Hari");
        $(".label-tagihan-th").text("Perhari");
    } else if (value == 2){
        $(".label-tagihan").text("Minggu");
        $(".label-tagihan-th").text("Perminggu");
    } else {
        $(".label-tagihan").text("Bulan");
        $(".label-tagihan-th").text("Perbulan");
    }
    calculation_total_price();
}
function novasi_kontrak(element){
    dt = $(element).data();
    id = dt.id;
    finish = dt.finish;
    swal({   
        title: "Info",   
        text: "Apakah anda yakin akan menovasi kontrak ini ?",   
        showCancelButton: true,   
        confirmButtonText: "Ya",   
        cancelButtonText: "Tidak",   
        closeOnConfirm: true,   
        closeOnCancel: true }, 
        function(isConfirm){   
            if (isConfirm) { 
               $.ajax({
                    url : host+'transaction_contract/NovasiKontrak/'+id+'/post',
                    type: "POST",
                    data: data_post,
                    dataType: "JSON",
                    success: function(json){
                        if(json.Status){
                            reload_table();
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
function addendum_kontrak(element){
    dt = $(element).data();
    id = dt.id;
    addendum = dt.addendum;
    swal({   
        title: "Info",   
        text: "Apakah anda yakin akan meng-addendum kontrak ini?",   
        showCancelButton: true,   
        confirmButtonText: "Ya",   
        cancelButtonText: "Tidak",   
        closeOnConfirm: true,   
        closeOnCancel: true }, 
        function(isConfirm){   
            if (isConfirm) { 
               $.ajax({
                    url : host+'transaction_contract/AddendumKontrak/'+id+'/post',
                    type: "POST",
                    data: data_post,
                    dataType: "JSON",
                    success: function(json){
                        if(json.Status){
                            reload_table();
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
function savePriceDetail(ID){
    PriceDetail = $("[name=PriceDetail-"+ID+"]").val();
    TransactionContractDetailID = $("[name=TransactionContractDetail-"+ID+"]").val();
    data_post   = {
        TransactionContractBillingID : ID,
        PriceDetail : PriceDetail,
        TransactionContractDetailID : TransactionContractDetailID
    }
    $.ajax({
        url : url_price,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(json)
        {  
            console.log(json);
            if(json.Status){
                toastr.success(json.Message,"Information");
            } else {
                toastr.error(json.Message,"Information");
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            toastr.error("Terjadi kesalahan gagal menyimpan data","Information");
        }
    });
}

function statusPPN(){
    if($("[name=PPNx]").prop("checked",true)){
        $("[name=PPN]").val(1);
        // console.log("1");
    } else {
        $("[name=PPN]").val(0);
        // console.log("0");
    }
}
function setPPN(){
    if($("[name=PPN]").is(":checked")){
        $("[name=PPN]").val(1);
    } else {
        $("[name=PPN]").val(0);
    }
    calculation_total_price();
}
function ChangeTypeCategory(){
    TypeCategory = $("[name=TypeCategory]").val();
    console.log(TypeCategory);
    if(TypeCategory == 4 || TypeCategory == 5){
        $(".item-hidden").hide(300);
        $("#item-customer").show(300);
    } else {
        $(".item-hidden").show(300);
        $("#item-customer").hide(300);
    }
}

function GetDataCustomer(){
    dt    = $('#form [name=NewCustomerID]').find(':selected').data();
    value = $('#form [name=NewCustomerID]').find(':selected').val();
    
    phone   = "";
    address = "";
    ppn     = 0;
    if(dt){
        if(dt.phone){
            phone   = dt.phone;
        }
        if(dt.address){
            address = dt.address;
        }
        if(dt.ppn){
            ppn = dt.ppn;
        }
        if(dt.ppn == 1){
            $("#form [name=PPN]").prop("checked",true);
        } else {
            $("#form [name=PPN]").prop("checked",false);
        }
    }
    $("[name=Phone]").val(phone);
    $("[name=Address]").val(address);
    $("[name=PPN]").val(ppn);
}