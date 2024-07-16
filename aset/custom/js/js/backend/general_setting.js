var mobile      = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
// var host        = window.location.origin+'/discovery/';
var host        = window.location.origin+"/";
var url         = window.location.href;
var page_name;
var url_modul;
var modul;
var table;
$(document).ready(function() {
    data_page   = $(".data-page, .page-data").data();
    page_name   = data_page.page_name;
    url_modul   = data_page.url_modul;
    modul       = data_page.modul;
    if(modul == "log-app" || modul == "log-api-sap" || modul == "log-api-gps" || modul == "log-login-logout"){
        table_log(modul);
    } else {
        get_setting(modul);
    }
});
function table_log(modul)
{
    url_log = host;
    Type    = "none";
    if(modul == 'log-api-sap'){
        url_log = host +'api/log_api_list';
        Type = "sap";
    } else if(modul == "log-api-gps"){
        url_log = host +'api/log_api_list';
        Type = "gps";
    } else if(modul == "log-login-logout"){
        url_log = host +'api/log_api_list';
        Type = "login";
    } else {
        url_log = host +'api/log_api_list';
        Type    = $("#log-app [name=Type]").find(":selected").val();
    }
    data  = {
        StartDate  : $("[name=StartDate]").val(),
        EndDate    : $("[name=EndDate]").val(),
        Search     : $("[name=Search]").val(),
        CompanyID  : $("[name=CompanyID]").val(),
        Type       : Type 
    }
    table = $('#table').DataTable({
        pageLength: 25,
        paging: true,
        info:true,
        searching: false,
        destroy: true,
        processing: true,
        serverSide: true,
        order: [],
        ajax: {
            url: url_log,
            type: "POST",
            data: data,
            dataSrc : function (json){
              if(json.report == "sales_visiting_time" || json.report == "sales_visiting_remark"){
                $('.total_route').text(json.total_route);
              }
              return json.data;
            },
            error: function (jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        },
        columnDefs: [{
        targets: [0,-1], //last column
        orderable: false, //set not orderable
        },],
    });
}
function reload_table(){
    table.ajax.reload(null,false); //reload datatable ajax
}
function select_timezone(TimeZone){
    $('[name=TimeZone]').val(TimeZone).trigger('change');
}
function get_slideshow(element){
    dt      = $(element).data();
    id      = dt.id;
    modul   = dt.modul;
    get_setting(modul,id);
}
function reset_form(element){
    dt      = $(element).data();
    modul   = dt.modul;
    $('#'+modul)[0].reset();
    img_preview("reset");
}
function get_setting(modul,id){
    if(modul == "edit_slideshow"){
        url     = host + "api/slideshow/edit/"+id;
        form    = $('#slideshow')[0];
        $('#slideshow')[0].reset();
    } else {
        url     = host + "api/get_setting/"+modul;
        form    = $('#'+modul)[0];
    }
    var formData    = new FormData(form);
    console.log(formData);
    $.ajax({
        url : url,
        type: "POST",
        data:  formData,
        mimeType:"multipart/form-data", // upload
        contentType: false, // upload
        cache: false, // upload
        processData:false, //upload
        dataType: "JSON",
        success: function(data)
        {            
            if(data.HakAkses == "rc" || data.HakAkses == "rc_rental" || data.HakAkses == "rc_derek"){
                console.log(data);
            }
            if(modul == 'integration-sap' || modul == "integration-gps"){
                a = data.Data;
                console.table(data);
                console.table(a);
                $('[name=IPAddress]').val(a.IPAddress);
                $('[name=Port]').val(a.Port);
                $('[name=Username]').val(a.Username);
                $('[name=Password]').val(a.Password);
                $('[name=Database]').val(a.Database);
                $('[name=CompanyIDToken]').val(a.CompanyIDToken);
                $('[name=CompanyIDTokenx]').val(a.CompanyIDToken);

                if(a.DatabaseConnectionStatus == true){
                    $(".v_api_connected").show();
                    $("[name=ConnectToSAP], [name=ConnectToGPS]").prop("checked",true);
                    $('[name=ConnectToSAP], [name=ConnectToGPS]').bootstrapSwitch('state', true);

                } else {
                    $(".v_api_connected").hide();
                    $("[name=ConnectToSAP], [name=ConnectToGPS]").prop("checked",false);
                    $('[name=ConnectToSAP], [name=ConnectToGPS]').bootstrapSwitch('state', false);
                }

            } else if(modul == 'slideshow'){
                $.each(data.ListData,function(i,v){
                    add_slideshow_item(v);
                });
            } else if(modul == "edit_slideshow"){
                value = data.Data;
                img_preview("set",value.Patch);

                $("[name=AttachmentID]").val(value.AttachmentID);
                $("[name=Name]").val(value.Name);
                $("[name=NameColor]").val(value.NameColor);
                $("[name=Description]").val(value.Description);
                $("[name=Position]").val(value.Position);

                $.each(value.ButtonLink,function(i,v){
                    BtnIDx = "#BtnID-"+ (i + 1);
                    $(BtnIDx+' .BtnName').val(v.BtnName);
                    $(BtnIDx+' .BtnLink').val(v.BtnLink);
                    $(BtnIDx+' .BtnColor').val(v.BtnColor);
                });

                $('html,body').animate({scrollTop: $("#slideshow").offset().top - 150},'slow');
            } else {            
                $.each(data.ListData,function(i,v){
                    value = v.Value;
                    if(v.Code != "Logo"){
                        $("[name="+v.Code+"]").val(value);
                    } 
                    if(v.Code == 'TimeZone'){
                         $('[name='+v.Code+']').val(value).trigger('change');
                    }
                    if(v.Code == "Logo" || v.Code == "LogoRental" || v.Code == "Logo"){
                        img_preview("set",host + value);
                    }
                    if(v.Code == "CompanyLocation"){
                        if(value){
                            $("#MAP").html(value);
                        }
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}
var switch_sap = 0;
function save_setting(element)
{
    $(element).button('loading');
    dt      = $(element).data();
    modul   = dt.modul;

    if(modul == 'general'|| modul == 'slideshow'){
        if(modul == "general"){
            var file = $('[name=Logo]')[0].files[0];
        } else {
            var file = $('[name=Image]')[0].files[0];
        }
        if(file && file.size > 500000) { //2 MB (this size is in bytes)
            $(element).button("reset");
            toastr.error('Image size too big, size maximum is 500kb',"Information");
            return;
        }
    } else if(modul == "integration-sap-data" || modul == "integration-gps-data"){
        $(".loading").show();
    }
    url     = host + "api/save_setting/"+modul;
    if(modul == "integration-gps-account"){
        var form = $('#integration-gps')[0];
    } else {
        var form = $('#'+modul)[0];
    }
    var formData = new FormData(form);
    $.ajax({
        url : url,
        type: "POST",
        data:  formData,
        mimeType:"multipart/form-data", // upload
        contentType: false, // upload
        cache: false, // upload
        processData:false, //upload
        dataType: "JSON",
        success: function(data)
        {

            if(data.HakAkses == "super_admin"){
                console.log(data);
            }
            if(data.Status){
                if(data.Modul == "slideshow"){
                    $(".list-data-slideshow").empty();
                    $('#'+modul)[0].reset();
                    img_preview("reset");
                    get_setting(modul);
                } else if(data.Modul == "integration-sap" || data.Modul == "integration-gps"){
                    $('[name=CompanyIDToken]').val(data.Data.CompanyIDToken);
                    $('[name=CompanyIDTokenx]').val(data.Data.CompanyIDToken);
                    if(switch_sap == 1){
                        swal("Info",data.Message,"");
                    }
                    if(data.Data.Active == 1){
                        $(".v_api_connected").show();
                    } else {
                        $(".v_api_connected").hide();
                    }
                    switch_sap = 1;
                } else if(data.Modul == "integration-sap-data" || data.Modul == "integration-gps-account"){
                    swal("Info",data.Message,"");
                } else {
                    swal("Info","saving data success","");
                }
            } else {
                if(data.Modul == "slideshow" || data.Modul == "integration-sap" || data.Modul == "integration-gps"){
                    if(data.message){
                        swal("Info",data.message,"warning");
                    } else if(data.Message){
                        swal("Info",data.Message,"");
                    }
                    if(data.Modul == "integration-sap"){
                        $(".v_api_connected").hide();
                    }
                }
            }
            if(modul == "integration-sap-data"){
                $(".loading").hide();
            }
            $(element).button('reset');
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            swal("Info","saving data failed","warning");
            $(element).button('reset');
            console.log(jqXHR.responseText);
            if(modul == "integration-sap-data"){
                $(".loading").hide();
            }
        }
    });

}
function add_slideshow_item(v){
    item = '';
    item +=' <li class="item" data-id="'+v.AttachmentID+'" data-urutan="'+v.Sort+'">';
    item +='   <div class="text">';
    item +='   <div class="title" style="color:'+v.NameColor+' !important;">'+v.Name+'</div>';
    item +='   <div class="description"  style="color:'+v.NameColor+' !important;">'+v.Description+'</div>';
    item +='   </div>'
    item +='   <img src="'+v.Patch+'">';
    item +='   <div class="btn-group width-100 btn-control">';
    item +='      <a class="btn btn-white width-50" onclick="get_slideshow(this)" data-id="'+v.AttachmentID+'" data-modul="edit_slideshow">Edit</a>';
    item +='      <a class="btn btn-white width-50" onclick="delete_item(this)" data-id="'+v.AttachmentID+'" data-modul="slideshow">Delete</a>';
    item +='   </div>';
    item +='</li>';
    $(".list-data-slideshow").append(item);
}

function startCallback(event, ui) {
    // stuff
}
function stopCallback(event, ui) {
    ArrayID = []; 
    ArrayUrutan = [];
    Listul  = $(".list-drag .item");
    $.each(Listul,function(i,v){
      dt = $(v).data();
      id            = dt.id;
      urutan_before = dt.urutan;
      urutan        = i + 1;
      ArrayID.push(id);
      ArrayUrutan.push(urutan);
      $(v).data("urutan",urutan);
      console.log("id : "+id+",  urutan sekarang : " + urutan + ', urutan sebelumnya : '+urutan_before);
    });
    if(modul == "slideshow"){
        save_urutan(ArrayID,ArrayUrutan)
    }
}

$(".list-drag").sortable({
    start: startCallback,
    stop: stopCallback
}).disableSelection();
$(document).ready(function () {
   $("#main-menu-notfix, #main-menu-fix").sortable({
       connectWith: ".taskList",
       placeholder: 'task-placeholder',
       forcePlaceholderSize: true,
       update: function (event, ui) {
           var inprogress   = $("#main-menu-fix").sortable("toArray");
           StopMainMenu();  
       }
   }).disableSelection();

});
function StopMainMenu(){
    menifix      = $("#main-menu-fix .item");
    $.each(menifix,function(i,v){
      dt            = $(v).data();
      id            = dt.id;
      name          = dt.name;
      if(!$(v).hasClass("fix")){
        $(v).addClass("fix");
        item = '<input type="hidden" name="ContentIDFix[]" value="'+id+'" class="ContentIDFix">';
        $(v).append(item);
      }
    });
    $("#main-menu-notfix .item").removeClass("fix");
    $("#main-menu-notfix .item .ContentIDFix").remove();
}



function save_urutan(ArrayID,ArrayUrutan){
    data_post = {
        ArrayID : ArrayID,
        ArrayUrutan : ArrayUrutan,
    };
    url = host + "api/slideshow/ubah_urutan/";
    $.ajax({
        url : url,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function(data){
            if(data.HakAkses == "rc"){
                console.log(data);
            }
            if(data.Status){
                toastr.success("Update sorting data success","Information");
            } else {
                toastr.error("Update failed","Information");
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            toastr.error("Update failed","Information");
            $('#btnSave').button('reset');
            console.log(jqXHR.responseText);
        }
    });
}
function delete_item(element){
    ci_method = "";
    dt      = $(element).data();
    id      = dt.id;
    modul   = dt.modul;
    if(modul == "slideshow"){
        ci_method = "slideshow";
    }
    swal({   
        title: "Info",   
        text: "Are you sure to delete this data ?",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "Ya",   
        cancelButtonText: "Tidak",   
        closeOnConfirm: true,   
        closeOnCancel: true }, 
        function(isConfirm){   
        if (isConfirm) { 
            $.ajax({
                url : host +'api/'+ci_method+'/delete/'+id,
                type: "POST",
                dataType: "JSON",
                success: function(data){
                    if(data.Status){
                        swal("Info", "delete data success", "");   
                    } else {
                        swal("Info", data.message, "");   
                    }
                    if(modul == "slideshow"){
                        $(".list-data-slideshow").empty();
                        get_setting(modul);
                    }
                    remove_overlay();
                },
                error: function (jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                    swal('Info','failed to delete this data');
                    remove_overlay();
                }
            });
        }
    });
}
function modal_log_api(element){
    dt = $(element).data();
    id = dt.id;
    ac = "#modal-log-api";
    $(ac).modal("show");
    $(ac + " .modal-title").text("Detail Data");
    $(ac + " form input").attr("disabled",false);
    $(ac + " form input").attr("disabled",true);
    $(ac + " form input").removeClass("text");
    $(ac + " form input").addClass("text");
    $.ajax({
        url : host +'api/modal_log_api/'+id,
        type: "POST",
        dataType: "JSON",
        success: function(json){
            $(".div-loader").hide();
            console.log(json.Data);
            a = json.Data;
            $(ac + " [name=Date]").val(a.Date);
            $(ac + " [name=IPAddress]").val(a.IPAddress);
            $(ac + " [name=CompanyName]").val(a.CompanyName);
            $(ac + " [name=UserName]").val(a.UserName);
            $(ac + " [name=Type]").val(a.Type);
            $(ac + " [name=Name]").val(a.Name);
            $(ac + " [name=Message]").val(a.Message);
            if(a.Detail){
                $(ac + " .detail-list").empty();
                $.each(a.Detail[0],function(i,v){
                    item = '<li>'+key_name(i,v)+'</li>';
                    $(ac + " .detail-list").append(item);
                })
            }
            if(a.DetailData){
                $(ac + " .detail-list-data").empty();
                $.each(a.DetailData[0],function(i,v){
                    if(i == "Detail"){
						// $.each(v[0],function(ii,vv){
						// 	item = '<li>'+key_name(ii,vv)+'</li>';
						//     $(ac + " .detail-list-data").append(item);
						// });
                    } else {
                    	item = '<li>'+key_name(i,v)+'</li>';
	                    $(ac + " .detail-list-data").append(item);
                    }
                })
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}
function key_name(name,value){
    val = "";
    if(name == "sistem_operasi"){
        name = "sistem operasi";
    } else {
        name = name.replace(/_/g, "");
    }
    if(name == ""){
        val  = "";
    } else {
        val  = name + ' : ' + value;
    }
    return val;
}