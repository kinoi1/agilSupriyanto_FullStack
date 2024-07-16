var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "transaction_rfq/list_data/";
var url_edit    = host + "transaction_rfq/edit/";
var url_hapus   = host + "transaction_rfq/delete/";
var url_simpan  = host + "transaction_rfq/save/";
var url_approve = host + "transaction_rfq/approve_data/";
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
    CustomerID   = $('#form-filter [name=CustomerID]').find(':selected').val();
    ApproveStatus= $('#form-filter [name=ApproveStatus]').find(':selected').val();

    data_post   = {
        Filter    : filter,
        InvoiceID : id,
        MenuID    : menuid,
        StartDate : StartDate,
        EndDate   : EndDate,
        CustomerID   : CustomerID,
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
    $("#form [name=CustomerName]").attr("type","hidden");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    $(".table-data-detail tfoot .item-total-price").text("");
    $(".table-data-detail tfoot .item-total-price-1").text("");
    $(".table-data-detail tfoot .item-total-price-2").text("");
    $(".table-data-detail tfoot .item-total-price-3").text("");
    $(".table-data-detail tfoot .item-total-hps").text("");
    div_form("open");
    add_data_detail('add_new','<span data-method="new_data"></span>');
    $("#form [name=TransactionRFQID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
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
    $(".table-data-detail tfoot .item-total-price").text("");
    $(".table-data-detail tfoot .item-total-price-1").text("");
    $(".table-data-detail tfoot .item-total-price-2").text("");
    $(".table-data-detail tfoot .item-total-price-3").text("");
    $(".table-data-detail tfoot .item-total-hps").text("");
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
                $(".panel-form .input-group-addon").addClass("disabled");
                $(".panel-form .input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                approval_status_msg({method:"open",data:a});
                NextID = a.NextID;
                PrevID = a.PrevID;

                $("#form [name=TransactionRFQID]").val(a.TransactionRFQID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=Date]").val(a.Date);
                $("#form [name=Name]").val(a.Name);
                $("#form [name=Phone]").val(a.Phone);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=CustomerID]").val(a.CustomerID);
                $("#form [name=CustomerID").val(a.CustomerID).trigger('change');
                $("#form [name=CustomerName]").val(a.CustomerName);
                $("#form [name=Remark]").val(a.Remark);
                $("#form [name=Location]").val(a.Location);
                $("#form [name=TotalQty]").val(a.TotalQty);
                $(".table-data-detail tfoot .item-total").text(a.TotalQty);
                $(".table-data-detail tfoot .item-total-price").text(a.TotalPrice);
                $(".table-data-detail tfoot .item-total-price-1").text(a.TotalQTYOpponent);
                $(".table-data-detail tfoot .item-total-price-2").text(a.TotalPriceOpp);
                $(".table-data-detail tfoot .item-total-price-3").text(a.TotalQTYOpp);
                $(".table-data-detail tfoot .item-total-hps").text(a.TotalHPS);
                if(method_before == "view"){
                    $("#form [name=CustomerID]").next().hide();
                    $("#form [name=CustomerName]").attr("type","text");
                } else {
                    $("#form [name=CustomerID]").next().hide();
                    $("#form [name=CustomerName]").attr("type","text");

                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=TransactionRFQID],#form [name=Remark], #add-attachment").attr("disabled",false);
                    $("#form [name=TransactionRFQID],#form [name=Remark]").removeClass("text");
                }
                // console.log(json.Data.ListData);
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
        url = host + 'transaction_rfq/save/'+save_method;
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
                        $("#form [name=TransactionRFQID]").val(json.TransactionRFQID);
                        $("#form [name=Code]").val(json.Code);
                        $("#form [name=Codex]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="'+json.TransactionRFQID+'" data-method="edit"></span>');
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
        TransactionRFQID : id,
        ApproveStatus : status,
        ApproveRemark : remark
    }
    $.ajax({
        url : host+'transaction_rfq/approve_data/',
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
    count_dd = 1 + count_dd;
    rowid    = "item-detail-"+count_dd;
    // console.log(rowid);
    td_width = "";
    i_search = "";
    i_remove = "";
    i_alert  = "";
    disabled = "";
    TransactionDetailID = "";
    ID       = "";
    Merk     = "";
    Category = "";
    Type     = "";
    Tranmission = "";
    TranmissionLabel = "";
    Color       = "";
    HPS         = "";
    Qty         = "";
    addclass    = "";
    if(element && element.ID){
        a = element;
        if(method == "view"){
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        ID          = a.ID;
        Merk        = a.Merk;
        Type        = a.Type;
        Category    = a.Category;
        Tranmission = a.Tranmission;
        TranmissionLabel = a.TranmissionLabel;
        Color       = a.Color;
        HPS         = a.HPS;
        Qty         = a.Quantity;
        Price       = a.Price;
        QTYOpponent = a.QuantityOpponent;
        PriceOpp    = a.PriceOpp;
        QTYOpp      = a.QuantityOpp;
    } else {
        dt = $(element).data();
        td_width = "80px";
    }
    if(method == "add_new"){
        i_alert  = '<i class="item-alert sembunyi ti-alert"></i>'
        // i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="'+rowid+'"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a> ';
    }
    if(method == "empty"){
        item = '<tr class="empty"><td colspan="8">Data tidak ada</td></tr>';
    } else if(method == "view" || method == "update" || method == "edit"){
        item = '<tr class="item '+rowid+'">';
        item += '<td></td>';
        item += '<td>'+Merk+'</td>';
        item += '<td>'+Type+'</td>';
        item += '<td>'+Category+'</td>';
        // item += '<td>'+TranmissionLabel+'</td>';
        item += '<td class="text-right">'+number_format(parseInt(HPS))+'</td>';
        item += '<td class="text-right">'+Qty+'</td>';
        item += '<td class="text-right">'+number_format(parseInt(Price))+'</td>';
        item += '<td class="text-right">'+number_format(parseInt(QTYOpponent))+'</td>';
        item += '<td class="text-right">'+number_format(parseInt(PriceOpp))+'</td>';
        item += '<td class="text-right">'+number_format(parseInt(QTYOpp))+'</td>';
        item += '</tr>';
    } else {    
        input_h  = '<input type="hidden" name="DetailCount[]" class="item-count" value="'+rowid+'">';
        input_h  += '<input type="hidden" name="TransactionDetailDetailID[]">';
        input_h  += '<input type="hidden" name="DetailID[]" class="item-id">';
        item = '<tr class="item '+rowid+'">';
        item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
        item += '<td><input name="DetailMerk[]" class="item-merk" type="text" maxlength="30" data-rowid="'+rowid+'" onkeyup="calculation_total_price()"></td>';
        item += '<td><input name="DetailType[]" class="item-type" type="text" maxlength="30" data-rowid="'+rowid+'"></td>';
        item += '<td><input name="DetailCategory[]" class="item-category" type="text" maxlength="30" data-rowid="'+rowid+'"></td>';
        // item += '<td style="font-variant: small-caps;"><select name="DetailTranmission[]"><option value="manual">M/T</option><option value="automatic">A/T</option></select></td>';
        item += '<td><input name="DetailHPS[]" class="item-hps" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-format="duit" data-rowid="'+rowid+'" style="width:'+td_width+';"></td>';
        item += '<td><input name="DetailQty[]" class="item-qty" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'"  style="width:'+td_width+';"></td>';
        item += '<td><input name="DetailPriceQty[]" class="item-price-qty" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" style="width:'+td_width+';"></td>';
        item += '<td><input name="DetailQtyOpp[]" class="item-qty-opp" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" style="width:'+td_width+';"></td>';
        item += '<td><input name="DetailPriceQtyOpps[]" class="item-price-qty-opps" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" style="width:'+td_width+';"></td>';
        item += '<td><input name="DetailQtyOpps[]" class="item-qty-opps" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" data-format="duit" style="width:'+td_width+';"></td>';
        item += '</tr>';
        // <input name="DetailPrice[]" class="item-price" type="text" maxlength="10" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
    }
    $("#table-detail-1 tbody").append(item);
    input_uppersize();
}
function remove_data_detail(element){
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    $("."+dt.rowid).remove();
    calculation_total_price();
}
function calculation_total_price(){
    total           = 0;
    total_price     = 0;
    total_qtyopp    = 0;
    total_price_opps = 0;
    total_qtyopps   = 0;
    jumlah_lawan    = 0;
    total_hps       = 0;
    list = $("#table-detail-1.table-data-detail tbody tr");
    if(list.length > 0){
        $.each(list,function(i,v){
            rowid = v.classList[1];
            class_rowid = "."+rowid;
            id              = $(class_rowid + " .item-id").val();
            merk            = $(class_rowid + " .item-merk").val();
            qty             = $(class_rowid + " .item-qty").val();
            priceqty        = $(class_rowid + " .item-price-qty").val();
            qtyopp          = $(class_rowid + " .item-qty-opp").val();
            priceqtyopps    = $(class_rowid + " .item-price-qty-opps").val();
            qtyopps         = $(class_rowid + " .item-qty-opps").val();
            hps             = $(class_rowid + " .item-hps").val();

            if(id == ""){id=0;}
            if(merk == ""){merk="";}
            if(qty == ""){qty=0;}
            if(priceqty == ""){priceqty=0;}else{ priceqty = priceqty.replace(/\,/g,'')}
            if(qtyopp == ""){qtyopp=0;}else{ qtyopp = qtyopp.replace(/\,/g,'')}
            if(priceqtyopps == ""){priceqtyopps=0;}else{ priceqtyopps = priceqtyopps.replace(/\,/g,'')}
            if(qtyopps == ""){qtyopps=0;}else{ qtyopps = qtyopps.replace(/\,/g,'')}
            if(hps == ""){hps=0;}else{ hps = hps.replace(/\,/g,'')}
            
            id          = parseInt(id);
            qty         = parseInt(qty);
            priceqty    = parseInt(priceqty);
            qtyopp      = parseInt(qtyopp);
            priceqtyopps      = parseInt(priceqtyopps);
            qtyopps     = parseInt(qtyopps);
            hps         = parseInt(hps);
            if(merk && merk != "" && merk.length > 0){
                total           += qty; 
                total_price     += priceqty;
                total_qtyopp    += qtyopp;
                total_price_opps    += priceqtyopps;
                jumlah          = qty * priceqty;
                jumlah_lawan    = qty * priceqtyopps;
                total_qtyopps   += jumlah_lawan;
                total_hps       += hps;
                $(class_rowid + " .item-qty-opp").val(number_format(jumlah));
                $(class_rowid + " .item-qty-opps").val(number_format(jumlah_lawan));
            }
        });
        $(".table-data-detail tfoot .item-total").text(number_format(total));
        $(".table-data-detail tfoot .item-total-price").text(number_format(total_price));
        $(".table-data-detail tfoot .item-total-price-1").text(number_format(total_qtyopp));
        $(".table-data-detail tfoot .item-total-price-2").text(number_format(total_price_opps));
        $(".table-data-detail tfoot .item-total-price-3").text(number_format(total_qtyopps));
        $(".table-data-detail tfoot .item-total-hps").text(number_format(total_hps));
    } else {
        $(".table-data-detail tfoot .item-total").text(number_format(total));
        $(".table-data-detail tfoot .item-total-price").text(number_format(total_price));
        $(".table-data-detail tfoot .item-total-price-1").text(number_format(total_qtyopp));
        $(".table-data-detail tfoot .item-total-price-2").text(number_format(total_price_opps));
        $(".table-data-detail tfoot .item-total-price-3").text(number_format(total_qtyopps));
        $(".table-data-detail tfoot .item-total-hps").text(number_format(total_hps));
    }
}
function GetDataVendor(element){
    dt    = $('#form [name=CustomerID]').find(':selected').data();
    value = $('#form [name=CustomerID]').find(':selected').val();
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
    $("[name=Phone]").val(phone);
    $("[name=Address]").val(address);
}