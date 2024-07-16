var mobile          = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
var host            = window.location.origin+'/';
var url             = window.location.href;
var page_login      = host + "main/login";
var page_register   = host + "main/register";
var save_method = "add";
var table;
var url_list    = host + "transaction_timesheet/list_data/";
var url_edit    = host + "transaction_timesheet/edit/";
var url_hapus   = host + "transaction_timesheet/delete/";
var url_simpan  = host + "transaction_timesheet/save/";
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
    CraneID      = $('#form-filter [name=CraneID]').find(':selected').val();
    OperatorID   = $('#form-filter [name=OperatorID]').find(':selected').val();
    RiggerID     = $('#form-filter [name=RiggerID]').find(':selected').val();

    data_post   = {
        Filter    : filter,
        InvoiceID : id,
        MenuID    : menuid,
        StartDate : StartDate,
        EndDate   : EndDate,
        CraneID   : CraneID,
        OperatorID: OperatorID,
        RiggerID  : RiggerID,
    }
    console.log(data_post);
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
    if(id && id > 0){
        edit('<span data-id="'+id+'" data-method="view"></span>');
    }
}
function tambah(modul){
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $(".table-data-detail tbody").empty();
    $(".table-data-detail tfoot .action").show();
    $(".table-data-detail tfoot .item-total").text("");
    add_data_detail('add_new','<span data-method="new_data"></span>');
    div_form("open");
    $("#form [name=TransactionTimesheetID]").val("");
    $("#form [name=TransactionCranePoolingID]").val("");
    $("#form [name=Date]").val(CurrentDate);
    $("#form [name=Date]").datepicker( "setDate" , CurrentDate);
    $("#form .select2").val('none').trigger('change');
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
                $(".input-group-addon").addClass("disabled");
                $(".input-group-addon").addClass("text");
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                NextID = a.NextID;
                PrevID = a.PrevID;
                $("#form [name=TransactionTimesheetID]").val(a.TransactionTimesheetID);
                $("#form [name=Code]").val(a.Code);
                $("#form [name=CranePoolingCode]").val(a.Code);
                $("#form [name=WorkType]").val(a.WorkType);
                $("#form [name=VendorName]").val(a.VendorName);
                $("#form [name=PIC]").val(a.PIC);
                $("#form [name=PICPhone]").val(a.PICPhone);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=CraneName]").val(a.CraneName);
                $("#form [name=CraneVehicleNo]").val(a.CraneVehicleNo);
                $("#form [name=OperatorName]").val(a.OperatorName);
                $("#form [name=RiggerName]").val(a.RiggerName);
                $("#form [name=SupirName]").val(a.SupirName);
                $("#form [name=LainlainName]").val(a.LainlainName);
                $("#form [name=StartDate]").val(a.StartDate);
                $("#form [name=EndDate]").val(a.EndDate);

                if(method_before == "view"){
                } else {
                    $("#form input, #form select,#form textarea").addClass("text");
                    $("#form input, #form select,#form textarea").attr("disabled",true);
                    $("#form [name=TransactionTimesheetID],#form [name=Remark], #add-attachment").attr("disabled",false);
                    $("#form [name=TransactionTimesheetID],#form [name=Remark]").removeClass("text");
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
        url = host + 'transaction_timesheet/save/'+save_method;
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
                        $("#form [name=TransactionTimesheetID]").val(json.TransactionTimesheetID);
                        $("#form [name=Code]").val(json.Code);
                        // div_form('change_id');
                        edit('<span data-id="'+json.TransactionTimesheetID+'" data-method="edit"></span>');
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
function add_data_detail(method,element){
    count_tr = $("#table-detail-1 tbody tr").length;
    if(count_tr == 0){
        StartDate = $("#form [name=StartDate]").val();
    } else {
        StartDate = '';
    }
    count_dd = 1 + count_dd;
    rowid    = "item-detail-"+count_dd;
    td_width = "70px";
    i_search = "";
    i_remove = "";
    i_alert  = "";
    disabled = "";
    TransactionDetailID = "";
    Datex       = "";
    StartTime   = "";
    EndTime     = "";
    TotalTime   = "";
    Remark      = "";
    addclass    = "";
    if(element && element.ID){
        a = element;
        if(method == "view"){
            disabled = ' disabled="" ';
            addclass = ' text ';
        }
        TransactionDetailID = a.TransactionDetailID;
        ID        = a.ID;
        Datex     = a.Date;
        StartTime = a.StartTime;
        EndTime   = a.EndTime;
        TotalTime = a.TotalTime;
        Remark    = a.Remark;
    } else {
        dt = $(element).data();
    }
    if(method == "add_new"){
        i_alert  = '<i class="item-alert sembunyi ti-alert"></i>'
        i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_coa(this)" data-rowid="'+rowid+'" data-position="4"><i class="fa fa-search"></i></a> ';
        i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="'+rowid+'"><i class="fa fa-trash"></i></a> ';
    }
    if(method == "empty"){
        item = '<tr class="empty"><td colspan="6">Data tidak ada</td></tr>';
    } else if(method == "view" || method == "update" || method == "edit"){
        item = '<tr class="item '+rowid+'">';
        item += '<td></td>';
        item += '<td>'+Datex+'</td>';
        item += '<td>'+StartTime+'</td>';
        item += '<td>'+EndTime+'</td>';
        item += '<td>'+TotalTime+'</td>';
        item += '<td>'+Remark+'</td>';
        item += '</tr>';
    } else {    
        input_h  = '<input type="hidden" name="DetailCount[]" class="item-count" value="'+rowid+'">';
        item = '<tr class="item '+rowid+'">';
        item += '<td>'+i_alert+i_remove+input_h+'</td>';
        item += '<td><div class="input-group"><span class="input-group-addon pointer"><i class="ti-calendar"></i></span><input name="DetailDate[]" placeholder="dd-mm-yyyy" class="item-date time datexx pointer date-'+rowid+'" type="text" maxlength="10" readonly="" style="text-align:left;padding-left:10px;" value="'+StartDate+'"></div></td>';
        item += '<td><input name="DetailStartTime[]" placeholder="00:00" class="item-starttime time-format" type="text" maxlength="5" style="width:'+td_width+';" onkeyup="calculation_total_price()"></td>';
        item += '<td><input name="DetailEndTime[]" placeholder="00:00" class="item-endtime time-format" type="text" maxlength="5" style="width:'+td_width+';" onkeyup="calculation_total_price()"></td>';
        item += '<td class="item-totaltime"></td>';
        item += '<td><input name="DetailRemark[]" class="item-remark" type="text" maxlength="150" style="width:100%;"></td>';
        item += '</tr>';
    }
    $("#table-detail-1 tbody").append(item);
    if(method == "add_new"){
        datexx();
        timexx();
    }
}
function datexx(startdate,enddate){
    startdate = $("#form [name=StartDate]").val();
    enddate   = $("#form [name=EndDate]").val();
    container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    // if(startdate && enddate){
    //     $(".datexx").datepicker({
    //         format: 'dd-mm-yyyy',
    //         container: container,
    //         todayHighlight: true,
    //         autoclose: true,
    //         startDate : '01-10-2019',
    //         endDate : '10-10-2019',
    //     });
    // } else {    
        $(".datexx").datepicker({
            format: 'dd-mm-yyyy',
            container: container,
            todayHighlight: true,
            autoclose: true,
        });
    // }
    list_dt  = $("#table-detail-1 tbody tr .item-date");
    if(list_dt.length > 1){    
        list_lng1 = (list_dt.length - 2);
        list_lng2 = (list_dt.length - 1);
        StartDate = $(list_dt[list_lng1]).val();
        if(StartDate.length > 0){        
            StartDate   = StartDate.split("-").reverse().join("-");
            StartDate   = new Date(StartDate);
            EndDate     = StartDate.addDays(1);
            EndDate     = formatDate(EndDate).split("-").reverse().join("-");
            EndDate     = $(list_dt[list_lng2]).val(EndDate);
            $(list_dt[list_lng2]).datepicker("setDate",EndDate);
        }
    }
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function formatDate(date) {
    var d   = new Date(date),
    month   = '' + (d.getMonth() + 1),
    day     = '' + d.getDate(),
    year    = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}
function timexx(){
    $('.time-format').formatter({
      'pattern': '{{99}}:{{99}}',
    });
}
function remove_data_detail(element){
    tbody_tr = $("#table-detail-1 tbody tr");
    dt = $(element).data();
    $("."+dt.rowid).remove();
    calculation_total_price();
}
function calculation_total_price(){
    total = 0;
    list = $("#table-detail-1.table-data-detail tbody tr");
    if(list.length > 0){
        $.each(list,function(i,v){
            rowid = v.classList[1];
            class_rowid = "."+rowid;
            StartTime = $(class_rowid + " .item-starttime").val();
            EndTime   = $(class_rowid + " .item-endtime").val();
            hours = EndTime.split(':')[0] - StartTime.split(':')[0],
            minutes = EndTime.split(':')[1] - StartTime.split(':')[1];
            if (StartTime <= "12:00" && EndTime >= "13:00"){
                a = 0;
            } else {
                a = 0;
            }
            minutes = minutes.toString().length<2?'0'+minutes:minutes;
            if(minutes<0){ 
                hours--;
                minutes = 60 + minutes;        
            }
            hours = hours.toString().length<2?'0'+hours:hours;
            if(StartTime.length > 0 && EndTime.length > 0){
                menit = "";
                jam   = "";
                jamx  = hours-a+ '';
                jamx  = parseInt(jamx);
                minutes = parseInt(minutes);
                if(jamx > 0){
                    jam = jamx+' jam';
                }
                if(minutes > 0){
                    menit = minutes+" menit";
                }
                waktu = jam+' '+menit
                $(class_rowid + " .item-totaltime").text(waktu);
            } else {
                $(class_rowid + " .item-totaltime").text("");
            }

        });
    }
}
function pad(num) {
  return ("0"+num).slice(-2);
}
function diffTime(start,end) {
  var s = start.split(":"), sMin = +s[1] + s[0]*60,
      e =   end.split(":"), eMin = +e[1] + e[0]*60,
   diff = eMin-sMin;
  if (diff<0) { sMin-=12*60;  diff = eMin-sMin }
  var h = Math.floor(diff / 60),
      m = diff % 60;
  return "" + pad(h) + ":" + pad(m);
}  