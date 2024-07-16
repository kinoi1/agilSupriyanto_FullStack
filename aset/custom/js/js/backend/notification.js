var mobile      = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));  
// var host        = window.location.origin+'/discovery/';
var host        = window.location.origin+"/";
var url         = window.location.href;
var url_list    = host + "a_coa/ajax_list/";
var url_edit    = host + "a_coa/edit/";
var url_hapus   = host + "a_coa/delete/";
var url_active  = host + "a_coa/active/";
var url_simpan  = host + "a_coa/save";
var url_update  = host + "a_coa/update";
var url_coa_parent  = host + "api/coa_parent";
var page_name;
var url_modul;
var modul;
var length,start,filter;
$(document).ready(function() {
    data_page   = $(".data-page, .page-data").data();
    page_name   = data_page.page_name;
    url_modul   = data_page.url_modul;
    modul       = data_page.modul;

    filter = 'all';
    length = 10;
    start  = 0;
    load_list_notification("new");
});
var TotalDataReal;
function load_x(elment){
    $(".div-notification .list-notification").empty();
	filter = $(elment).val();
	length = 10;
	start  = 0;
    load_list_notification("new");
}
function load_list_notification(page){
    if(page == "load"){
        start += 10;
    }
    data_post = {
        length : length,
        start : start,
        filter : filter
    }
    console.log(data_post);
    url = host + "api/notification";
    $.ajax({
        url : url,
        type: "POST",
        data : data_post,
        dataType: "JSON",
        success: function(data){
            if(data.HakAkses == "rc"){
                console.log(data);
            }
            if(data.ListData.length > 0){
                $.each(data.ListData,function(i,v){
                    add_item_notif(v);
                });
            } 
            if(page == "new" && data.ListData.length == 0){
                    add_item_notif("none");
            }
            if(data.TotalDataReal <= start || data.ListData.length == 0 || data.ListData.length < 5){
                $(".div-notification .list-notification-btn").hide();
            } else {
                $(".div-notification .list-notification-btn").show();
            }

        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseText);
        }
    });
}
function add_item_notif(v){
    if(v == 'none'){
        item = '<li class="list-group-item"><center><h5 style="padding:50px 0px;">Tidak ada notifikasi untuk anda</h5></center></li>';
        $(".div-notification .list-notification").append(item);
    } else {
        read = '';
        labelread = '';
        if(v.Read == 0){
            read = 'unread';
        }
        item = '<li class="list-group-item item '+read+'">';
        item +='<a href="'+v.Direct+'">';
        item +='<div class="title">'+v.Title+" "+labelread+'</div>';
        item +='<div class="keterangan">'+v.Message+'</div>';
        item +='<div class="tgl"> '+v.Date+'</div>';
        item +='</a>';
        item +='</li>';
        $(".div-notification .list-notification").append(item);
    }

}