var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "transaction_invoice_rental/list_data/";
var url_edit    = host + "transaction_invoice_rental/edit/";
var url_hapus   = host + "transaction_invoice_rental/delete/";
var url_simpan  = host + "transaction_invoice_rental/save/";
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
    $('#table tbody').on('click', 'tr', function () {
        $("#table tbody, .table tr").removeClass("active");
        row = table.row(this);
        data = table.row( this ).data();
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
    document.getElementById("add-attachment").addEventListener("change", readFile);    
    $(".table-data-detail [name=CekAll]").click(function(){
        if($(this).is(':checked')){
            $(".table-data-detail tbody .item-checked[type=checkbox]").prop("checked",true);
        } else {
            $(".table-data-detail tbody .item-checked[type=checkbox]").prop("checked",false);
        }
        calculation_total_price(null);
   });
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
    VendorID     = $('#form-filter [name=VendorID]').find(':selected').val();
    PPN          = $('#form-filter [name=PPN]').find(':selected').val();
    ApproveStatus= $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post   = {
        Filter    : filter,
        InvoiceID : id,
        MenuID    : menuid,
        StartDate : StartDate,
        EndDate   : EndDate,
        VendorID  : VendorID,
        PPN       : PPN,
        ApproveStatus : ApproveStatus,
    }
    console.log(data_post);
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
    if(id && id > 0){
        edit('<span data-id="'+id+'" data-method="view"></span>');
    }
}
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().show();
    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type","hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    // add_data_detail('add_new','<span data-method="new_data"></span>');
    div_form("open");
    $("#form [name=InvoiceID], #form [name=VendorID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
    $(".div-check-all").show();
    approval_status_msg({method:"close"});
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
                div_form(method);
                $("#form .input-group-addon").addClass("disabled");
                $("#form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                approval_status_msg({method:"open",data:a});
                NextID = a.NextID;
                PrevID = a.PrevID;
                $("#form [name=InvoiceID]").val(a.InvoiceID);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=TaxCode]").val(a.TaxCode);
                $("#form [name=ReferenceCode]").val(a.ReferenceCode);
                $("#form [name=Date]").val(a.Date);
                $("#form [name=VendorID]").val(a.VendorID);
                $("#form [name=VendorName]").val(a.VendorName);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=Price]").val(a.TotalPrice);
                $("#form [name=Pricex]").val(a.TotalPrice);
                $("#form [name=TotalDownPayment]").val(a.TotalDownPaymentTxt);
                $("#form [name=TotalPrice]").val(a.TotalPrice);

                $("#bankid-"+a.BankID).prop("checked",true);
                if(a.Type == 1){
			        $(".div-down-payment").hide();
                } else {
			        $(".div-down-payment").show();
                }
                if(method_before == "view"){
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type","text");
                } else {
                    $("#form [name=MarketingID], #form [name=AgentID], #form [name=VendorID]").next().hide();
                    $("#form [name=MarketingName], #form [name=AgentName], #form [name=VendorName]").attr("type","text");
                    
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=InvoiceID], #form [name=TaxCode], #form [name=Remark], #add-attachment, #form [type=radio]").attr("disabled",false);
                    $("#form [name=InvoiceID], #form [name=TaxCode], #form [name=Remark]").removeClass("text");
                }
                if(json.Data.ListData){
                    if(json.Data.ListData.length > 0){
                        $(".table-data-detail tfoot .item-total").text(a.TotalPrice);
                        $.each(json.Data.ListData,function(i,v){
                            add_data_detail(method_before,v);
                        })
                    } else {
                        add_data_detail('empty');
                        $(".table-data-detail tfoot .item-total").text("");
                    }
                } else {
                    add_data_detail('empty');
                    $(".table-data-detail tfoot .item-total").text("");
                }
                if(json.Data.ListAttachment && json.Data.ListAttachment.length > 0){
                    $.each(json.Data.ListAttachment,function(i,v){
                        add_attachment('update',v);
                    });
                }
                CheckBtnNextPrev();
                $(".div-check-all").hide();
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


function save(element){
	if(save_method == "add"){
		list  = $("#table-detail-1.table-data-detail tbody tr");
		sum_total_price = 0;
		sum_total_price_old = 0;
	    if(list.length > 0){
	        checkedcount = 0;
	        $.each(list,function(i,v){
	            rowid = v.classList[1];
	            class_rowid 	= "."+rowid;
	            id    			= $(class_rowid + " .item-id").val();
	            total_price 	= $(class_rowid +" .item-total-price").val();
	            total_price_old = $(class_rowid +" .item-total-price-old").val();
	            if(total_price.length > 0){
	                total_price = total_price.replace(/\,/g,'');
	            }
	            if(total_price_old.length > 0){
	                total_price_old = total_price_old.replace(/\,/g,'');
	            }
	            if(id == ""){id=0;}
	            if(total_price == ""){total_price=0;}
	            if(total_price_old == ""){total_price_old=0;}
	            id    			= parseInt(id);
	            total_price   	= parseInt(total_price);
	            total_price_old   = parseInt(total_price_old);
	            if($(class_rowid +" .item-checked").is(":checked")){
	                if(id > 0){
	                	sum_total_price += total_price;
	                	sum_total_price_old += total_price_old;
	                }
	            }
	        });
	    }
	    if(sum_total_price == sum_total_price_old){
			save_finish(element);
	    } else {
			swal({   title: "Info",   
	             text: "Perubahan tagihan akan mengubah semua data pada tagihan tanggal selanjutnya, apakah yakin akan menyimpan data ini ?",   
	             // type: "warning",   
	             showCancelButton: true,   
	             confirmButtonColor: "#DD6B55",   
	             confirmButtonText: "Ya",   
	             cancelButtonText: "Tidak",   
	             closeOnConfirm: true,   
	             closeOnCancel: false }, 
	             function(isConfirm){   
	                 if (isConfirm) { 
						save_finish(element);
	                } else {
	           	        swal("Info", "Simpan data tidak jadi");   
		            } 
		    });
	    }

	} else {
		save_finish(element);
	}
}

var count_save = 0;
function save_finish(element)
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
        url = host + 'transaction_invoice_rental/save/'+save_method;
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
                        $("#form [name=InvoiceID]").val(json.InvoiceID);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="'+json.InvoiceID+'" data-method="edit"></span>');
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

                            if(data){
                                DATA = {
                                    ID : id,
                                    TypeID : 'InvoiceID/JB',
                                    Kondisi : 'invoice_rental_cancel',
                                }
                                GenerateJurnal(DATA);
                            }

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
    changeprice = dt.changeprice;
    remark = "";
    if(action == "agree"){
        if(changeprice == 1){
            pesan = "Invoice ini telah melakukan perubahan data tagihan, nilai kontrak dan semua data di tagihan tanggal selanjutnya akan berubah. <b>Invoice ini tidak bisa dibatalkan</b>, Apa anda yakin akan menyetujui data ini ?";
        } else {
            pesan = "Apa anda yakin akan menyetujui data ini ?";
        }
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
            html: true,
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
        InvoiceID : id,
        ApproveStatus : status,
        ApproveRemark : remark
    }
    $.ajax({
        url : host+'transaction_invoice_rental/approve_data/',
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(json){
            if(json.Status){
                toastr.success(json.Message,"Information");
                reload_table();
                if(action == "agree"){
                    DATA = {
                        ID : id,
                        TypeID : 'InvoiceID',
                        Kondisi : 'invoice_rental',

                    }
                    GenerateJurnal(DATA);
                }
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
    count_dd = 1 + count_dd;
    rowid    = "item-detail-"+count_dd;
    td_width = "70px";
    i_search = "";
    i_remove = "";
    i_alert  = "";
    disabled = "";
    TransactionReceiveOrderID = 0;
    TransactionContractBillingID = 0;
    TransactionContractDetailID = 0;
    TransactionContractID = 0;
    TransactionDetailID = "";
    Kendaraan       = "";
    Unit            = "";
    PPN             = 0;
    ID              = "";
    VendorID        = "";
    SPKCode         = "";
    ContractCode    = "";
    BillDate        = "";
    BillingSystem   = "";
    Sort            = "";
    Price           = "";
    Quantity        = "";
    SubTotal        = "";
    TotalPPN        = "";
    TotalPrice      = "";
    TotalGrandFinal = "";
    TOP             = "";
    Accessorize 	= 0;
    classtr         = "";
    addppn          = "";
    if(element && element.ID){
        a = element;
        if(method == "view"){
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionContractID = a.TransactionContractID;
        TransactionContractDetailID = a.TransactionContractDetailID;
        TransactionContractBillingID = a.TransactionContractBillingID;
        TransactionDetailID = a.TransactionDetailID;
        Kendaraan       = a.Kendaraan;
        Unit            = a.Unit;
        PPN             = a.PPN;
        ID              = a.ID;
        VendorID        = a.VendorID;
        ContractCode    = a.ContractCode;
        BillDate        = a.Date;
        BillingSystem   = a.BillingSystem;
        Sort            = a.Sort;
        Price           = a.Price;
        Quantity        = a.Quantity;
        SubTotal        = a.SubTotal;
        TotalPPN        = a.TotalPPN;
        TotalPrice      = a.TotalPrice;
        TotalGrandFinal = a.TotalGrandFinal
        TOP             = a.TOP;
        Accessorize 	= a.Accessorize;
        Accessorize 	= parseInt(Accessorize);
        ContractCode       = '<a href="'+host+'backend/kontrak-kerja?id='+TransactionContractID+'" target="_blank">'+ContractCode+'</a>';
    } else {
        dt = $(element).data();
    }

    if(PPN == 1){
        addppn = '<span style="font-size: 8pt;">+ppn</span>';
    }
    if(PPN == 1){
        PPNLabel = '<i class="fa fa-check"></i>';
    } else {
        PPNLabel = '<i class="fa fa-close"></i>';
    }

    if(method == "add_new"){
        // Type  = $("#form [name=Type]").find(':selected').val();
        // if(Type == 1){
        //     method = "add_new_2";
        // }
        i_alert  = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_receive_order(this)" data-rowid="'+rowid+'" data-modul="transaction_invoice_rental"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a> ';
    }
    if(TOP < 0){
        classtr +=' tr-red';
    }
    if(method == "empty"){
        item = '<tr class="empty"><td colspan="11">Data tidak ada</td></tr>';
    } else if(method == "view" || method == "update" || method == "edit"){
        item = '<tr class="item '+rowid+classtr+'">';
        item += '<td></td>';
        item += '<td>'+ContractCode+'</td>';
        item += '<td>'+Kendaraan+'</td>';
        item += '<td>'+Unit+'</td>';
        item += '<td>'+BillDate+'</td>';
        item += '<td>'+BillingSystem+'</td>';
        item += '<td class="text-center">'+Sort+'</td>';
        item += '<td class="text-right">'+SubTotal+'</td>';
        item += '<td class="text-right">'+TotalPPN+'</td>';
        item += '<td class="text-center">'+PPNLabel+'</td>';
        item += '<td class="text-right">'+TotalPrice+'</td>';
        // item += '<td class="text-right">'+TotalPrice+'</td>';
        item += '</tr>';
    } else {  
        PPNCheked = '';
        if(PPN == 1){
            PPNCheked = 'checked="checked"';
        } else {
            PPNCheked = 'readonly="readonly" ';
        }
        input_h  = '<input type="hidden" name="DetailCount[]" class="item-count" value="'+rowid+'">';
        input_h  += '<input type="hidden" name="TransactionDetailID[]" value="'+TransactionDetailID+'">';
        input_h  += '<input type="hidden" name="DetailTransactionContractID[]" value="'+TransactionContractID+'">';
        input_h  += '<input type="hidden" name="DetailTransactionContractDetailID[]" value="'+TransactionContractDetailID+'">';
        input_h  += '<input type="hidden" name="DetailTransactionContractBillingID[]" value="'+TransactionContractBillingID+'">';
        input_h  += '<input type="hidden" name="DetailVendorID[]" value="'+VendorID+'">';
        input_h  += '<input type="hidden" name="DetailID[]" class="item-id" value="'+ID+'">';
        input_h  += '<input type="hidden" name="DetailPPN[]" class="item-ppn" value="'+PPN+'">';
        input_h  += '<input type="hidden" name="DetailPrice[]" class="item-price" value="'+Price+'">';
        input_h  += '<input type="hidden" name="DetailQuantity[]" class="item-qty" value="'+Quantity+'">';
        input_h  += '<input type="hidden" name="DetailTotalPPN[]" class="item-total-ppn" value="'+TotalPPN+'">';
        input_h  += '<input type="hidden" name="DetailTotalPriceOld[]" class="item-total-price-old" value="'+TotalGrandFinal+'">';
        input_h  += '<input type="hidden" name="DetailTotalPrice[]" class="item-total-price" value="'+TotalGrandFinal+'">';
        if(Accessorize == 0){
	        input_h  += '<input type="hidden" name="DetailSubTotal[]" class="item-subtotal" value="'+SubTotal+'">';
        }

        item = '<tr class="item '+rowid+classtr+'">';
        // item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
        item += '<td>\
                <div class="checkbox checkbox-primary" style="margin:0px;text-align:left;">\
                  <input name="Checkbox[]" class="item-checked" type="checkbox" onclick="calculation_total_price()" data-rowid="'+rowid+'" id="'+rowid+'-ppn" value="'+TransactionDetailID+'" tab-index="-1">\
                  <label for="'+rowid+'-ppn"></label>\
                </div>'
        item += '<td>'+ContractCode+input_h+'</td>';
        item += '<td>'+Kendaraan+'</td>';
        item += '<td>'+Unit+'</td>';
        item += '<td>'+BillDate+'</td>';
        item += '<td>'+BillingSystem+'</td>';
        item += '<td class="text-center">'+Sort+'</td>';
        if(Accessorize == 1){
        	item += '<td class="text-right"><input name="DetailSubTotal[]" class="item-subtotal" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" data-value="'+SubTotal+'" style="text-align:left;padding-left:5px;width:120px;" value="'+SubTotal+'"></td>';
        } else {
	        item += '<td class="text-right">'+SubTotal+'</td>';
        }
        item += '<td class="item-total-ppn-txt text-right";">'+TotalPPN+'</td>';
        cal_total_price = "'checked'";
        item += '<td class="text-center">'+PPNLabel+'</td>';
        item += '<td class="item-total-price-txt text-right">'+TotalGrandFinal+'</td>';
        // item += '<td class="item-total-payment-txt text-right"><input name="DetailTotalPayment[]" class="item-total-payment" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" data-value="'+TotalGrandFinal+'" style="text-align:left;padding-left:5px;" value="'+TotalGrandFinal+'"></td>';
        item += '</tr>';
    }
    $("#table-detail-1 tbody").append(item);
}
function remove_data_detail(element){
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    $("."+dt.rowid).remove();
    calculation_total_price();
}
function calculation_total_price(method_cal){
    total = 0;
    Type  = $("#form [name=Type]").find(':selected').val();
    list  = $("#table-detail-1.table-data-detail tbody tr");
    if(list.length > 0){
        checkedcount = 0;
        $.each(list,function(i,v){
            rowid = v.classList[1];
            class_rowid = "."+rowid;
            id    		= $(class_rowid + " .item-id").val();
            ppn  		= $(class_rowid + " .item-ppn").val();
            qty  		= $(class_rowid + " .item-qty").val();
            price  		= $(class_rowid + " .item-price").val();
            subtotal	= $(class_rowid + " .item-subtotal").val();
            total_price = $(class_rowid + " .item-total-price").val();

            if(price.length > 0){
                price = price.replace(/\,/g,'');
            }
            if(subtotal.length > 0){
                subtotal = subtotal.replace(/\,/g,'');
            }
            if(total_price.length > 0){
                total_price = total_price.replace(/\,/g,'');
            }
            if(id == ""){id=0;}
            if(ppn == ""){ppn=0;}
            if(qty == ""){qty=0;}
            if(price == ""){price=0;}
            if(subtotal == ""){subtotal=0;}
            if(total_price == ""){total_price=0;}

            id    		  = parseInt(id);
            ppn    	  	  = parseInt(ppn);
            qty    	  	  = parseInt(qty);
            price    	  = parseInt(price);
            subtotal      = parseInt(subtotal);
            total_price   = parseInt(total_price);
            if($(class_rowid +" .item-checked").is(":checked")){
                if(id > 0){
                    checkedcount += 1;
                    price 		  = subtotal / qty;
                    if(ppn == 1){
                    	total_ppn = subtotal * 10 / 100;
                    } else {
                    	total_ppn = 0;
                    }
                    total_price   = subtotal + total_ppn;
                    $(class_rowid + " .item-price").val(number_format(price));
                    $(class_rowid + " .item-total-ppn").val(number_format(total_ppn));
                    $(class_rowid + " .item-total-price").val(number_format(total_price));

                    $(class_rowid + " .item-total-ppn-txt").text(number_format(total_ppn));
                    $(class_rowid + " .item-total-price-txt").text(number_format(total_price));

                    total = total_price;
                }
            }
        });
        if(list.length == checkedcount){
            $("[name=CekAll]").prop("checked",true);
        } else {
            $("[name=CekAll]").prop("checked",false);
        }
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    } else {
        $(".table-data-detail tfoot .item-total").text(number_format(total));
    }
    // totaldp = $("[name=TotalDownPayment]").val();
    // if(totaldp.length > 0){
    //     totaldp = totaldp.replace(/\,/g,'');
    //     totaldp = parseInt(totaldp);
    //     total   = (total - totaldp);
    // }
    $("[name=Pricex]").val(number_format(total));
}
function calculation_last_price(){
    Price = $("[name=Price]").val();
    EstimationPrice = $("[name=EstimationPrice]").val();
    if(Price == ""){Price = 0;}
    if(EstimationPrice == ""){EstimationPrice = 0;}
    Price = parseInt(Price);
    if(EstimationPrice.length > 0){
	    EstimationPrice = EstimationPrice.replace(/\,/g,'');
    }
    EstimationPrice = parseInt(EstimationPrice);
    TotalPrice = (Price + EstimationPrice);
    $("[name=TotalPrice]").val(number_format(TotalPrice));
}

function GetListDataByVendor(element){
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .item-total").text("");
    dt    = $('#form [name=VendorID]').find(':selected').data();
    value = $('#form [name=VendorID]').find(':selected').val();
    Type  = $("#form [name=Type]").find(':selected').val();
    if(value != "none"){
        $.ajax({
            url : host + 'transaction_invoice_rental/GetListDataByVendor/'+value,
            type: "POST",
            dataType: "JSON",
            success: function(json){
                if(json.Status){
                    if(json.ListData){
                        if(json.ListData.length > 0){
                            $.each(json.ListData,function(i,v){
                                add_data_detail("add_new",v);
                            });
                        } else {
                            add_data_detail("empty");
                        }
                    } else {
                        add_data_detail("empty");
                    }
                } else {
                    toastr.error(json.Message,"Information");
                }
            },
            error: function (jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
                toastr.error("Terjadi kesalahan gagal mendapatkan data","Information");
            }
        });
    }
}
function update_taxcode(element){
  dt            = $(element).data();
  action_delete = dt.action;
  url           = url_hapus;
  ArrayID       = [];
  ArrayChecked  = [];

  ArrayList     = [];

  list_id = $(".table tbody .th-checkbox [type=checkbox]");
  $.each(list_id,function(i,v){
    if($(v).is(":checked")){    
      dtx = $(v).data();
      ArrayChecked.push(dtx.id);
      if(action_delete == "delete"){
        if(dtx.active=="1" && dtx.ppn == "1"){
          item_ar = {
            id : dtx.id,
            code : dtx.code,
            vendorname : dtx.vendorname,
            totalprice : dtx.totalprice,
            taxcode : dtx.taxcode
          };
          ArrayID.push(dtx.id);
          ArrayList.push(item_ar);
        } else {
          $(v).prop("checked",false);
        }
      } else {
        if(dtx.active=="1" && dtx.ppn == "0"){
          ArrayID.push(dtx.id);
        } else {
          $(v).prop("checked",false);
        }
      }
    }
  });
  $("#table-taxcode tbody").empty();
  $("#modal-taxcode .div-loader").show();
  if(ArrayList.length > 0){
    console.log(ArrayList);
    $.each(ArrayList,function(i,v){
        i += 1;
        taxcode = '';
        if(v.taxcode){
            taxcode = v.taxcode;
        }
        th_hidden = '<input type="hidden" name="InvoiceID[]" value="'+v.id+'" class="item-id"> ';
        item = '<tr>';
        item += '<td>'+i+th_hidden+'</td>';
        item += '<td>'+v.code+'</td>';
        item += '<td>'+v.vendorname+'</td>';
        item += '<td class="text-right">'+v.totalprice+'</td>';
        item += '<td><input type="text" name="TaxCode[]" value="'+taxcode+'" class="item-taxcode form-control" maxlength="50" style="height:30px;"></td>';
        item += '</tr>';   
        $("#modal-taxcode #table-taxcode tbody").append(item);
    });
    $("#modal-taxcode .div-loader").hide();
    $("#modal-taxcode .modal-title").text("Update No. Pajak Pajak");
    $("#modal-taxcode").modal("show");
  } else {
    toastr.danger("Maaf tidak ada data yang ber-PPN","Information");
  }

}
function save_taxcode(element){
    $(element).button("loading");
    $.ajax({
        url : host + 'transaction_invoice_rental/save_taxcode/',
        type: "POST",
        data: $('#form-taxcode').serialize(),
        dataType: "JSON",
        success: function(json){
            if(json.Status){
                toastr.success(json.Message,"Information");
                reload_table();
                $("#th-check-all").prop("checked",false);
                $("#modal-taxcode").modal("hide");
            } else {
                toastr.error(json.Message,"Information");
            }
            $(element).button("reset");
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
            toastr.error("Terjadi kesalahan gagal mendapatkan data","Information");
            $(element).button("reset");
        }
    });
}