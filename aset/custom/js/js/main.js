// author muhammad iqbal ramadhan
// kalau mau tanya silahkan
// IG : akang_ramadhan
// telp: 089621882292
// email : iqbalzt.ramadhan@gmail.com
// job : web programmer dan android programmer  
var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
data_path = $(".path-s3").data();
var hostS3 = 'https://attachment-rc.s3.ap-southeast-1.amazonaws.com/LCCD/LCCD_QA/'; //ini qa
// var hostS3 = 'https://attachment-rc.s3.ap-southeast-1.amazonaws.com/LCCD/LCCD_Live/'; //ini live
// var hostS3 = data_path.s3_path;
var url = window.location.href;
var current_url = window.location.href;
var url_qr = host + 'QRCoder/generate_qr';
var url_qr_act = host + 'QRCoder/act';
var url_diaspora = host + 'diaspora';
var url_search = host + 'search';
var page_detail = page_detail = host + "detail-attraction";
var width = $(window).width();
var width_awal = width;
var $body = $("body"),
  $html = $("html");
var pagenum_notif = 0;
var index_page;
var bahasa;
var start, length;
var modul_requst_modal;
var brandDone = false;
$(document).ready(function () {
  host = window.location.origin + '/';
  data_body = $("body").data();
  data_page = $(".data-page").data();

  length = 5;
  start = 0;
  get_notification("new");
  init_plugin();
});
$(function () {
  $('#VehicleNo').on('keypress', function (e) {
    if (e.which == 32) {
      console.log('Space Detected');
      return false;
    }
  });
  $('#VehicleNoSTNK').on('keypress', function (e) {
    if (e.which == 32) {
      console.log('Space Detected');
      return false;
    }
  });
});
function btn_saving(element, method) {
  if (method == "reset") {
    $(element).button("reset");
    $(element).attr("disabled", false);
  } else {
    $('.form-group').removeClass('has-error');
    $('.help-block').empty();
    $(element).button("loading");
    $(element).attr("disabled", true);
  }
}
function angka() {
  $(".angka").keyup(function () {
    angka = this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  });
  $('#angka1').maskMoney();
  $('#angka2').maskMoney({ prefix: 'US$' });
  $('.rupiah').maskMoney({ prefix: 'Rp. ', thousands: '.', decimal: ',', precision: 0 });
  $('.duit').maskMoney({ thousands: ',', decimal: '.', precision: 0, allowNegative: true });
  $('.perKM').maskMoney({ prefix: 'Rp. ', thousands: '.', decimal: ',', precision: 0, suffix: ' Per KM', });
  $('.perMnt').maskMoney({ prefix: 'Rp. ', thousands: '.', decimal: ',', precision: 0, suffix: ' Per Menit', });
  $('.uang').maskMoney();
  $('.km').maskMoney({ thousands: '.', decimal: ',', precision: 0, suffix: ' KM', });
  $('.persen').maskMoney({ thousands: '', decimal: '.', precision: 2 });
}

function init_plugin() {
  input_uppersize();
  if ($("input").hasClass("waktu")) {
    $('.waktu').formatter({ 'pattern': '{{99}}:{{99}}' });
  }
  var current = location.pathname;
  $('.nav-menu a').each(function () {
    var $this = $(this);
    if ($this.attr('href') == current_url) {
      $this.addClass('active');
    }
  });
  if ($("div").hasClass("modal")) {
    $(".modal-backdrop").mousedown(function (ev) {
      ex = ev.delegateTarget.className;
      clx = $(ev.currentTarget.nextElementSibling);
      if (ev.which == 3) {
        $(".modal").modal("hide");
      }
    });
  }
  if ($("div,input").hasClass("attachment_upload")) {
    {
      img_preview();
    }
  }
  if ($("select").hasClass("coa_select")) {
    coa_select();
  }
  if ($("select").hasClass("brand_select")) {
    brand_select(".brand_select");
  }
  if ($("select").hasClass("type_select")) {
    type_select(".type_select");
  }
  if ($("input").hasClass("search_box")) {
    product_search();
  }
  if ($("select").hasClass("status_pekerjaan_select")) {
    status_pekerjaan_select();
  }
  if ($("select").hasClass("jenis_pekerjaan_select")) {
    jenis_pekerjaan_select();
  }
  if ($("select").hasClass("pegawai_select")) {
    pegawai_select();
  }
  if ($("select").hasClass("agent_select")) {
    agent_select();
  }
  if ($("select").hasClass("vendor_select")) {
    vendor_select("vendor_select");
  }
  if ($("select").hasClass("membership_select")) {
    membership_select("membership_select");
  }
  if ($("select").hasClass("dealer_select")) {
    vendor_select("dealer_select");
  }
  if ($("select").hasClass("lease_select")) {
    vendor_select("lease_select");
  }
  if ($("select").hasClass("dealer_lease_select")) {
    vendor_select("dealer_lease_select");
  }
  if ($("select").hasClass("insurance_select")) {
    vendor_select("insurance_select");
  }
  if ($("select").hasClass("vendor_select_transaction")) {
    vendor_select("vendor_select_transaction");
  }
  if ($("select").hasClass("vendor_select_filter")) {
    vendor_select("vendor_select_filter");
  }
  if ($("select,datalist").hasClass("vehicle_select")) {
    vehicle_select();
  }
  if ($("select").hasClass("province_select")) {
    province_select();
  }
  if ($("select").hasClass("city_select")) {
    city_select(null, null);
  }
  if ($("select").hasClass("city_select_new")) {
    city_select_new("city_select_new");
  }
  if ($("select").hasClass("city_select_new_dari")) {
    city_select_new("city_select_new_dari");
  }
  if ($("select").hasClass("city_select_new_ke")) {
    city_select_new("city_select_new_ke");
  }
  if ($("select, datalist").hasClass("client_select")) {
    client_select();
  }
  if ($("select, datalist").hasClass("project_select")) {
    project_select();
  }
  if ($("input").hasClass("datalist_pic_input")) {
    $(document).on('input', '.datalist_pic_input', function () {
      var options = $('.datalist_pic_list')[0].options;
      for (var i = 0; i < options.length; i++) {
        if (options[i].value == $(this).val()) {
          dt = $(options[i]).data();
          console.log(dt);
          $("#form [name=PIC]").val(dt.name);
          $("#form [name=Phone]").val(dt.phone);
          break;
        }
      }
    });
  }

  if ($("table").hasClass("dataTable")) {
    $(".dataTables_processing").empty();
  }
  // ini khusus modal 
  // if ($("div").hasClass("modal-coa")) {
  //   modal_coa("load");
  // }
  // if ($("div").hasClass("modal-vendor")) {
  //   modal_vendor("load");
  // }
  if ($("input, div").hasClass("date")) {
    datex();
  }
  if ($("input, div").hasClass("date-fix")) {
    dateFix();
  }
  if ($("div,span").hasClass("counter")) {
    $('.counter').counterUp({
      delay: 10,
      time: 1000
    });
  }
  if ($("input").hasClass("dropify")) {
    $('.dropify').dropify();
  }
  if ($("input").hasClass("duit")) {
    angka();
  }

  if ($("select").hasClass("select2")) {
    $(".select2").select2();
  }
  //ini untuk swiper silde
  if ($("div").hasClass("swiper-container")) {
    data_swiper = $(".swiper-container").data();
    swiper_page = data_swiper.page;
    swiper_slide = data_swiper.slide;
    console.log(swiper_page);
    if (swiper_slide > 0) {
      swiperslide = swiper_slide;
    } else {
      swiperslide = 5;
    }
    if (mobile) {
      swiperslide = 1;
    }
    var swiper = new Swiper('.swiper-container', {
      slidesPerView: swiperslide,
      spaceBetween: 30,
      slidesPerGroup: swiperslide,
      loop: true,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  if ($("span").hasClass("wajib")) {
    $(".wajib").html("(*)");
  }
  $(".div-form-sidebar .close").click(function () {
    $(".div-form-sidebar").removeClass("active");
  });
  $(".div-form .show-sidebar").click(function () {
    if ($(".div-form-sidebar").hasClass("active")) {
      $(".div-form-sidebar").removeClass("active");
    } else {
      $(".div-form-sidebar").addClass("active");
    }
  });
  $(".div-form [name=Active]").change(function () {
    if ($(this).val() == 1) {
      if ($("#label-active").hasClass("label-danger")) {
        $("#label-active").removeClass("label-danger").addClass("label-success").text("publish");
      }
    } else {
      if ($("#label-active").hasClass("label-success")) {
        $("#label-active").removeClass("label-success").addClass("label-danger").text("upublish");
      }
    }
  });
  if ($("input").hasClass("switch-checkbox")) {
    $(".switch-checkbox").bootstrapSwitch();
  }
  var input_element = $(".panel-form input");
  input_element.on("keydown", function (e) {
    if (e.keyCode === 13 && e.ctrlKey) {  //click enter
      save($("#btnSaveKeep"));
    } else if (e.keyCode === 13 && e.shiftKey) {  //click enter
      save($("#btnSaveNew"));
    } else if (e.keyCode === 13) {  //click enter
      save($("#btnSaveClose"));
    } else if (e.keyCode === 39 && e.ctrlKey || e.keyCode === 39 && e.shiftKey) {
      if (NextID != "0") {
        div_form("next_data");
      }
    } else if (e.keyCode === 37 && e.ctrlKey || e.keyCode === 37 && e.shiftKey) {
      if (PrevID != "0") {
        div_form("prev_data");
      }
    } else if (e.keyCode === 27) {
      div_form("close");
    }
  });


}
function empty_val(element) {
  dt = $(element).data();
  dt.name;
  if ($("[name=" + dt.name + "]").hasClass("c-disabled")) {

  } else {
    $("[name=" + dt.name + "]").val("");
  }
}
function th_check_all(element) {
  if ($(element).is(":checked")) {
    $(".table .th-checkbox [type=checkbox]").prop("checked", true);
  } else {
    $(".table .th-checkbox [type=checkbox]").prop("checked", false);
  }
}
function datex() {
  container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  $(".date").datepicker({
    format: 'dd-mm-yyyy',
    container: container,
    todayHighlight: true,
    autoclose: true,
  });
}
function dateFix() {
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  $(".date-fix").datepicker({
    format: 'dd-mm-yyyy',
    container: container,
    startDate: new Date(),
    endDate: new Date(), // Set maximum date to today + 1 day
    todayHighlight: true,
    autoclose: true,
  });
}
function input_uppersize() {
  if ($("input, textarea").hasClass("form-control")) {
    $(".panel-form input[type=text], .panel-form textarea, .panel-form-tambahan input[type=text], .panel-form-tambahan textarea").keyup("on", function () {
      x = $(this).val();
      x = $(this).val(x.toUpperCase());
    });
  }
}
function status_pekerjaan_select() {
  select = "all";
  branch = "all";
  active = "2";
  dt = $(".status_pekerjaan_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    select: select,
    active: active
  }
  $.ajax({
    url: host + "api/status_pekerjaan_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          data_tag = 'data-id = "' + v.ID + '" data-name="' + v.Name + '" data-urutan="' + v.Urutan + '"';
          item = '<option value="' + v.ID + '" ' + data_tag + '>' + v.Name + '</option>';
          $(".status_pekerjaan_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data branch, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function jenis_pekerjaan_select() {
  select = "all";
  branch = "all";
  active = "";
  dt = $(".jenis_pekerjaan_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    select: select,
    active: active
  }
  $.ajax({
    url: host + "api/jenis_pekerjaan_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          data_tag = 'data-id = "' + v.ID + '" data-name="' + v.Name + '" data-urutan="' + v.Urutan + '"';
          item = '<option value="' + v.ID + '" ' + data_tag + '>' + v.Name + '</option>';
          $(".jenis_pekerjaan_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error jenis pekerjaan, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function pegawai_select() {
  select = "all";
  branch = "all";
  active = "";
  type = "";
  dt = $(".pegawai_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
    type = dt.type;
  }
  data_post = {
    Select: select,
    Type: type,
    Active: active
  }
  console.log(data_post);
  $.ajax({
    url: host + "api/pegawai_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          Label = v.NickName;
          if (Label == "" || Label == undefined) {
            Label = v.Name;
          }
          item = '<option value="' + v.ID + '" >' + Label + '</option>';
          $(".pegawai_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data employe, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function agent_select() {
  select = "all";
  active = "";
  dt = $(".agent_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    Select: select,
    Active: active
  }
  $.ajax({
    url: host + "api/agent_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          item = '<option value="' + v.ID + '">' + v.Name + '</option>';
          $(".agent_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data employe, please try again');
      console.log(jqXHR.responseText);
    }
  });
}

const membership_select = (classnya) => {
  classnya = "." + classnya;
  select = "all";
  active = "none";
  modul = "none";
  baddebt = "none";
  type = "all";

  data_post = {
    Modul: modul,
    Select: select,
    Active: 1,
  }
  $.ajax({
    url: host + "api/tr_membership_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          Label = v.Label;
          item = '<option value="' + v.ID + '" data-vehicleno="' + v.VehicleNo + '" data-color="' + v.Color + '" data-vendorid="' + v.VendorID + '" data-frameno="' + v.FrameNo + '" data-machineno="' + v.MachineNo + '" data-type="' + v.TypeMembership + '" data-typeid="' + v.TypeID + '" data-brandid="' + v.BrandID + '" data-maxuse="' + v.MaxUse + '" data-expdate="' + v.ExpDate + '" data-remuse="' + v.RemainUse + '">' + Label + '</option>';
          $(classnya).append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data employe, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function vendor_select(classnya) {
  console.log(classnya);
  classnya = "." + classnya;
  select = "all";
  active = "none";
  modul = "none";
  baddebt = "none";
  type = "all";
  dt = $(classnya).data();
  if (dt) {
    select = dt.select;
    active = dt.active;
    if (dt.modul) { modul = dt.modul; }
    if (dt.type) { type = dt.type; }
    if (dt.active == 1 || dt.baddebt == 0) { active = dt.active }
    if (dt.baddebt == 1 || dt.baddebt == 0) { baddebt = dt.baddebt; }
  }
  data_post = {
    Modul: modul,
    Select: select,
    Active: active,
    BadDebt: baddebt,
    Type: type,
  }

  console.log(data_post);
  $.ajax({
    url: host + "api/vendor_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (classnya == "vendor_select_filter") {
        console.log(json);
      }
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          // Label = v.NickName;
          Label = v.Label;
          if (Label == "" || Label == undefined) {
            // Label = v.Name;
            Label = v.Label;
          }
          let isMembership = v.isMembership ? "membership" : "";
          item = '<option class="vendor-opt ' + isMembership + '" value="' + v.ID + '" data-name="' + v.Name + '" data-PPN="' + v.PPN + '" data-pic="' + v.PIC + '" data-mmid="' + v.mmID + '" data-address="' + v.Address + '" data-phone="' + v.Phone + '" data-city="' + v.City + '" data-npwp="' + v.NPWP + '">' + Label + '</option>';
          $(classnya).append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data employe, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function province_select() {
  select = "all";
  branch = "all";
  active = "";
  dt = $(".province_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    select: select,
    active: active
  }
  $.ajax({
    url: host + "api/province_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          item = '<option value="' + v.ID + '" data-id="' + v.ID + '" data-name="' + v.Name + '">' + v.Name + '</option>';
          $(".province_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data province, please try again');
      console.log(jqXHR.responseText);
    }
  });
}

function province_city(element) {
  ID = $(element).find(':selected').val();
  data = $(element).find(':selected').data();
  if (ID > 0) {
    city_select(ID);
  }
}

function city_select(ProvinceID, CityID) {
  select = "all";
  branch = "all";
  active = "";
  dt = $(".city_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    select: select,
    active: active
  }
  $.ajax({
    url: host + "api/city_select/" + ProvinceID,
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          selected = '';
          if (v.ID == CityID) {
            selected = 'selected="selected';
          }

          item = '<option value="' + v.ID + '" data-id="' + v.ID + '" ' + selected + '>' + v.Name + '</option>';
          $(".city_select").append(item);
        });
        if (CityID) {
          $('.city_select').val(CityID).trigger('change');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data province, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function city_select_new(classnya) {
  select = "all";
  branch = "all";
  active = "";
  modul = "";
  dt = $("." + classnya).data();
  if (dt) {
    select = dt.select;
    active = dt.active;
    modul = dt.modul;
  }
  data_post = {
    DataType: "select",
    Select: select,
    Active: active,
    Modul: modul,
  }
  $.ajax({
    url: host + "api/city_select_new/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          div_data = 'data-id="' + v.ID + '" data-name="' + v.Name + '"';
          if (v.ID) {
            item = '<option value="' + v.ID + '" ' + div_data + '>' + v.Code + ' - ' + v.Name + '</option>';
          } else {
            item = '<option>' + v.Name + '</option>';
          }
          $("." + classnya).append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data car, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function vehicle_select() {
  select = "all";
  branch = "all";
  active = "";
  TypeValidation = "";
  medul = "all";
  TypeOrder = $("[name=TypeOrder]").val();
  TransactionContractID = $("[name=TransactionContractID]").val();
  dt = $(".vehicle_select").data();
  if (dt) {
    modul = dt.modul;
    select = dt.select;
    active = dt.active;
  }
  if (modul == "transaction_validation_order") {
    TypeValidation = TypeOrder;
  }
  data_post = {
    Modul: modul,
    DataType: "select",
    Select: select,
    Active: active,
    TypeValidation: TypeValidation,
    TransactionContractID: TransactionContractID,
  }
  // console.log(data_post);
  $(".vehicle_select").empty();
  $.ajax({
    url: host + "api/vehicle_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      // console.log(json);
      item = '<option value="none">Pilih Kendaraan</option>';
      $(".vehicle_select").append(item);
      console.log(json.Data.length);
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          if (v.ID) {
            item = '<option value="' + v.ID + '">' + v.Name + '</option>';
          } else {
            item = '<option>' + v.Name + '</option>';
          }
          $(".vehicle_select").append(item);

        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data car, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function datalist_vehicle(element) {
  dt = $(element).data();
  list = dt.list;
  Search = $(element).val();
  $("datalist#" + list).empty();
  if (Search.length > 2) {
    if (dt) {
      select = dt.select;
      active = dt.active;
    }
    data_post = {
      DataType: "datalist",
      Select: select,
      Active: active,
      Search: Search,
    }
    $.ajax({
      url: host + "api/vehicle_select/",
      type: "POST",
      dataType: "JSON",
      data: data_post,
      success: function (json) {
        if (json.Data.length > 0) {
          $.each(json.Data, function (i, v) {
            item = '<option>' + v.Name + '</option>';
            $("datalist#" + list).append(item);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });
  }
}
function datalist_pic(element) {
  dt = $(element).data();
  list = dt.list;
  Search = $(element).val();
  $("datalist#" + list).empty();
  if (Search.length > 0) {
    if (dt) {
      select = dt.select;
      active = dt.active;
    }
    data_post = {
      DataType: "datalist",
      Select: select,
      Active: active,
      Search: Search,
    }
    $.ajax({
      url: host + "api/pic_select/",
      type: "POST",
      dataType: "JSON",
      data: data_post,
      success: function (json) {
        if (json.Data.length > 0) {
          $.each(json.Data, function (i, v) {
            item = '<option data-name="' + v.Name + '" data-phone="' + v.Phone + '" value="' + v.Name + '">' + v.Name + " - " + v.Phone + '</option>';
            $("datalist#" + list).append(item);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });
  }
}
// function brand_select(){
//   select  = "all";
//   branch  = "all";
//   active  = "";
//   dt = $(".brand_select").data();
//   if(dt){
//     select  = dt.select;
//     active  = dt.active;
//   }
//   data_post = {
//     select : select,
//     active : active
//   }
//   console.log("brand_select");
//   $.ajax({
//         url : host + "api/brand_select/",
//         type: "POST",
//         dataType: "JSON",
//         data:data_post,
//         success: function(json){
//           if(json.Data.length > 0){
//             $.each(json.Data,function(i,v){
//               item = '<option value="'+v.ID+'">'+v.Name+'</option>';
//               $(".brand_select").append(item);
//             });
//           }
//         },
//         error: function (jqXHR, textStatus, errorThrown){
//             alert('error get data brand, please try again');
//             console.log(jqXHR.responseText);
//         }
//     });
// }
function client_select() {
  select = "all";
  branch = "all";
  active = "";
  dt = $(".insurance_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
  }
  data_post = {
    select: select,
    active: active
  }
  $.ajax({
    url: host + "api/client_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          item = '<option value="' + v.ID + '">' + v.Name + '</option>';
          $(".client_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data client, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function project_select() {
  select = "all";
  branch = "all";
  active = "";
  finish = "all";
  rencana = "none";
  modul = "all";
  dt = $(".project_select").data();
  if (dt) {
    select = dt.select;
    active = dt.active;
    rencana = dt.rencana;
    modul = dt.modul;
  }
  data_post = {
    select: select,
    active: active,
    finish: finish,
    rencana: rencana,
    modul: modul
  }
  $.ajax({
    url: host + "api/project_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      if (json.Data.length > 0) {
        $.each(json.Data, function (i, v) {
          item = '<option value="' + v.ID + '">' + v.Name + '</option>';
          $(".project_select").append(item);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data project, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function coa_select() {
  halaman = "all";
  select = "all";
  level = "all";
  selected = false;
  dt = $(".coa_select").data();
  if (dt.select) {
    halaman = dt.halaman;
    select = dt.select;
    active = dt.active;
    level = dt.level;
    selected = dt.selected;
  }
  data_post = {
    Select: select,
    Position: level,
    Active: active
  }
  $('.coa_select').empty();
  $.ajax({
    url: host + "api/coa_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (data) {
      item = '<option value="none">Pilih COA</option>';
      $(".coa_select").append(item);
      if (data.length > 0) {
        $.each(data, function (i, v) {
          item = '<option value="' + v.ID + '" id="COA-CODE-' + v.Code + '" data-name="' + v.Name + '" data-id="' + v.ID + '" data-code="' + v.Code + '" data-position="' + v.Position + '" data-payment="' + v.PaymentType + '">' + v.Code + " - " + v.Name + '</option>';
          $(".coa_select").append(item);
        });
        if (selected) {
          console.log(selected);
          $('.coa_select').val(selected).trigger('change');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function brand_select(classnya) {
  brandDone = false;
  halaman = "all";
  select = "all";
  level = "all";
  selected = false;
  active = "";
  dt = $(classnya).data();
  if (dt.select) {
    halaman = dt.halaman;
    select = dt.select;
    active = dt.active;
    level = dt.level;
    selected = dt.selected;
  }
  data_post = {
    Select: select,
    Position: level,
    Active: active
  }
  $(classnya).empty();
  $.ajax({
    url: host + "api/brand_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      brandDone = true;
      data = json.Data;
      item = '<option value="none">Pilih Brand</option>';
      $(classnya).append(item);
      if (data.length > 0) {
        $.each(data, function (i, v) {
          item = '<option value="' + v.ID + '" id="BRAND-CODE-' + v.Code + '" data-name="' + v.Name + '" data-id="' + v.ID + '" data-code="' + v.Code + '" data-position="' + v.Position + '">' + v.Name + '</option>';
          $(classnya).append(item);
        });
        if (selected) {
          $(classnya).val(selected).trigger('change');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      brandDone = true;
      alert('error get data, please try again');
      console.log(jqXHR.responseText);
    }
  });
}
function type_select(classnya) {
  halaman = "all";
  select = "all";
  level = "all";
  selected = false;
  active = "";
  dt = $(classnya).data();
  if (dt.select) {
    halaman = dt.halaman;
    select = dt.select;
    active = dt.active;
    level = dt.level;
    selected = dt.selected;
  }
  data_post = {
    Select: select,
    Position: level,
    Active: active
  }
  $(classnya).empty();
  $.ajax({
    url: host + "api/type_select/",
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      data = json.Data;
      item = '<option value="none">Pilih Tipe</option>';
      $(classnya).append(item);
      if (data.length > 0) {
        $.each(data, function (i, v) {
          item = '<option value="' + v.ID + '" id="BRAND-CODE-' + v.Code + '" data-parentid="' + v.ParentID + '" data-name="' + v.Name + '" data-id="' + v.ID + '" data-code="' + v.Code + '">' + v.Name + '</option>';
          $(classnya).append(item);
        });
        if (selected) {
          console.log(selected);
          $(classnya).val(selected).trigger('change');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert('error get data, please try again');
      console.log(jqXHR.responseText);
    }
  });
}

var modal_panel_status = 0
function modal_panel(element) {
  data_page = $(".data-page, .page-data").data();
  modul_page = data_page.modul;
  data_post = "";
  panel_data = $(element).data();
  modul_page = panel_data.modul_page;
  modul = panel_data.modul;
  classnya = panel_data.class;
  type = panel_data.type;
  page = panel_data.page;
  if (!type) {
    type = "none";
  } else if (type == "single") {
    type = 0;
  } else if (type == "group") {
    type = 1;
  }
  data_post = {
    page: "modal_panel",
    modul: modul,
    modul_page: modul_page,
    class: classnya,
    Type: type,
  }
  console.log(data_post);
  $(".div-loader").show();
  $("#table-panel").data("class", classnya);
  $('#modal-panel').modal('show'); // show bootstrap modal
  $('#modal-panel .modal-title').text('Modul'); // Set Title to Bootstrap modal title
  url = 'api/modal_panel/';
  $('#table-panel').DataTable({
    destroy: true,
    processing: true, //Feature control the processing indicator.
    serverSide: true, //Feature control DataTables' server-side processing mode.
    order: [], //Initial no order.
    // Load data for the table's content from an Ajax source
    "ajax": {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    //Set column definition initialisation properties.
    columnDefs: [{
      targets: [], //last column
      orderable: false, //set not orderable
    },],
  });
}
function chose_panel(element_chose) {
  data_page = $(".data-page, .page-data").data();
  modul_page = data_page.modul;
  chose_data = $(element_chose).data();
  classnya = chose_data.class;
  ID = chose_data.id;
  Code = chose_data.code;
  Name = chose_data.name;
  Type = chose_data.type;
  Point = chose_data.point;
  Modul = chose_data.modul;
  classnya = chose_data.class;
  $('#modal-panel').modal("hide");
  if (Type == 1) {
    console.log(classnya);
    $(".table-add tbody ." + classnya).remove();
    ambil_panel_detail(ID);
  } else {
    $(".panelid-" + classnya).val(ID);
    $(".panelname-" + classnya).val(Name);
    $(".panelpoint-" + classnya).val(Point);
  }


  if (modul_page == "Module") {
    hitung_point("modal");
  }
}
function ambil_panel_detail(ModuleID) {

  data_post = {
    Page: "panel_detail",
    ModuleID: ModuleID,
  }
  url = host + "api/panel/";
  $.ajax({
    url: url,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      console.log(json);
      $.each(json.Data, function (i, v) {
        tambah_panel("modal", v);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });
}



function modal_panel_detail(element) {
  de = $(element).data();
  panelid = de.class;
  ModuleID = de.moduleid;
  if (!ModuleID) {
    ModuleID = $("." + panelid).val();
  }
  if (ModuleID > 0) {
    $(".div-loader").hide();
    $('#modal-panel-detail').modal("show");
    $('#modal-panel-detail .modal-title').text("Panel Detail");
    $('#modal-panel-detail #table-panel-detail tbody').empty();
    data_post = {
      page: 'modal_panel_detail',
      modul: 'modal',
      class: "none",
      ModuleID: ModuleID,
    }
    url = 'api/modal_panel/';
    $('#table-panel-detail').DataTable({
      destroy: true,
      processing: true, //Feature control the processing indicator.
      serverSide: true, //Feature control DataTables' server-side processing mode.
      order: [], //Initial no order.
      // Load data for the table's content from an Ajax source
      "ajax": {
        url: url,
        type: "POST",
        data: data_post,
        dataSrc: function (json) {
          $(".div-loader").hide();
          return json.data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }
      },
      //Set column definition initialisation properties.
      columnDefs: [{
        targets: [], //last column
        orderable: false, //set not orderable
      },],
    });
  }
}
function modal_pegawai(element) {
  data_page = $(".data-page, .page-data").data();
  modul_page = data_page.modul;
  data_post = "";
  panel_data = $(element).data();
  modul_page = panel_data.modul_page;
  modul = panel_data.modul;
  classnya = panel_data.class;
  type = panel_data.type;
  page = panel_data.page;
  data_post = {
    page: "modal_pegawai",
    modul: modul,
    modul_page: modul_page,
    class: classnya,
  }
  $(".div-loader").show();
  $("#table-pegawai").data("class", classnya);
  $('#modal-pegawai').modal('show'); // show bootstrap modal
  $('#modal-pegawai .modal-title').text('panel'); // Set Title to Bootstrap modal title
  $("#modal_pegawai .row-pilih").hide();
  $("#modal_pegawai .row-no").show();
  url = 'api/modal_pegawai/';
  $('#table-pegawai').DataTable({
    destroy: true,
    processing: true, //Feature control the processing indicator.
    serverSide: true, //Feature control DataTables' server-side processing mode.
    order: [], //Initial no order.
    // Load data for the table's content from an Ajax source
    "ajax": {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    //Set column definition initialisation properties.
    columnDefs: [{
      targets: [], //last column
      orderable: false, //set not orderable
    },],
  });
}
function chose_pegawai(element_chose) {
  data_page = $(".data-page, .page-data").data();
  modul_page = data_page.modul;
  chose_data = $(element_chose).data();
  classnya = chose_data.class;
  ID = chose_data.id;
  Code = chose_data.code;
  Name = chose_data.name;
  Type = chose_data.type;
  Point = chose_data.point;
  Modul = chose_data.modul;
  classnya = chose_data.class;
  $('#modal-pegawai').modal("hide");
  $(".panelid-" + classnya).val(ID);
  $(".panelname-" + classnya).val(Name);
  $(".panelpoint-" + classnya).val(Point);
}
var modal_tarif_active = 0;
function modal_tarif(element) {
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul_page = dte.modul_page;
  modul = dte.modul;
  rowid = dte.rowid;
  WorkType = dte.worktype;
  page = dte.page;
  FromCityID = $('#form [name=FromCityID]').find(':selected').val();
  data_post = {
    page: "modal_tarif",
    modul: modul,
    modul_page: modul_page,
    class: rowid,
    WorkType: WorkType,
    FromCityID: FromCityID
  }
  if (modul == "transaction_receive_order") {
    if (WorkType == "emergency" && FromCityID == "0") {
      toastr.error("Kota Dari tidak boleh kosong", "Information");
      return;
    }
  }


  $(".div-loader").show();
  $("#table-tarif").data("class", rowid);
  $('#modal-tarif').modal('show');
  $('#modal-tarif .modal-title').text('Tarif');
  $("#modal_tarif .row-pilih").hide();
  $("#modal_tarif .row-no").show();
  url = host + 'api/modal_tarif/';
  $('#table-tarif').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_tarif_active == 0) {
    modal_tarif_active = 1;
    $('#table-tarif tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul == "transaction_receive_order") {
        list = $(".table-data-detail tbody .item");
        if (list.length == 0) {
          $(".table-data-detail tbody").empty();
        }
        add_data_detail("add_new", {
          TransactionDetailID: dx.id,
          ID: dx.id,
          Name: dx.name,
          Price: number_format(dx.price),
        });
        calculation_total_price();
      } else {
        $("." + rowid + " .item-id").val(dx.id);
        $("." + rowid + " .item-qty").val(1);
        $("." + rowid + " .item-name").val(dx.name);
        $("." + rowid + " .item-price").val(number_format(dx.price));
        $("." + rowid + " .item-unit").val(dx.unit);
        $("." + rowid + " .item-qty-txt").text(dx.name);
        $("." + rowid + " .item-name-txt").text(dx.name);
        $("." + rowid + " .item-unit-txt").text(dx.unit);
        $("." + rowid + " .item-price-txt").text(number_format(dx.price));
        $("." + rowid + " .item-sub-total-txt").text(dx.price);
        calculation_total_price();
      }
      $('#modal-tarif').modal('hide');
    });
  }
}

var modal_vehicle_active = 0;
function modal_vehicle(element) {
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul_page = dte.modul_page;
  modul = dte.modul;
  rowid = dte.rowid;
  type = dte.type;
  page = dte.page;
  if (modul == "transaction_vehicle_send" || modul == "transaction_vehicle_exchange") {
    TransactionContractID = $("[name=TransactionContractID]").val();
    TransactionContractDetailID = $("[name=TransactionContractDetailID]").val();
    Merk = $("[name=MerkFilter]").val();
    Type = $("[name=TypeFilter]").val();
    Category = $("[name=CategoryFilter]").val();
    Tranmission = $("[name=TranmissionFilter]").val();
    Color = $("[name=ColorFilter]").val();
    if (modul == "transaction_vehicle_send") {
      VehicleNo = $("[name=VehicleNoFilter]").val();
    }
    if (TransactionContractID == "" || TransactionContractID < 1) {
      toastr.error("Silakan pilih No. Transaksi (Contract) terlebih dahulu", "Information");
      $(".ContractCodeAlert").text("Silakan pilih No. Transaksi (Contract) terlebih dahulu");
      $(".ContractCodeAlert").parent().addClass("has-error");
      return;
    }
    data_post = {
      page: "modal_vehicle",
      modul: modul,
      modul_page: modul_page,
      class: rowid,
      TransactionContractID: TransactionContractID,
      TransactionContractDetailID: TransactionContractDetailID,
      Merk: Merk,
      Type: Type,
      Category: Category,
      Tranmission: Tranmission,
      Color: Color,
      VehicleNo: VehicleNo,
    }
  } else if (modul == "transaction_contract") {
    // console.log($('#table-detail-1 .item-merk[data-rowid="'+rowid+'"]').val());
    Merk = $('#table-detail-1 .item-merk[data-rowid="' + rowid + '"]').val();
    Type = $('#table-detail-1 .item-type[data-rowid="' + rowid + '"]').val();
    Category = $('#table-detail-1 .item-category[data-rowid="' + rowid + '"]').val();
    Tranmission = $('#table-detail-1 .item-tranmission[data-rowid="' + rowid + '"]').val();
    Color = $('#table-detail-1 .item-color[data-rowid="' + rowid + '"]').val();
    data_post = {
      page: "modal_vehicle",
      modul: modul,
      modul_page: modul_page,
      class: rowid,
      Merk: Merk,
      Type: Type,
      Category: Category,
      Tranmission: Tranmission,
      Color: Color,
    }
  } else {
    data_post = {
      page: "modal_vehicle",
      modul: modul,
      modul_page: modul_page,
      class: rowid,
    }
  }
  $(".div-loader").show();
  $("#table-vehicle").data("class", rowid);
  $('#modal-vehicle').modal('show');
  $('#modal-vehicle .modal-title').text('vehicle');
  $("#modal_vehicle .row-pilih").hide();
  $("#modal_vehicle .row-no").show();
  url = host + 'api/modal_vehicle/';
  $('#table-vehicle').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_vehicle_active == 0) {
    modal_vehicle_active = 1;
    $('#table-vehicle tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      $("." + rowid + " .item-id").val(dx.id);
      if (modul == "transaction_vehicle_sell") {
        $("." + rowid + " .item-name-text").text(dx.name);
        $("." + rowid + " .item-price").val(number_format(dx.price));
        $("." + rowid + " .item-price-text").text(number_format(dx.price));
        calculation_total_price();
      } else if (modul == "transaction_service") {
        $("#form [name=VehicleID]").val(dx.id);
        $("#form [name=VehicleName]").val(dx.vehicleno);
        $("#form [name=Merk]").val(dx.merk);
        $("#form [name=Category]").val(dx.category);
        $("#form [name=VehicleType]").val(dx.type);
        $("#form [name=Model]").val(dx.model);
        $("#form [name=Color]").val(dx.color);
        calculation_total_price();
      } else if (modul == "transaction_vehicle_send" || modul == "transaction_vehicle_exchange") {
        $("#form [name=VehicleID]").val(dx.id);
        $("#form [name=VehicleName]").val(dx.vehicleindexno + ' - ' + dx.vehicleno);
        $("#form [name=MerkType]").val(dx.merk + ' - ' + dx.type);
        $("#form [name=Model]").val(dx.model);
        $("#form [name=MachineNo]").val(dx.machineno);
        $("#form [name=FrameNo]").val(dx.frameno);
        $("#form [name=Color]").val(dx.color);
        if (modul == "transaction_vehicle_send") {
          $("#form [name=TransactionContractDetailID]").val(dx.transactioncontractdetailid);
        }
      } else if (modul == "transaction_contract") {
        $('#table-detail-1 .item-vehicleid[data-rowid="' + rowid + '"]').val(dx.id);
        $('#table-detail-1 .item-merk[data-rowid="' + rowid + '"]').val(dx.merk);
        $('#table-detail-1 .item-type[data-rowid="' + rowid + '"]').val(dx.type);
        $('#table-detail-1 .item-category[data-rowid="' + rowid + '"]').val(dx.category);
        // $('#table-detail-1 .item-category[data-rowid="'+rowid+'"]').val(dx.tranmission);
        $('#table-detail-1 .item-tranmission[data-rowid="' + rowid + '"]').val(dx.tranmission);
        // $('#table-detail-1 .item-tranmission[data-rowid="'+rowid+'"] option[value='+dx.tranmission+']').attr('selected','selected');
        $('#table-detail-1 .item-color[data-rowid="' + rowid + '"]').val(dx.color);
        $('#table-detail-1 .item-vehicle-no[data-rowid="' + rowid + '"]').val(dx.vehicleno);
      }
      $('#modal-vehicle').modal('hide');
    });
  }
}

var modal_coa_active = 0;
function modal_coa(element) {
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  position = "none";
  dte = $(element).data();
  modul_page = dte.modul_page;
  modul = dte.modul;
  rowid = dte.rowid;
  type = dte.type;
  page = dte.page;
  if (dte.position) {
    position = dte.position;
  }
  data_post = {
    page: "modal_coa",
    modul: modul,
    modul_page: modul_page,
    class: rowid,
    position: position,
  }
  $(".div-loader").show();
  $("#table-coa").data("class", rowid);
  $('#modal-coa').modal('show');
  $('#modal-coa .modal-title').text('Chart Of Account');
  $("#modal_coa .row-pilih").hide();
  $("#modal_coa .row-no").show();
  url = host + 'api/modal_coa/';
  $('#table-coa').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_coa_active == 0) {
    modal_coa_active = 1;
    $('#table-coa tbody').on('click', 'tr', function () {
      element_a = this.childNodes[1].childNodes[0];
      dx = $(element_a).data();
      $("." + rowid + " .item-id").val(dx.id);
      $("." + rowid + " .item-code").val(dx.code);
      $("." + rowid + " .item-code-txt").text(dx.code);
      $("." + rowid + " .item-name").val(dx.name);
      $("." + rowid + " .item-name-txt").text(dx.name);
      if (modul_page == "pengaturan_coa") {
        $("." + rowid).val(dx.code + ' ' + dx.name);
        $("." + rowid).next().val(dx.id + '|' + dx.code + '|' + dx.name);
      } else {
        calculation_total_price();
      }
      $('#modal-coa').modal('hide');
    });
  }
}


var modal_rfq_click_count = 0;
var modal_rfq_active = 0;
function modal_rfq(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-rfq").data("class", rowid);
  $('#modal-rfq').modal('show');
  $('#modal-rfq .modal-title').text('Pengadaa RFQ');
  url = host + 'api/modal_rfq/';
  $('#table-rfq').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_rfq_active == 0) {
    modal_rfq_active = 1;
    $('#table-rfq tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_contract") {
        $("[name=TransactionRFQID]").val(dx.id);
        $("[name=RFQCode]").val(dx.code);
        $("[name=CustomerID]").val(dx.customerid);
        $("[name=CustomerName]").val(dx.customername);
        $("[name=Phone]").val(dx.phone);
        $("[name=Address]").val(dx.address);
        $("[name=PPN]").val(dx.ppn);
        if (dx.ppn == 1) {
          $("[name=PPNx]").prop("checked", true);
        } else {
          $("[name=PPNx]").prop("checked", false);
        }
        modal_rfq_click(dx.id);
        $('#modal-rfq').modal('hide');
      } else {
        $('#modal-rfq').modal('hide');
      }
    });
  }
}
function modal_rfq_click(id) {
  modal_rfq_click_count = modal_rfq_click_count + 1;
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .item-total").text("");

  if (modul_requst_modal == "transaction_receive_order") {
    url_msr = host + "transaction_survey_result/edit_detail/" + id + '/TransactionSurveyRequestID';
  } else {
    url_msr = host + "transaction_rfq/edit/" + id + '/ListData';
  }
  data_post = {
    modul: modul_requst_modal,
  }
  $.ajax({
    url: url_msr,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      if (json.HakAkses == "rc") {
        console.log(json);
      }
      if (json.Status) {
        if (json.Data.ListData) {
          if (json.Data.ListData.length > 0) {
            $.each(json.Data.ListData, function (i, v) {
              add_data_detail("add_new", v);
            });
          }
          calculation_total_price();
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    }
  });
  return;
}
var modal_contract_click_count = 0;
var modal_contract_active = 0;
function modal_contract(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  id_table = "#table-contract";
  if (modul == "transaction_contract_novasi") {
    $(id_table).hide();
    id_table += '-normal';
    $(id_table).show();
    $("#modal-contract").removeClass("modal-80");
  } else {
    $(id_table + '-normal').hide();
  }
  $(".div-loader").show();
  $(id_table).data("class", rowid);
  $('#modal-contract').modal('show');
  $('#modal-contract .modal-title').text('Kontrak Kerja');
  url = host + 'api/modal_contract/';
  $(id_table).DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_contract_active == 0) {
    modal_contract_active = 1;
    $(id_table + ' tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_vehicle_send" || modul_requst_modal == "transaction_vehicle_exchange" || modul_requst_modal == "transaction_validation_order") {
        $("[name=TransactionContractID]").val(dx.id);
        $("[name=TransactionContractDetailID]").val(dx.transactioncontractdetailid);
        // $("[name=ContractCode]").val(dx.code);
        $("[name=ContractCode]").val(dx.customercode);
        $("[name=CustomerID]").val(dx.customerid);
        $("[name=CustomerName]").val(dx.customername);
        $("[name=VendorName]").val(dx.customername);
        $("[name=Phone]").val(dx.phone);
        $("[name=Address]").val(dx.address);

        $("[name=Price]").val(dx.price);
        $("[name=Pricex]").val(number_format(dx.price));

        $("[name=MerkFilter]").val(dx.merk);
        $("[name=TypeFilter]").val(dx.type);
        $("[name=CategoryFilter]").val(dx.category);
        $("[name=TranmissionFilter]").val(dx.tranmission);
        $("[name=ColorFilter]").val(dx.color);

        if (modul_requst_modal == "transaction_vehicle_send") {
          $("[name=PoolAddress]").val(dx.pooladdress);
          $("[name=VehicleNoFilter]").val(dx.vehicleno);
        }

        // REFRESH DATA VEHICLE
        if ($("select").hasClass("vehicle_select")) {
          vehicle_select();
        }
        $(".input-vehicle").val("");

        calculation_last_price();
        $('#modal-contract').modal('hide');
      } else if (modul_requst_modal == "transaction_contract_novasi") {
        edit('<span data-id="' + dx.id + '" data-method="novasi_kontrak"></span>');
        $('#modal-contract').modal('hide');
      } else {
        $('#modal-contract').modal('hide');
      }
    });
  }
}
var modal_vehicle_send_click_count = 0;
var modal_vehicle_send_active = 0;
function modal_vehicle_send(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-vehicle-send").data("class", rowid);
  $('#modal-vehicle-send').modal('show');
  $('#modal-vehicle-send .modal-title').text('Kirim Kendaraan');
  url = host + 'api/modal_vehicle_send/';
  $('#table-vehicle-send').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_vehicle_send_active == 0) {
    modal_vehicle_send_active = 1;
    $('#table-vehicle-send tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      $("[name=TransactionValidationOrderID]").val(dx.transactionvalidationorderid);
      $("[name=TransactionContractID]").val(dx.transactioncontractid);
      $("[name=TransactionContractDetailID]").val(dx.transactioncontractdetailid);
      $("[name=SendVehicleCode]").val(dx.code);
      $("[name=CustomerID]").val(dx.customerid);
      $("[name=CustomerName]").val(dx.customername);
      $("[name=Address]").val(dx.address);
      if (modul_requst_modal == "transaction_vehicle_pooling") {
        $("[name=VehicleID]").val(dx.vehicleid);
        $("[name=VehicleName]").val(dx.vehiclename);
        $("[name=MerkType]").val(dx.merktype);
        $("[name=Model]").val(dx.model);
        $("[name=Color]").val(dx.color);
        $("[name=MachineNo]").val(dx.machineno);
        $("[name=FrameNo]").val(dx.frameno);
        $('#modal-vehicle-send').modal('hide');
      } else if (modul_requst_modal == "transaction_vehicle_exchange") {
        $("[name=VehicleSendCode]").val(dx.code);
        $("[name=MerkFilter]").val(dx.merk);
        $("[name=TypeFilter]").val(dx.type);
        $("[name=CategoryFilter]").val(dx.category);
        $("[name=TranmissionFilter]").val(dx.tranmission);
        $("[name=ColorFilter]").val(dx.color);

        $('#modal-vehicle-send').modal('hide');
      } else {
        $('#modal-vehicle-send').modal('hide');
      }
    });
  }
}

var modal_vehicle_exchange_click_count = 0;
var modal_vehicle_exchange_active = 0;
function modal_vehicle_exchange(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-vehicle-exchange").data("class", rowid);
  $('#modal-vehicle-exchange').modal('show');
  $('#modal-vehicle-exchange .modal-title').text('Kirim Kendaraan');
  url = host + 'api/modal_vehicle_exchange/';
  $('#table-vehicle-exchange').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_vehicle_exchange_active == 0) {
    modal_vehicle_exchange_active = 1;
    $('#table-vehicle-exchange tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_vehicle_send") {
        $("[name=TransactionValidationOrderID]").val(dx.transactionvalidationorderid);
        $("[name=TransactionContractID]").val(dx.transactioncontractid);
        $("[name=TransactionContractDetailID]").val(dx.transactioncontractdetailid);
        $("[name=TransactionVehicleExchangeID]").val(dx.transactionvehicleexchangeid);
        $("[name=ContractCode]").val(dx.contractcode);
        $("[name=VehicleExchangeCode]").val(dx.code);
        $("[name=VehicleID]").val(dx.vehicleid);
        $("[name=CustomerID]").val(dx.customerid);
        $("[name=CustomerName]").val(dx.customername);
        // $("[name=Address]").val(dx.address);
        $("[name=VehicleName]").val(dx.vehiclename);
        $("[name=MerkType]").val(dx.merktype);
        $("[name=Model]").val(dx.model);
        $("[name=MachineNo]").val(dx.machineno);
        $("[name=FrameNo]").val(dx.frameno);
        $('#modal-vehicle-exchange').modal('hide');
      } else {
        $('#modal-vehicle-exchange').modal('hide');
      }
    });
  }
}
var modal_vehicle_sell_click_count = 0;
var modal_vehicle_sell_active = 0;
function modal_vehicle_sell(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;

  merk = dte.merk;
  type = dte.type;
  year = dte.year;

  data_post = {
    modul: modul,
    Merk: merk,
    Type: type,
    Year: year,
  }
  $(".div-loader").show();
  $("#table-vehicle-sell").data("class", rowid);
  $('#modal-vehicle-sell').modal('show');
  $('#modal-vehicle-sell .modal-title').text('Penjualan Mobil');
  url = host + 'api/modal_vehicle_sell/';
  $('#table-vehicle-sell').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  // if(modal_vehicle_sell_active == 0){
  //   modal_vehicle_sell_active = 1;
  //   $('#table-vehicle-sell tbody').on('click', 'tr', function () {
  //       element = this.childNodes[1].childNodes[0]; 
  //       dx = $(element).data();
  //       if(modul_requst_modal == "transaction_vehicle_send"){
  //         $('#modal-vehicle-sell').modal('hide');
  //       }  else {
  //         $('#modal-vehicle-sell').modal('hide');
  //       }
  //   }); 
  // }
}
var modal_vehicle_service_click_count = 0;
var modal_vehicle_service_active = 0;
function modal_vehicle_service(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;

  vehicleid = dte.vehicleid;
  startdate = dte.startdate;
  enddate = dte.enddate;

  data_post = {
    modul: modul,
    VehicleID: vehicleid,
    StartDate: startdate,
    EndDate: enddate
  }
  $(".modal .div-loader").show();
  $("#table-vehicle-service").data("class", rowid);
  $('#modal-vehicle-service').modal('show');
  $('#modal-vehicle-service .modal-title').text('Maintenance & Service');
  url = host + 'api/modal_vehicle_service/';
  $('#table-vehicle-service').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
}

var modal_vehicle_insurance_click_count = 0;
var modal_vehicle_insurance_active = 0;
function modal_vehicle_insurance(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;

  vehicleid = dte.vehicleid;
  startdate = dte.startdate;
  enddate = dte.enddate;

  data_post = {
    modul: modul,
    VehicleID: vehicleid,
    StartDate: startdate,
    EndDate: enddate
  }
  $(".modal .div-loader").show();
  $("#table-vehicle-insurance").data("class", rowid);
  $('#modal-vehicle-insurance').modal('show');
  $('#modal-vehicle-insurance .modal-title').text('Asuransi');
  url = host + 'api/modal_vehicle_insurance/';
  $('#table-vehicle-insurance').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
}

var modal_survey_request_click_count = 0;
var modal_survey_request_active = 0;
function modal_survey_request(element) {

  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-survey-request").data("class", rowid);
  $('#modal-survey-request').modal('show');
  $('#modal-survey-request .modal-title').text('Permintaan Survei');
  url = host + 'api/modal_survey_request/';
  $('#table-survey-request').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_survey_request_active == 0) {
    modal_survey_request_active = 1;
    $('#table-survey-request tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_survey_result") {
        $("[name=TransactionSurveyRequestID]").val(dx.id);
        $("[name=Code]").val(dx.code);
        $("[name=RequestCode]").val(dx.code);
        modal_survey_request_click(dx.id);
        $('#modal-survey-request').modal('hide');
      } else if (modul_requst_modal == "transaction_receive_order") {
        $("[name=TransactionSurveyRequestID]").val(dx.id);
        $("[name=RequestCode]").val(dx.code);
        if (dx.marketingid > 0) {
          $("#form [name=MarketingID").val(dx.marketingid);
          $("#form [name=MarketingID").val(dx.marketingid).trigger('change');
        }
        if (dx.agentid) {
          $("#form [name=AgentID").val(dx.agentid);
          $("#form [name=AgentID").val(dx.agentid).trigger('change');
        }

        modal_survey_request_click(dx.id);
        $('#modal-survey-request').modal('hide');
      } else if (modul_requst_modal == "transaction_validation_order") {
        $("[name=TransactionSurveyRequestID]").val(dx.id);
        $("[name=RequestCode]").val(dx.code);
        modal_survey_request_click(dx.id);
        $('#modal-survey-request').modal('hide');
      } else if (modul_requst_modal == "transaction_invoice") {
        $("." + rowid + " .item-id").val(dx.id);
        $("." + rowid + " .item-code").val(dx.code);
        $("." + rowid + " .item-code-txt").text(dx.code);
        $("." + rowid + " .item-date").val(dx.date);
        $("." + rowid + " .item-date-txt").text(dx.date);
        $('#modal-survey-request').modal('hide');
        calculation_total_price();
      } else {
        $('#modal-survey-request').modal('hide');
      }
      // $("."+rowid +" .item-id").val(dx.id);
      // $("."+rowid +" .item-qty").val(1);
      // $("."+rowid +" .item-name").val(dx.name);
      // $("."+rowid +" .item-price").val(dx.price);
      // $("."+rowid +" .item-unit").val(dx.unit);
      // $("."+rowid +" .item-qty-txt").text(dx.name);
      // $("."+rowid +" .item-name-txt").text(dx.name);
      // $("."+rowid +" .item-unit-txt").text(dx.unit);
      // $("."+rowid +" .item-price-txt").text(number_format(dx.price));
      // $("."+rowid +" .item-sub-total-txt").text(dx.price);
      // calculation_total_price();
    });
  }
}

function modal_survey_request_click(id) {
  modal_survey_request_click_count = modal_survey_request_click_count + 1;
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .item-total").text("");

  if (modul_requst_modal == "transaction_receive_order") {
    url_msr = host + "transaction_survey_result/edit_detail/" + id + '/TransactionSurveyRequestID';
  } else if (modul_requst_modal == "transaction_validation_order") {
    url_msr = host + "transaction_survey_result/edit_detail/" + id + '/TransactionSurveyRequestID';
  } else {
    url_msr = host + "transaction_survey_request/edit/" + id + '/ListData';
  }
  data_post = {
    modul: modul_requst_modal,
  }
  $.ajax({
    url: url_msr,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      if (json.HakAkses == "rc") {
        console.log(json);
      }
      if (json.Status) {
        if (json.Data.ListData) {
          if (json.Data.ListData.length > 0) {
            $.each(json.Data.ListData, function (i, v) {
              add_data_detail("add_new", v);
            });
          }
          calculation_total_price();
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    }
  });
  return;
}

var modal_survey_result_click_count = 0;
var modal_survey_result_active = 0;
function modal_survey_result(element) {

  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-survey-result").data("class", rowid);
  $('#modal-survey-result').modal('show');
  $('#modal-survey-result .modal-title').text('Hasil Survei');
  url = host + 'api/modal_survey_result/';
  $('#table-survey-result').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_survey_result_active == 0) {
    modal_survey_result_active = 1;
    $('#table-survey-result tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_validation_order") {
        $("[name=TransactionSurveyResultID]").val(dx.id);
        $("[name=ResultCode]").val(dx.code);
        modal_survey_result_click(dx.id);
        $('#modal-survey-result').modal('hide');
      } else {
        $('#modal-survey-result').modal('hide');
      }
    });
  }
}
function modal_survey_result_click(id) {
  modal_survey_result_click_count = modal_survey_result_click_count + 1;
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .item-total").text("");
  $.ajax({
    url: host + "transaction_survey_result/edit/" + id + '/ListData',
    type: "GET",
    dataType: "JSON",
    success: function (json) {
      if (json.HakAkses == "rc") {
        console.log(json);
      }
      if (json.Status) {
        if (json.Data.ListData) {
          if (json.Data.ListData.length > 0) {
            $.each(json.Data.ListData, function (i, v) {
              add_data_detail("add_new", v);
            });
          }
          calculation_total_price();
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    }
  });
  return;
}

var modal_receive_order_click_count = 0;
var modal_receive_order_active = 0;
function modal_receive_order(element) {

  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  VendorID = $('#form [name=VendorID]').find(':selected').val();
  data_post = {
    modul: modul,
    VendorID: VendorID,
  }
  $(".div-loader").show();
  $("#table-receive-order").data("class", rowid);
  $('#modal-receive-order').modal('show');
  $('#modal-receive-order .modal-title').text('Terima Order');
  url = host + 'api/modal_receive_order/';
  $('#table-receive-order').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_receive_order_active == 0) {
    modal_receive_order_active = 1;
    $('#table-receive-order tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_validation_order") {
        $("[name=TransactionReceiveOrderID]").val(dx.id);
        $("[name=ReceiveCode]").val(dx.code);
        modal_receive_order_click(dx.id);
        $('#modal-receive-order').modal('hide');
      } else if (modul_requst_modal == "transaction_invoice") {
        $("." + rowid + " .item-id").val(dx.id);
        $("." + rowid + " .item-vendorid").val(dx.vendorid);
        $("." + rowid + " .item-code").val(dx.code);
        $("." + rowid + " .item-code-txt").text(dx.code);
        $("." + rowid + " .item-date").val(dx.date);
        $("." + rowid + " .item-date-txt").text(dx.date);

        $('#modal-receive-order').modal('hide');
      } else {
        $('#modal-receive-order').modal('hide');
      }
    });
  }
}
function modal_receive_order_click(id) {
  modal_receive_order_click_count = modal_receive_order_click_count + 1;
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .item-total").text("");
  $.ajax({
    url: host + "transaction_receive_order/edit/" + id + '/data',
    type: "GET",
    dataType: "JSON",
    success: function (json) {
      console.log(json);
      if (json.ConsoleLog == true) {
        console.log(json);
      }
      if (json.Status) {
        if (modul_requst_modal == "transaction_validation_order") {
          console.log(json);
          $("[name=TransactionReceiveOrderID]").val(json.Data.TransactionReceiveOrderID);
          $("[name=ReceiveCode]").val(json.Data.Code);
          $("#form [name=VendorID]").val(json.Data.VendorID);
          $("#form [name=VendorName]").val(json.Data.VendorName);
          $("#form [name=ReferenceCode]").val(json.Data.ReferenceCode);
          $("#form [name=Terms]").val(json.Data.VendorTerms);
          $("#form [name=Address]").val(json.Data.Address);
          $("#form [name=ReductionPrice]").val(json.Data.ReductionPrice);
          $("#form [name=Price]").val(json.Data.TotalPrice);
          $("#form [name=Pricex]").val(number_format(json.Data.TotalPrice));

          // $("#form [name=FromCityID]").val(json.Data.FromCityID);
          // $("#form [name=FromCityID").val(json.Data.FromCityID).trigger('change');
          $("#form [name=FromCityName]").val(json.Data.FromCityName);
          $("#form [name=FromAddress]").val(json.Data.FromAddress);
          $("#form [name=FromGoogleAddress]").val(json.Data.FromGoogleAddress);
          $("#form [name=FromLatLng]").val(json.Data.FromLatLng);
          $("#form [name=ToCityID]").val(json.Data.ToCityID);
          // $("#form [name=ToCityID").val(json.Data.ToCityID).trigger('change');
          $("#form [name=ToCityName]").val(json.Data.ToCityName);
          $("#form [name=ToAddress]").val(json.Data.ToAddress);
          $("#form [name=ToGoogleAddress]").val(json.Data.ToGoogleAddress);
          $("#form [name=FromLat]").val(json.Data.FromLat);
          $("#form [name=FromLng]").val(json.Data.FromLng);
          $("#form [name=ToLat]").val(json.Data.ToLat);
          $("#form [name=ToLng]").val(json.Data.ToLng);
          $("#form [name=ToLatLng]").val(json.Data.ToLatLng);

          calculation_last_price();
        }
        if (json.Data.ListData) {
          if (json.Data.ListData.length > 0) {
            $.each(json.Data.ListData, function (i, v) {
              add_data_detail("add_new", v);
            });
          }
          calculation_total_price();
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    }
  });
  return;
}
var modal_receive_order_detail_click_count = 0;
var modal_receive_order_detail_active = 0;
function modal_receive_order_detail(element) {

  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-receive-order-detail").data("class", rowid);
  $('#modal-receive-order-detail').modal('show');
  $('#modal-receive-order-detail .modal-title').text('Terima Order - Pekerjaan');
  url = host + 'api/modal_receive_order_detail/';
  $('#table-receive-order-detail').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_receive_order_detail_active == 0) {
    modal_receive_order_detail_active = 1;
    $('#table-receive-order-detail tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      console.log(dx);
      if (modul_requst_modal == "transaction_validation_order") {
        $("[name=TransactionReceiveOrderDetailID]").val(dx.id);
        $("[name=TransactionReceiveOrderID]").val(dx.transactionreceiveorderid);
        $("[name=ProductID]").val(dx.productid);
        $("[name=ReceiveCode]").val(dx.code);
        $("[name=VendorID]").val(dx.vendorid);
        $("[name=VendorName]").val(dx.vendorname);
        $("[name=ProductName]").val(dx.productname);
        $("[name=ProductUnit]").val(dx.productunit);
        $("[name=Terms]").val(dx.vendorterms);
        $("[name=Address]").val(dx.address);
        $("[name=Price]").val(dx.totalprice);
        $("[name=Pricex]").val(number_format(dx.totalprice));
        calculation_last_price();
        $('#modal-receive-order-detail').modal('hide');
      } else {
        $('#modal-receive-order-detail').modal('hide');
      }
    });
  }
}
var modal_validation_order_click_count = 0;
var modal_validation_order_active = 0;
function modal_validation_order(element) {
  console.log(element);
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  console.log(data_post);
  $(".div-loader").show();
  $("#table-validation-order").data("class", rowid);
  $('#modal-validation-order').modal('show');
  $('#modal-validation-order .modal-title').text('Validasi Order');
  url = host + 'api/modal_validation_order/';
  $('#table-validation-order').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_validation_order_active == 0) {
    modal_validation_order_active = 1;
    $('#table-validation-order tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      console.log('fjiehfi');
      if (modul_requst_modal == "transaction_crane_pooling" || modul_requst_modal == "transaction_fix_problem") {
        $("[name=TransactionValidationOrderID]").val(dx.id);
        $("[name=TransactionReceiveOrderID]").val(dx.transactionreceiveorderid);
        $("[name=Android]").val(dx.android);
        $("div.rating").empty();
        arrRating = [...Array(5).keys()];
        if (arrRating.length > 0) {
          dtRating = '';
          $.each(arrRating, function (i, v) {
            if (i < Math.round(dx.rating)) {
              dtRating += '<i class="fa fa-star" style="color: gold"></i>';
            } else {
              dtRating += '<i class="fa fa-star"></i>';
            }
          })
          $("div.rating").append(dtRating);
        }
        $("[name=Review]").val(dx.review);
        $("[name=CraneID]").val(dx.craneid);
        $("[name=VehicleID]").val(dx.vehicleid);
        $("[name=ValidationCode]").val(dx.code);
        $("[name=ReceiveCode]").val(dx.receivecode);
        $("[name=ProductID]").val(dx.productid);
        $("[name=ProductName]").val(dx.productname);
        $("[name=CraneName]").val(dx.cranename);
        $("[name=VehicleName]").val(dx.vehiclename);
        $("[name=OperatorName]").val(dx.operatorname);
        $("[name=RiggerName]").val(dx.riggername);
        $("[name=SupirName]").val(dx.supirname);
        $("[name=LainlainName]").val(dx.lainlainname);
        $("[name=MarketingName]").val(dx.marketingname);
        $("[name=AgentName]").val(dx.agentname);
        $("[name=BBMLiterStandard]").val(dx.bbmstandard);
        $("[name=OperatorID]").val(dx.operatorid);
        $("[name=RiggerID]").val(dx.riggerid);
        $("[name=SupirID]").val(dx.supirid);
        $("[name=LainlainID]").val(dx.lainlainid);
        $("[name=Terms]").val(dx.vendorterms);
        $("[name=TripMoney]").val(dx.tripmoney);
        $(".total-trip-money").text(dx.tripmoney);
        $("[name=DespoisteMoney]").val(dx.depositemoney);
        $("[name=Price]").val(dx.totalprice);
        $("[name=TotalPaymentAR]").val(dx.totalprice);
        $("[name=TotalPaymentAP]").val(dx.totalprice);
        $("[name=BillingName]").val(dx.billingname);
        $("[name=BillingAddress]").val(dx.billingaddress);
        $("[name=BillingCity]").val(dx.billingcity);
        $("[name=BillingNPWP]").val(dx.billingnpwp);
        $("[name=OdometerStart]").val(dx.lastodometer);
        $("[name=PhoneConsumen]").val(dx.phoneconsumen);
        $("[name=VehicleNo]").val(dx.vehicleno);
        $("[name=TotalPrice]").val(dx.totalprice);
        $("[name=AgentID]").val(dx.agentid);
        $("[name=MarketingID]").val(dx.marketingid);
        $("[name=CategoryVehicle]").val(dx.categoryvehicle);
        $("[name=FromCityPoint]").val(dx.fromcitypoint);
        $("[name=ToCityPoint]").val(dx.tocitypoint);
        $("[name=Email]").val(dx.vendoremail);
        if (modul_requst_modal == "transaction_crane_pooling") {

          let str = dx.lastodometer;
          let datalastodometer = str.toString().replace(/[^\w\s]/gi, '');
          // console.log(parseInt(datalastodometer));
          $("[name=OdoBefore]").val(parseFloat(datalastodometer));
          validation_order_click(dx.transactionreceiveorderid, dx.id);
        }
        if (dx.ppn == 1) {
          TotalPrice = dx.totalprice;
          if (TotalPrice.length > 0) {
            TotalPrice = TotalPrice.replace(/\,/g, '');
          }
          TotalPrice = parseFloat(TotalPrice);
          $("[name=Pricexx]").val(number_format(TotalPrice));
          TotalPPN = 10 * TotalPrice / 100;
          TotalPrice = TotalPrice + TotalPPN;
          $("[name=Pricex]").val(number_format(TotalPrice));
          $("[name=TotalPaymentAR]").val(number_format(TotalPrice));
          $("[name=TotalPaymentAP]").val(number_format(TotalPrice));
          $("#PPN, #PPH").prop("checked", true);
        } else {
          $("#PPN, #PPH").prop("checked", false);
          $("[name=Pricex]").val(dx.totalprice);
          $("[name=Pricexx]").val(dx.totalprice);
          $("[name=TotalPaymentAR]").val(dx.totalprice);
          $("[name=TotalPaymentAP]").val(dx.totalprice);
        }
        // modal_validation_order_click(dx.id);
        $('#modal-validation-order').modal('hide');
      } else {
        $('#modal-validation-order').modal('hide');
      }
      calculation_total_price();
    });
  }
}
function validation_order_click(id, validationid = "") {
  modal_validation_order_click_count = modal_validation_order_click_count + 1;
  url_msr = host + "transaction_receive_order/edit/" + id + '/ListData';
  data_post = {
    modul: modul_requst_modal,
    valid: validationid,
  }
  $.ajax({
    url: url_msr,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      if (json.ConsoleLog == true) {
        console.log(json);
      }
      a = json.Data;
      console.log(a);
      $("#form [name=TransactionReceiveOrderID]").val(a.TransactionReceiveOrderID);
      $("#form [name=VendorID]").val(a.VendorID);
      $("#form [name=Name]").val(a.Name);
      $("#form [name=ReferenceCode]").val(a.ReferenceCode);
      $("#form [name=PIC]").val(a.PIC);
      $("#form [name=Phone]").val(a.Phone);
      $("#form [name=Address]").val(a.Address);
      $("#form [name=VendorID]").val(a.VendorID);
      // $("#form [name=BillingID]").val(a.BillingID).trigger('change');
      $("#form [name=VendorName]").val(a.VendorName);
      $("#form [name=AgentID]").val(a.AgentID);
      $("#form [name=AgentID").val(a.AgentID).trigger('change');
      $("#form [name=AgentName]").val(a.AgentName);
      $("#form [name=MarketingID]").val(a.MarketingID);
      $("#form [name=MarketingID").val(a.MarketingID).trigger('change');
      $("#form [name=MarketingName]").val(a.MarketingName);
      // $("#form [name=BillingName]").val(a.BillingName);
      // $("#form [name=BillingAddress]").val(a.BillingAddress);
      // $("#form [name=BillingCity]").val(a.BillingCity);
      // $("#form [name=BillingNPWP]").val(a.BillingNPWP);
      $("#form [name=ProductType]").val(a.ProductType);
      $("#form [name=FromCityID]").val(a.FromCityID).trigger('change');
      $("#form [name=FromCityName]").val(a.FromCityName);
      $("#form [name=FromAddress]").val(a.FromAddress);
      $("#form [name=FromGoogleAddress]").val(a.FromGoogleAddress);
      $("#form [name=FromLatLng]").val(a.FromLatLng);
      $("#form [name=ToCityID]").val(a.ToCityID).trigger('change');
      $("#form [name=ToCityName]").val(a.ToCityName);
      $("#form [name=ToAddress]").val(a.ToAddress);
      $("#form [name=ToGoogleAddress]").val(a.ToGoogleAddress);
      $("#form [name=FromLat]").val(a.FromLat);
      $("#form [name=FromLng]").val(a.FromLng);
      $("#form [name=ToLat]").val(a.ToLat);
      $("#form [name=ToLng]").val(a.ToLng);
      $("#form [name=ToLatLng]").val(a.ToLatLng);
      $("#form [name=BrandID]").val(a.BrandID);
      $("#form [name=BrandID").val(a.BrandID).trigger('change');
      $("#form [name=BrandName]").val(a.BrandName);
      $("#form [name=TypeID]").val(a.TypeID);
      $("#form [name=TypeID").val(a.TypeID).trigger('change');
      $("#form [name=TypeName]").val(a.TypeName);
      $("#form [name=StatusSupir]").val(a.StatusSupir);
      $("#form [name=StatusAndroid]").val(a.StatusAndroid);
      if (a.VehicleCondition != null) {
        $("#form [name=VehicleCondition]").val(a.VehicleCondition.toLowerCase());
      }
      $("#form [name=VehicleCondition]").val();
      $("#form [name=VehicleConditionRemark]").val(a.VehicleConditionRemark);
      $("#form [name=VehicleNo]").val(a.VehicleNo);
      $("#form [name=Color]").val(a.Color);
      WorkType = a.WorkType != null ? a.WorkType.toUpperCase() : '';
      $("#form [name=WorkTypeName]").val(WorkType);
      $("#form [name=WorkType]").val(WorkType);
      GetWorkType(a.WorkType);
      if (a.VehicleCondition == "lain-lain") {
        $(".div-vehicle-condition").show();
      } else {
        $(".div-vehicle-condition").hide();
      }
      if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
        $(".list-attachment .item-attachment").remove();
        $.each(json.Data.ListAttachment, function (i, v) {
          add_attachment('update', v);
        });
      }
      if (json.Data.ListData) {
        if (json.Data.ListData.length > 0) {
          $.each(json.Data.ListData, function (i, v) {
            add_data_detail(method_before, v);
          })
        } else {
          add_data_detail('empty');
        }
      } else {
        add_data_detail('empty');
      }
      function add_data_detail(method, element) {
        count_dd = 1 + count_dd;
        rowid = "item-detail-" + count_dd;
        td_width = "120px";
        i_search = "";
        i_remove = "";
        i_alert = "";
        disabled = "";
        TransactionDetailID = "";
        ID = "";
        Name = "";
        Unit = "";
        Qty = "";
        Price = "";
        MealPrice = "";
        SubTotal = "";
        addclass = "";
        if (element && element.ID) {
          a = element;
          if (method == "view") {
            disabled = ' disabled="" ';
            addclass = ' text ';
          }
          TransactionDetailID = a.TransactionDetailID;
          ID = a.ID;
          Name = a.Name;
          Unit = a.Unit;
          Price = a.Price;
        } else {
          dt = $(element).data();
        }
        if (method == "add_new") {
          i_alert = '<i class="item-alert sembunyi ti-alert"></i>'
          i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="' + rowid + '"><i class="fa fa-search"></i></a> ';
          i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
        }

        if (method == "empty") {
          item = '<tr class="empty"><td colspan="3">Data tidak ada</td></tr>';
        } else if (method == "view" || method == "update" || method == "edit") {
          item = '<tr class="item ' + rowid + '">';
          item += '<td></td>';
          item += '<td>' + Name + '</td>';
          item += '<td class="text-right">' + Price + '</td>';
          item += '</tr>';
        } else {
          input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
          input_h += '<input type="hidden" name="TransactionDetailID[]" value="' + TransactionDetailID + '">';
          input_h += '<input type="hidden" name="DetailID[]" class="item-id" value="' + ID + '">';
          input_h += '<input type="hidden" name="DetailName[]" class="item-name" value="' + Name + '">';
          input_h += '<input type="hidden" name="DetailPrice[]" class="item-price" value="' + Price + '">';
          item = '<tr class="item ' + rowid + '">';
          item += '<td>' + i_alert + '<div class="btn-group btn-xs">' + i_search + i_remove + '</div>' + input_h + '</td>';
          item += '<td class="item-name-txt">' + Name + '</td>';
          item += '<td class="item-price-txt text-right">' + Price + '</td>';
          item += '</tr>';
          // <input name="DetailPrice[]" class="item-price" type="text" maxlength="17" onkeyup="calculation_total_price()" oninput="isNumber(this)" data-rowid="'+rowid+'" style="width:'+td_width+';">
        }
        $("#table-detail-1 tbody").append(item);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data kendaraan");
    }
  });
  return;
}


var modal_crane_pooling_click_count = 0;
var modal_crane_pooling_active = 0;
function modal_crane_pooling(element) {

  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-crane-pooling").data("class", rowid);
  $('#modal-crane-pooling').modal('show');
  $('#modal-crane-pooling .modal-title').text('Crane Kembali');
  url = host + 'api/modal_crane_pooling/';
  $('#table-crane-pooling').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_crane_pooling_active == 0) {
    modal_crane_pooling_active = 1;
    $('#table-crane-pooling tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      if (modul_requst_modal == "transaction_timesheet") {
        $("#form [name=TransactionCranePoolingID]").val(dx.id);
        $("#form [name=CranePoolingCode]").val(dx.code);
        $("#form [name=WorkType]").val(dx.worktype);
        $("#form [name=VendorID]").val(dx.vendorid);
        $("#form [name=VendorName]").val(dx.vendorname);
        $("#form [name=PIC]").val(dx.pic);
        $("#form [name=PICPhone]").val(dx.picphone);
        $("#form [name=Address]").val(dx.address);
        $("#form [name=OperatorName]").val(dx.operatorname);
        $("#form [name=RiggerName]").val(dx.riggername);
        $("#form [name=SupirName]").val(dx.supirname);
        $("#form [name=LainlainName]").val(dx.lainlainname);
        $("#form [name=CraneID]").val(dx.craneid);
        $("#form [name=CraneName]").val(dx.cranebackno);
        $("#form [name=CraneVehicleNo]").val(dx.cranevehicleno);
        $("#form [name=OperatorID]").val(dx.operatorid);
        $("#form [name=RiggerID]").val(dx.riggerid);
        $("#form [name=SupirID]").val(dx.supirid);
        $("#form [name=LainlainID]").val(dx.lainlainid);
        $("#form [name=StartDate]").val(dx.startdate);
        $("#form [name=EndDate]").val(dx.enddate);
        $("#form [name=StartDate]").datepicker("setDate", dx.startdate);
        $("#form [name=EndDate]").datepicker("setDate", dx.enddate);
        $(".item-date").val(dx.startdate);
        $(".item-date").datepicker("setDate", dx.startdate);
        $('#modal-crane-pooling').modal('hide');
      } else {
        $('#modal-crane-pooling').modal('hide');
      }
    });
  }
}
var modal_down_payment_click_count = 0;
var modal_down_payment_active = 0;
function modal_down_payment(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  VendorID = $('#form [name=VendorID]').find(':selected').val();
  data_post = {
    modul: modul,
    VendorID: VendorID
  }
  $(".div-loader").show();
  $("#table-down-payment").data("class", rowid);
  $('#modal-down-payment').modal('show');
  $('#modal-down-payment .modal-title').text('Down Payment');
  url = host + 'api/modal_down_payment/';
  $('#table-down-payment').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_down_payment_active == 0) {
    modal_down_payment_active = 1;
    // $('#table-down-payment tbody').on('click', 'tr', function () {
    //     element = this.childNodes[1].childNodes[0]; 
    //     dx = $(element).data();
    //     if(modul_requst_modal == "transaction_timesheet"){
    //       $("[name=TransactionCranePoolingID]").val(dx.id);
    //       $("[name=CranePoolingCode]").val(dx.code);
    //       $("[name=WorkType]").val(dx.worktype);
    //       $("[name=VendorID]").val(dx.vendorid);
    //       $("[name=VendorName]").val(dx.vendorname);
    //       $("[name=PIC]").val(dx.pic);
    //       $("[name=PICPhone]").val(dx.picphone);
    //       $("[name=Address]").val(dx.address);
    //       $("[name=OperatorName]").val(dx.operatorname);
    //       $("[name=RiggerName]").val(dx.riggername);
    //       $("[name=SupirName]").val(dx.supirname);
    //       $("[name=LainlainName]").val(dx.lainlainname);
    //       $("[name=CraneID]").val(dx.craneid);
    //       $("[name=CraneName]").val(dx.cranebackno);
    //       $("[name=CraneVehicleNo]").val(dx.cranevehicleno);
    //       $("[name=OperatorID]").val(dx.operatorid);
    //       $("[name=RiggerID]").val(dx.riggerid);
    //       $("[name=SupirID]").val(dx.supirid);
    //       $("[name=LainlainID]").val(dx.lainlainid);
    //       $("[name=StartDate]").val(dx.startdate);
    //       $("[name=EndDate]").val(dx.enddate);
    //       $('#modal-down-payment').modal('hide');
    //     } else {
    //       $('#modal-down-payment').modal('hide');
    //     }
    // }); 
    $("#modal-down-payment .simpan-downpayment").on('click', function () {
      list_dp = $("#table-down-payment tbody tr");
      totaldp = 0;
      TotalDownPaymentDetail = [];
      $.each(list_dp, function (i, v) {
        element = v.childNodes[1].childNodes[0];
        dx = $(element).data();
        rowid = dx.rowid;
        if ($("." + rowid + "[type=checkbox]").is(":checked")) {
          id = dx.id;
          price = $("." + rowid + ".item-price").val();
          if (price.length > 0) {
            price = price.replace(/\,/g, '');
          } else {
            price = 0;
          }
          price = parseInt(price);
          totaldp += price;
          detail = {
            PaymentDetailID: dx.id,
            InvoiceID: dx.invoiceid,
            Price: price,
          }
          TotalDownPaymentDetail.push(detail);
        }
      });
      TotalDownPaymentDetail = JSON.stringify(TotalDownPaymentDetail);
      $("[name=TotalDownPayment]").val(number_format(totaldp));
      $("[name=TotalDownPaymentDetail]").val(TotalDownPaymentDetail);
      calculation_total_price();
      $('#modal-down-payment').modal('hide');
    });
  }
}
var modal_query_active = 0;
function modal_query(element) {
  if ($(element).hasClass("disabled")) {
    return;
  }
  dt = $(".data-page, .page-data").data();
  modul_page = dt.modul;
  data_post = "";
  dte = $(element).data();
  modul = dte.modul;
  rowid = dte.rowid;
  modul_requst_modal = modul;
  data_post = {
    modul: modul,
  }
  $(".div-loader").show();
  $("#table-query").data("class", rowid);
  $('#modal-query').modal('show');
  $('#modal-query .modal-title').text('List Query');
  $("#modal_query .row-pilih").hide();
  $("#modal_query .row-no").show();
  url = host + 'api/modal_query/';
  $('#table-query').DataTable({
    destroy: true,
    processing: true,
    serverSide: true,
    order: [],
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        $(".div-loader").hide();
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [],
      orderable: false,
    },],
  });
  if (modal_query_active == 0) {
    modal_query_active = 1;
    $('#table-query tbody').on('click', 'tr', function () {
      element = this.childNodes[1].childNodes[0];
      dx = $(element).data();
      modal_query_click(dx.id);
      $('#modal-query').modal('hide');
    });
  }
}
function modal_query_click(id) {
  modal_receive_order_click_count = modal_receive_order_click_count + 1;
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .item-total").text("");
  $.ajax({
    url: host + "report/wizard_query_edit/" + id,
    type: "GET",
    dataType: "JSON",
    success: function (json) {
      if (json.HakAkses == "rc") {
        console.log(json);
      }
      if (json.Status) {
        console.log(json);
        console.log(modul_requst_modal);
        if (modul_requst_modal == "index_wizard") {
          $("[name=QueryID]").val(json.Data.QueryID);
          $("[name=QueryName]").val(json.Data.QueryName);
          $("#QueryNameTxt").text(json.Data.QueryName);
          codemirror.setValue(json.Data.Query);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    }
  });
  return;
}
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function isNumber(element) {
  dt = $(element).data();
  format = dt.format;
  if (format == "duit_keep_max") {
    value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(?!^)-/g, '');
    value_max = dt.value;
    if (value.length > 0) {
      if (value_max.length > 0) {
        value_max = value_max.replace(/\,/g, '');
      }
      value = parsefloat(value);
      value_max = parsefloat(value_max);
      if (value > value_max) {
        value = value_max;
      }
    }
    element.value = value;
  } else if (format == "duit") {
    console.log(value);
    value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(?!^)-/g, '');
    element.value = value;
  } else if (format == "time") {
    value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(?!^)-/g, '');
    element.value = value;
  } else if (format == 'duit_negatif') {

  }else {
    element.value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1').replace(/(?!^)-/g, '');
  }
}
function isUppercase(element) {
  element.value = element.value.toUpperCase();
}
function tanya_agen() {
  $(".help-block").empty();
}
function kirim_pesan(page) {

  Kirim = false;
  $("#btn-kirim-pesan").button('loading');
  $(".help-block").empty();
  $("#form-kirim-pesan input, #form-kirim-pesan textarea").each(function (i, v) {
    name = $(this)[0].name;
    value = $(this)[0].value;
    message = " tidak boleh kosong";
    if (value == "") {
      label = "";
      if (name == "Subject") {
        label = "Subjek";
      } else if (name == "Name") {
        label = "Nama";
      } else if (name == "Email") {
        label = "Email";
      } else if (name == "Phone") {
        label = "No Telepon";
      } else if (name == "Message") {
        label = "Pesan";
      } else if (page == "contact_us" && name == "BranchID") {
        label = false;
        alert("silakan untuk memilih kantor cabang dahulu");
      }
      if (label != false) {
        $(this).next().addClass("error");
        next = $(this).next().text(label + message);
      }
      Kirim = false;
    } else if (name == "Email" && validateEmail(value) == "") {
      Kirim = false;
      $(this).next().addClass("error");
      next = $(this).next().text("Email tidak valid");
    } else {
      Kirim = true;
    }
  });
  if (Kirim == true) {
    url = host + "api/send_email/" + page;
    $.ajax({
      url: url,
      type: "POST",
      data: $('#form-kirim-pesan').serialize(),
      dataType: "JSON",
      success: function (data) {
        console.log(data);
        if (data.status) {
          swal("kirim pesan berhasil", "", '');
          $('#form-kirim-pesan .vreset').val("");
        } else {
          swal("kirim pesan gagal", "", 'warning');
        }
        $("#btn-kirim-pesan").button('reset');
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
        swal('', "kirim pesan gagal", 'danger');
        $("#btn-kirim-pesan").button('reset');
      }
    });
  } else {
    $("#btn-kirim-pesan").button('reset');
  }
}
function Formatmoney() {
  $('.duit').each(function () { // function to apply mask on load!
    $(this).maskMoney('mask', $(this).val());
  })
}
function remove_overlay() {
  $("body").removeClass("stop-scrolling");
}
function validateNumber(e) {
  // Allow: backspace, delete, tab, escape, enter and .
  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
    // Allow: Ctrl/cmd+A
    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: Ctrl/cmd+C
    (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: Ctrl/cmd+X
    (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: home, end, left, right
    (e.keyCode >= 35 && e.keyCode <= 39)) {
    // let it happen, don't do anything
    return;
  }
  // Ensure that it is a number and stop the keypress
  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
    e.preventDefault();
  }
}

function scroll_notification() {
  $('.li-notification .notification-list').scroll(function () {
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
      get_notification("load");
    }
  });
}

var TotalDataReal;
function get_notification(page) {
  if (page == "load") {
    start += 5;
  } else {
    start = 0;
    scroll_notification();
    $(".li-notification .notification-list").empty();
  }
  data_post = {
    length: length,
    start: start
  }
  console.log(data_post);
  url = host + "api/notification";
  $.ajax({
    url: url,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (data) {
      if (data.HakAkses == "rc") {
        console.log(data);
      }
      if (data.TotalDataUnread > 0) {
        $(".notif-count").show().text(data.TotalDataUnread);
      }
      if (data.ListData.length > 0) {
        $.each(data.ListData, function (i, v) {
          add_item_notifx(v);
        });
      } else {
        if (page != "load") {
          add_item_notifx("none");
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      console.log("gagal mengambil data notification");
    }
  });
}
function notification_read(method) {
  url = host + "api/notification_read/" + method;
  $.ajax({
    url: url,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (data) {
      if (data.HakAkses == "rc") {
        console.log(data);
      }
      if (method == "all") {
        $(".list-notification .item").removeClass("unread");
        $(".notif-count").hide().text(0);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      console.log("gagal menandai pesan sudah dibaca");
    }
  });
}
function add_item_notifx(v) {
  if (v == 'none') {
    item = '<a class="list-group-item"><center><h5 style="padding:50px 0px;">Tidak ada notifikasi untuk anda</h5></center></a>';
    $(".li-notification .notification-list").append(item);
  } else {
    read = '';
    labelread = '';
    if (v.Read == 0) {
      read = 'unread';
    }
    item = '<a href="' + v.Direct + '" class="list-group-item ' + read + '">';
    item += '<div class="media">';
    item += '<div class="pull-left p-r-10">';
    item += '<em class="fa fa-diamond noti-primary"></em>';
    item += '</div>';
    item += '<div class="media-body">';
    item += '<h5 class="media-heading">' + v.Title + " " + labelread + '</h5>';
    item += '<p class="m-0">';
    item += '<small>' + v.Message + '</small>';
    item += '<p class="m-0">';
    item += '<small class="tgl">' + v.Date + '</small>';
    item += '</p>';
    item += '</div>';
    item += '</div>';
    item += '</a>';
    $(".li-notification .notification-list").append(item);
  }

}
function removeUrlParams(sParam) {
  var url = window.location.href.split('?')[0] + '?';
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] != sParam) {
      url = url + sParameterName[0] + '=' + sParameterName[1] + '&'
    }
  }
  return url.substring(0, url.length - 1);
}

var int_pass = 0
function show_pass() {
  if (int_pass == 0) {
    int_pass = 1;
    $('[name=Password]').attr('type', 'text');
    $('.show_password .fa').removeClass('fa-eye-slash');
    $('.show_password .fa').addClass('fa-eye');
  } else {
    int_pass = 0;
    $('[name=Password]').attr('type', 'password');
    $('.show_password .fa').removeClass('fa-eye');
    $('.show_password .fa').addClass('fa-eye-slash');
  }
}

function img_preview(page = "", img = "") {
  if (page == "reset") {
    $(".img-preview").attr('src', host + 'aset/img/noicon.png');
  } else if (page == "set") {
    $(".img-preview").attr('src', img);
  } else {
    $(".img-preview").attr('src', host + 'aset/img/noicon.png');
    var brand = document.getElementById('logo-id');
    brand.className = 'attachment_upload';
    brand.onchange = function () {
      document.getElementById('fakeUploadLogo').value = this.value.substring(12);
    };
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('.img-preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
    $("#logo-id").change(function () {
      readURL(this);
    });
  }
}

function summernote_init() {
  // $('.summernote').summernote({
  //   height: 500
  // });

  $('.summernote').summernote({
    fontSize: 16,
    height: 500,
    addclass: {
      debug: false,
      classTags: [{ title: "Button", "value": "btn btn-success" }, "jumbotron", "lead", "img-rounded", "img-circle", "img-responsive", "btn", "btn btn-success", "btn btn-danger", "text-muted", "text-primary", "text-warning", "text-danger", "text-success", "table-bordered", "table-responsive", "alert", "alert alert-success", "alert alert-info", "alert alert-warning", "alert alert-danger", "visible-sm", "hidden-xs", "hidden-md", "hidden-lg", "hidden-print"]
    },
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video', 'hr']],
      ['view', ['codeview']]
    ],
  });

}

function CheckBtnNextPrev() {
  NextID = parseInt(NextID);
  PrevID = parseInt(PrevID);
  if (NextID > 0) { $(".div-btn-next").show(); } else { $(".div-btn-next").hide(); }
  if (PrevID > 0) { $(".div-btn-prev").show(); } else { $(".div-btn-prev").hide(); }
}
function div_form(method) {
  $('div, input, span, form').removeClass('has-error');
  $('.help-block').empty();
  $("input,textarea,select").attr("disabled", false);
  $(".input-group-addon, .add-attachment, .add-attachment-email").removeClass("disabled");
  $("[name=Codex], .i-disabled").attr("disabled", true);
  $("[name=Code], .i-disabled").attr("disabled", true);
  $("input,textarea,select,span").removeClass("text");
  if (method == "edit_keep" || method == "edit_next" || method == "edit_prev" || method == "view_next" || method == "view_prev" || method == "next_data" || method == "prev_data") {
  } else {
    $("#form .nav-tabs li, #form .tab-pane").removeClass("active");
    $("#form .nav-tabs li, #form .tab-pane").removeClass("in");
    $("#form .nav-li-1, #form .tab-pane-1").addClass("active");
    $("#form .tab-pane-1").addClass("in");
  }

  CheckBtnNextPrev();
  if (method == "open" || method == "edit" || method == "edit_next" || method == "edit_prev" || method == "edit_keep") {
    if (method == "open" || method == "edit") {
      $('html,body').animate({ scrollTop: $("body").offset().top }, 'slow');
    }
    $('#form')[0].reset();
    $('#form input:not([name="BranchFilter[]"]), #form textarea').val("");
    $(".div-btn-save").show();
    $(".div-btn-close").hide();
    $(".panel-form").show(300);
    $(".div-ppn").hide();
    $("input").attr("checked", false);
    $(".list-debt").empty();
    $(".active-qr").addClass("hidden");
    $(".qr-field").empty();

    $(".list-attachment .item-attachment").remove();
    $(".list-attachments .item-attachments").remove();
    $(".list-attachment-email .item-attachment-email").remove();
    $("#PPN, #PPH").val(1);
    if ($("#form input").hasClass("value-absolute")) {
      $.each($(".value-absolute"), function (i, v) {
        dt = $(v).data();
        $("#" + dt.divid).val(dt.value);
        if (i == 0) {
          $("#" + dt.divid).prop("checked", true);
        }
      });
    }
  } else if (method == "view" || method == "view_next" || method == "view_prev") {
    if (method == "view") {
      $('html,body').animate({ scrollTop: $("body").offset().top }, 'slow');
    }
    $('#form')[0].reset();
    $('#form input:not([name="BranchFilter[]"]), #form textarea').val("");
    $(".div-btn-save").hide();
    $(".div-btn-close").show();
    $(".panel-form input,.panel-form textarea,.panel-form select").attr("disabled", true);
    $(".panel-form input,.panel-form textarea,.panel-form select, .panel-form .input-group-addon").addClass("text");
    $(".panel-form").show(300);
    $(".list-debt").empty();
    $(".list-attachment .item-attachment").remove();
    $(".list-attachments .item-attachments").remove();
    $(".list-attachment-email .item-attachment-email").remove();
    $(".panel-form .input-group-addon, .add-attachment, .add-attachment-email").addClass("disabled");
  } else if (method == "change") {
    save_method = 'update';
    $('html,body').animate({ scrollTop: $("body").offset().top }, 'slow');
    $(".div-btn-save").show();
    $(".div-btn-close").hide();
    $("#form [name=Codex]").attr("disabled", true);
    $("#form .c-disabled").attr("disabled", true);
    $("[name=HakAksesID]").attr("disabled", false);
  } else if (method == "change_id") {
    element = '<span data-id="' + LastID + '" data-method="edit"></span>';
    edit(element);
  } else if (method == "next_data") {
    element = '<span data-id="' + NextID + '" data-method="' + method_before + '_next"></span>';
    edit(element);
  } else if (method == "prev_data") {
    element = '<span data-id="' + PrevID + '" data-method="' + method_before + '_prev"></span>';
    edit(element);
  } else if (method == "close") {
    $('#form')[0].reset();
    $(".panel-form").hide(300);
  } else if (method == "reset") {
    $('#form')[0].reset();
    $(".div-btn-save").show();
    $(".fist-input").focus();
    $(`#form input:not([name="BranchFilter[]"])`).val("");
  } else {

  }
}

function readFile() {
  dt = $(".data-page, .page-data").data();
  modul = dt.modul;

  var files = this.files;
  var reader;
  var file;
  var i;

  namefile = files[0].name.split(".")[0];
  for (i = 0; i < files.length; i++) {
    file = files[i];
    reader = new FileReader();
    reader.onload = (function (file) {
      return function (e) {
        if (modul == "transaction_contract" || modul == "transaction_vehicle_send") {
          // add_attachment('add_new',e,3);
          // EE - Add name original 
          add_attachment('add_new', e, 3, '', file.name.split(".")[0]);
        } else {
          // add_attachment('add_new',e);
          add_attachment('add_new', e, '', '', file.name.split(".")[0]);
        }
      };
    })(file);
    reader.readAsDataURL(file);
  }
}
var saved = 0;
function add_attachment(modul, e, column, setting, namefile, total = 0) {

  add_list = '';
  limit = 10;
  limit_big = 2000; //2MB
  HakDelete = 1;
  dt = $(".list-attachment").data();
  list_att = $(".list-attachment .item-attachment");
  CategoryB64 = $("[name=ADD-CategoryB64]").find(':selected').val();
  CategoryB64Label = CategoryB64;
  if (dt) {
    if (dt.limit) {
      limit = dt.limit;
    }
  }

  if (CategoryB64 == "NOPOL") {
    CategoryB64Label = 'NO POLISI';
  } else if (CategoryB64 == "INSURANCE") {
    CategoryB64Label = 'ASURANSI';
  } else if (CategoryB64 == "LEASE") {
    CategoryB64Label = 'LEASING';
  }

  if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
    add_list = '-null';
    list_att = $(".list-attachment-null .item-attachment");
  }


  if (setting) {
    if (setting.add_list != 'null') {
      add_list = setting.add_list;
    }
    if (setting.limit != 'null') {
      limit = setting.limit;
    }
    if (setting.limit_big != 'null') {
      limit_big = setting.limit_big;
    }
  }
  if (modul == "add_new") {
    link = "javascript:;";
    b64 = e.target.result;
    id = 0;
    if (list_att.length >= limit) {
      toastr.error('Maximum file up to ' + limit + ' file', "Information");
      return;
    }
    limit_big = limit_big * 1000;
    if (e && e.total > limit_big) {
      limit_big_txt = limit_big / 1000000;
      toastr.error('File size too big, size maximum is ' + limit_big_txt + 'MB', "Information");
      return;
    }
    TypeFileb64 = b64.split(';')[0].split('/')[1];
  } else {
    link = hostS3 + e.File;
    b64 = hostS3 + e.File;
    id = e.AttachmentID;
    TypeFileb64 = e.FormatFile;
  }
  if (TypeFileb64 == 'pdf') {
    img_div = '<img src="' + host + '/aset/icon/icon-pdf.jpg" height="100px" >';
  } else if (TypeFileb64 == 'xlsx' || TypeFileb64 == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
  } else if (TypeFileb64 == "xls" || TypeFileb64 == "vnd.ms-excel") {
    img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
  } else if (TypeFileb64 == "docx" || TypeFileb64 == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
    img_div = '<img src="' + host + '/aset/icon/icon-docx.jpg" height="100px" >';
  } else if (TypeFileb64 == "doc" || TypeFileb64 == "msword") {
    img_div = '<img src="' + host + '/aset/icon/icon-doc.jpg" height="100px" >';
  } else if (TypeFileb64 == "txt" || TypeFileb64 == "plain") {
    img_div = '<img src="' + host + '/aset/icon/icon-txt.jpg" height="100px" >';
  } else {
    img_div = '<img src="' + b64 + '" height="100px" >';
  }
  if (TypeFileb64 == 'pdf' ||
    TypeFileb64 == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    TypeFileb64 == 'vnd.ms-excel' ||
    TypeFileb64 == 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    TypeFileb64 == 'msword' ||
    TypeFileb64 == 'plain' ||
    TypeFileb64 == 'png' ||
    TypeFileb64 == 'jpeg' ||
    TypeFileb64 == 'jpg' ||
    TypeFileb64 == 'txt' ||
    TypeFileb64 == 'xlsx' ||
    TypeFileb64 == 'xls' ||
    TypeFileb64 == 'docx' ||
    TypeFileb64 == 'doc'
  ) { } else {
    toastr.error('Format file not allowed, please use file format (png,jpg,pdf,doc,docx,xls,xlsx,txt)', "Information");
    return;
  }
  Name = '';
  no = 0;
  if (list_att.length > 0) {
    $.each(list_att, function (i, v) {
      if (i == 0) {
        dt = $(v).data();
        no = dt.no;
      }
    });
  }
  no = no + 1;
  item_no = 'item-attachment-' + no;
  if (Name == "") {
    Name = 'untitled-' + no;
  }
  if (e.NameOriginal) {
    Name = e.NameOriginal;
  }
  div_delete = "";
  if (HakDelete == 1) {
    if (modul == "update" || modul == "add_new") {
      div_delete = '<div class="item-remove pointer" onclick="remove_attachment(this)" data-item="' + item_no + '" data-modul="' + modul + '" data-id="' + id + '"><i class="fa fa-trash"></i></div>';
    }
  }
  if (mobile) {
    col = "col-sm-6";
  } else {
    if (column == 1) {
      col = "col-sm-12";
    } else if (column == 2) {
      col = "col-sm-6";
    } else if (column == 3) {
      col = "col-sm-4";
    } else {
      col = "col-sm-3";
    }
  }
  div_check = "";
  if (modul == "update"){
    div_check = '<div style="float: left; padding: 5px 10px;"><input type="checkbox" name="CheckAttachment[]" id="Check-'+id+'" value="'+id+'"></div>';
  }
  item = '<div class="' + col + ' col-xs-4 text-center item item-attachment ' + item_no + '" data-no="' + no + '">\
        <div class="item-body">\
        '+ div_check + '\
        '+ div_delete + '\
          <a href="'+ link + '" target="_blank">\
          <div class="div-img">\
          '+ img_div + '\
            </div>\
          </div>\
        </a>'
  if (modul == "add_new") {
    item += '<input class="NameAttachments" type="hidden" name="NameAttachments[]" value="' + namefile + '">';
    item += '<input class="FileB64Attachment" type="hidden" name="FileB64[]" value="' + b64 + '">';
    item += '<input class="FormatFileB64Attachment" type="hidden" name="FormatFileB64[]" value="' + TypeFileb64 + '">';
    if (CategoryB64) {
      item += '<input class="CategoryB64" type="hidden" name="CategoryB64[]" value="' + CategoryB64 + '">';
    }
  }
  if (modul != "add_new") {
    item += '<a href="' + link + '" class="title" title="' + Name + '" target="_blank">' + Name + '</a>';
    item += '<a href="' + link + '" class="btn" title="' + Name + '" download="' + Name + '" target="_blank">Download</a>';
  }
  if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
    item += '<span>' + CategoryB64Label + '</span>';
  }
  item += '</div>';
  if (window.location.href.split("/")[4] == "cetak_lampiran" || column == 'save_img') {
    // DISINI
    let getImg = "";
    var getX = function (boat, logo) {
      return 50;
    };
    var getY = function (boat, logo) {
      return 650;
    };
    originalImage = document.querySelector(".item");
    watermarkImagePath = host + '/aset/img/Footer.png';

    if(column != 'save_img'){
      let fileInput = document.getElementById('item').value;
      Fr = JSON.parse(fileInput);
    }
    Ga = new Image();
    Ga.crossOrigin = 'foobarmoo';
    Ga.src = b64;


    if (TypeFileb64 == "jpg" || TypeFileb64 == "png" || TypeFileb64 == "jpeg") {


      // if (Ga.width > 1000 && Ga.height <= 1000) {

      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.height = "300px";

      //       img.style.margin = "40px";
      //     });
      // } else if (Ga.width > 700) {

      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer1.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr1.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek1.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.height = "300px";

      //       img.style.margin = "10px";
      //     });
      // } else if (Ga.height > 960) {
      //   console.log("ehehe");
      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer1.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr1.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek1.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.max-height = "750px";
      //       img.style.margin = "10px";
      //     });
      // } else {
      var options = {
        init: function (img) {
          img.crossOrigin = 'foobarmoo';
        }
      };
      
      watermark(['' + b64 + '', '' + host + '/aset/img/Footer.png'], options)
        // .image(watermark.image.atPos(getX, getY, 1))
        .image(watermark.image.lowerCenter(1))
        .load(['' + host + '/aset/img/qr.jpg'])
        .image(watermark.image.lowerRightt(1))
        .load(['' + host + '/aset/img/icon_derek.png'])
        .image(watermark.image.upperLeft(1))
        .then(function (img) {
          if (column != 'save_img'){
            document.getElementById('alpha-image').appendChild(img);
            img.style.width = "650px";
            // img.style.height = "300px";
            img.style.margin = "10px";
          }
          if (column == 'save_img'){
            modifiedImageData = img.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            $.ajax({
                url: host + 'api/saveImage', 
                type: 'POST',
                dataType: "JSON",
                data: { image: modifiedImageData, name: e.AttachmentID, id: e.TransactionID },
                success: function (response) {
                    console.log(response.status);
                    saved += 1
                    if(total == saved){
                      saveAttachment('lampiran')
                    }
                },
                error: function (jqXHR, status, error) {
                  console.log(jqXHR.responseText);
                }
            });
          }
        
        });
      // }

    }
  }
  if (modul == 'return') {
    return item;
  } else {
    list_class = ".list-attachment" + add_list;
    // console.log(add_list);
    $(list_class).prepend(item);
  }
}
function remove_attachment(element) {
  dt = $(element).data();
  item = dt.item;
  modul = dt.modul;
  ProductImageID = dt.id;
  if (modul == "add_new") {
    $("." + item).remove();
  } else {
    swal({
      title: "Info",
      text: "Apakah anda yakin akan menghapus data ini ?",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          $.ajax({
            url: host + 'api/remove_attachment/' + ProductImageID,
            type: "POST",
            dataType: "JSON",
            success: function (json) {
              if (json.Status) {
                dx = json.data;
                toastr.success(json.Message, "Information");
                $("." + item).remove();
              } else {
                toastr.error(json.Message, "Information");
              }
              remove_overlay();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              toastr.error("Terjadi kesalahan, gagal menghapus data", "Information");
              remove_overlay();
              console.log(jqXHR.responseText);
            }
          });
        }
      });
  }
}
function number_format(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}
function approval_status_msg(setting) {
  asm = $(".approval-status-msg");
  asm.hide();
  asm.empty();
  asm.removeClass("danger");
  asm.removeClass("success");
  asm.removeClass("inverse");
  item = '';
  itemhd = '';
  itemsend = '';
  itemapprv = '';
  if (setting.method) {
    method = setting.method;
    if (method == "open") {
      data = setting.data;
      status = data.ApproveStatus;
      if (status == 1) {
        asm.addClass("success");
        itemhd = "<b>Informasi : </b> data sudah disetujui ";
        itemapprv += '<b>Disetujui oleh :</b> ' + data.ApproveName + ', waktu' + data.ApproveRequestDate;
      } else if (status == 2) {
        asm.addClass("danger");
        itemhd = "<b>Informasi : </b> data sudah ditolak ";
        itemapprv += '<b>Ditolak oleh : </b> ' + data.ApproveName + ', waktu ' + data.ApproveDate + ', dengan alasan "' + data.ApproveRemark + '" <br/>';
      } else if (status == 3) {
        asm.addClass("inverse");
        itemhd = "<b>Informasi : </b> data sudah dibatalkan ";
        itemlas = '';
        if (data.ApproveCancelRemark) {
          itemlas = ', dengan alasan "' + data.ApproveCancelRemark + '"';
        }
        itemapprv += '<b>Dibatalkan oleh : </b> ' + data.ApproveCancelName + ', waktu ' + data.ApproveCancelDate + itemlas + '<br/>';
      } else {
        itemhd = '<b>Informasi : </b> data ini masih dalam proses menunggu persetujuan <br/>';
      }
      itemsend += '<span id="msg_approve_send"><b>, Dibuat oleh :</b> ' + data.ApproveRequestName + ', waktu ' + data.ApproveRequestDate + '</span> <br/>';

      item += itemhd;
      item += itemsend;
      item += itemapprv;

      asm.show();
      asm.append(item);
    }
  }
}
function delete_all(element) {
  dt = $(element).data();
  action_delete = dt.action;
  url = url_hapus;
  ArrayID = [];
  ArrayUserID = [];
  ArrayChecked = [];
  list_id = $(".table tbody .th-checkbox [type=checkbox]");
  $.each(list_id, function (i, v) {
    if ($(v).is(":checked")) {
      dtx = $(v).data();
      ArrayChecked.push(dtx.id);
      if (action_delete == "delete") {
        if (dtx.active == "1") {
          ArrayID.push(dtx.id);
          ArrayUserID.push(dtx.userid);
        } else {
          $(v).prop("checked", false);
        }
      } else {
        if (dtx.active == "0") {
          ArrayID.push(dtx.id);
          ArrayUserID.push(dtx.userid);
        } else {
          $(v).prop("checked", false);
        }
      }
    }
  });
  if (ArrayChecked.length != ArrayID.length) {
    $("#th-check-all").prop("checked", false);
  }
  if (ArrayID.length == 0) {
    toastr.error("Silakan pilih data yang akan ditindak", "Information");
    return;
  }
  if (action_delete == "delete") {
    title_text = 'Apakah anda yakin akan menghapus <b>' + ArrayID.length + '</b> data ini ?';
  } else {
    title_text = 'Apakah anda yakin akan batal menghapus <b>' + ArrayID.length + '</b> data ini ?';
  }
  data_post = {
    Action: action_delete,
    ID: ArrayID,
    UserID: ArrayUserID,
  }
  swal({
    title: "Info",
    // text: language_app.are_you_sure,   
    text: title_text,
    // type: "warning", 
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: language_app.yes,
    cancelButtonText: language_app.no,
    closeOnConfirm: false,
    closeOnCancel: false
  },
    function (isConfirm) {
      if (isConfirm) {
        $.ajax({
          url: url_hapus,
          type: "POST",
          dataType: "JSON",
          data: data_post,
          success: function (json) {
            $(".table .th-checkbox [type=checkbox]").prop("checked", false);
            reload_table();
            toastr.error(json.Message, "Information");
            swal.close();

          },
          error: function (jqXHR, textStatus, errorThrown) {
            toastr.error(language_app.error_transaction, "Information");
            swal.close();
            console.log(jqXHR.responseText);
          }
        });
      } else {
        toastr.error(language_app.cancel_deleted, "Information");
        swal.close();
      }
    });
}

var url_approve_save;
function approve_all(element) {
  dt = $(element).data();
  action_approve = dt.action;
  url = url_hapus;
  ArrayID = [];
  ArrayChecked = [];
  list_id = $(".table tbody .th-checkbox [type=checkbox]");
  $.each(list_id, function (i, v) {
    if ($(v).is(":checked")) {
      dtx = $(v).data();
      ArrayChecked.push(dtx.id);
      if (action_approve == "agree" || action_approve == "decline" || action_approve == "send") {
        if (dtx.approvestatus == "0") {
          ArrayID.push(dtx.id);
        } else {
          $(v).prop("checked", false);
        }
      } else if (action_approve == "delete") {
        if (dtx.approvestatus == "1" && dtx.countresult == "0") {
          ArrayID.push(dtx.id);
        } else {
          $(v).prop("checked", false);
        }
      }
    }
  });
  if (ArrayChecked.length != ArrayID.length) {
    $("#th-check-all").prop("checked", false);
  }
  if (ArrayID.length == 0) {
    toastr.error("Silakan pilih data yang akan ditindak", "Information");
    return;
  }
  url_approve_save = url_approve;
  if (action_approve == "agree") {
    ApproveStatus = 1;
    title_text = 'Apakah anda yakin akan meyetujui <b>' + ArrayID.length + '</b> data ini ?';
  } else if (action_approve == "decline") {
    ApproveStatus = 2;
    title_text = 'Apakah anda yakin akan menolak <b>' + ArrayID.length + '</b> data ini ?';
  } else if (action_approve == "delete") {
    url_approve_save = url_hapus;
    ApproveStatus = 2;
    title_text = 'Apakah anda yakin akan membatalkan transaksi <b>' + ArrayID.length + '</b> data ini ?';
  } else {
    ApproveStatus = 0;
    title_text = 'Apakah anda yakin akan mengirim ulang persetujuan <b>' + ArrayID.length + '</b> data ini ?';
  }
  var data_post = {
    Action: action_approve,
    ID: ArrayID,
    ApproveStatus: ApproveStatus,
  }
  if (action_approve == "decline" || action_approve == "delete") {
    htmltext = title_text + "<textarea class='form-control' id='RemarkTolak' style='margin-top:20px;' placeholder='tulis alasan anda menolak'></textarea>";
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
    }, function (inputValue) {
      var remark = $('#RemarkTolak').val();
      if (remark === "") {
        swal.showInputError("Keterangan tidak boleh kosong");
        return false
      } else {
        data_post = {
          Action: action_approve,
          ID: ArrayID,
          ApproveStatus: ApproveStatus,
          ApproveRemark: remark
        }
        approve_all_save(data_post);
      }
    });
  } else {
    swal({
      title: "Info",
      text: title_text,
      html: true,
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      closeOnConfirm: true,
      closeOnCancel: true
    },
      function (isConfirm) {
        if (isConfirm) {
          approve_all_save(data_post);
        }
      });
  }
}
function approve_all_save(data_post) {
  $.ajax({
    url: url_approve_save,
    type: "POST",
    dataType: "JSON",
    data: data_post,
    success: function (json) {
      $(".table .th-checkbox [type=checkbox]").prop("checked", false);
      reload_table();
      toastr.success(json.Message, "Information");
      swal.close();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      toastr.error(language_app.error_transaction, "Information");
      swal.close();
      console.log(jqXHR.responseText);
    }
  });
}
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}
Date.prototype.minDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() - days);
  return date;
}

Date.isLeapYear = function (year) {
  return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};
Date.getDaysInMonth = function (year, month) {
  return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
Date.prototype.isLeapYear = function () {
  return Date.isLeapYear(this.getFullYear());
};
Date.prototype.getDaysInMonth = function () {
  return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};
Date.prototype.addMonths = function (value) {
  var n = this.getDate();
  this.setDate(1);
  this.setMonth(this.getMonth() + value);
  this.setDate(Math.min(n, this.getDaysInMonth()));
  return this;
};

function GenerateJurnal(DATA) {
  $.ajax({
    url: host + "api/GenerateJurnal",
    data: DATA,
    type: "POST",
    dataType: "JSON",
    success: function (json) {
      console.log(json);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });

}
function JurnalExport(data) {
  dt = $(data).data().modul;
  StartDate = $("#form-filter [name=StartDate]").val();
  EndDate = $("#form-filter [name=EndDate]").val();
  if (StartDate == "" || EndDate == "") {
    toastr.error("Tgl. Mulai dan Tgl. Akhir tidak boleh kosong", "Information");
    return
  }
  host = window.location.origin + '/';
  url = host + 'report/JurnalExport/' + dt;
  $('#form-filter').attr('action', url);
  $('#form-filter').attr('target', '_blank');
  $("#form-filter").submit();
}
function JurnalPreview(data) {
  dt = $(data).data().modul;
  StartDate = $("#form-filter [name=StartDate]").val();
  EndDate = $("#form-filter [name=EndDate]").val();
  if (StartDate == "" || EndDate == "") {
    toastr.error("Tgl. Mulai dan Tgl. Akhir tidak boleh kosong", "Information");
    return
  }
  host = window.location.origin + '/';
  url = host + 'report/JurnalPreview/' + dt;
  $('#form-filter').attr('action', url);
  $('#form-filter').attr('target', '_blank');
  $("#form-filter").submit();
}
function JurnalUlang(element) {
  dt = $(element).data();
  StartDate = $("#form-filter [name=StartDate]").val();
  EndDate = $("#form-filter [name=EndDate]").val();
  if (StartDate == "" || EndDate == "") {
    toastr.error("Tgl. Mulai dan Tgl. Akhir tidak boleh kosong", "Information");
    return
  }

  data_post = {
    StartDate: StartDate,
    EndDate: EndDate,
    Modul: dt.modul,
  }
  $.ajax({
    url: host + "api/JurnalUlang",
    data: data_post,
    type: "POST",
    dataType: "JSON",
    success: function (json) {
      console.log(json);
      toastr.success(json.Message, "Information");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });

}



function CheckHargaTarif(WorkType, FromCityID, ToCityID) {
  dt = $(".data-page, .page-data").data();
  modul = dt.modul;
  data_post = {
    WorkType: WorkType,
    FromCityID: FromCityID,
    ToCityID: ToCityID
  }
  $.ajax({
    url: host + "api/CheckHargaTarif",
    data: data_post,
    type: "POST",
    dataType: "JSON",
    success: function (json) {
      if (json.Status) {
        toastr.success(json.Message, "Information");
        if (modul == "transaction_receive_order") {
          $("#form [name=ProductID]").val(json.Data.ProductID);
          $("#form [name=Price]").val(json.Data.Price);
        }
      } else {
        toastr.error(json.Message, "Information");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      toastr.error("Terjadi kesalahan gagal mendapatkan data", "Information");
      console.log(jqXHR.responseText);
    }
  });
}

// Egi
function ChangeColorBackground(color) {
  $(".panel-heading, .table.dataTable thead").attr("style", 'background-color: #' + color + ' !important');
  $(".btn-default").attr("style", 'background-color: #' + color + ' !important; border: 1px solid #' + color + ' !important');
  $("#sidebar-menu ul li a").attr("style", 'color: #' + color + ' !important');

}

function QrCode(master) {
  if (master == 1) {
    master = "Pegawai";
  } else if (master == 2) {
    master = "Kendaraan";
  }
  $(".div-loader").show();
  $(".btn-generate").empty();
  $(".btn-generate").append(`<i style='padding-right: 18px;'><div class='loader2'></div></i>Processing...`);
  ArrayID = [];
  list_id = $(".table tbody .th-checkbox [type=checkbox]");
  $.each(list_id, function (i, v) {
    if ($(v).is(":checked")) {
      ArrayID.push($(v).data().id);
    }

  });
  if (ArrayID.length > 0) {
    swalDate(master);
  } else {
    swal(
      {
        title: "Info",
        text: "Silahkan pilih dulu " + master,
        type: "warning"
      });
    $(".div-loader").hide();
    $(".btn-generate").empty();
    $(".btn-generate").append(`
        <span class="btn-label"><i class="fa fa-plus"></i></span> Generate QR Code
          `);
  }
}


function swalDate(master) {
  Swal.fire({
    title: "<h2>Tanggal aktif QR Code</h2>",
    text: "Silahkan pilih tanggal aktif Qr Code!",
    html: '<input id="dateQR" type="date" style="line-height: 2.1em;width:20em;" />',
    type: "input",
    width: '50em',
    heightauto: false,
    showCancelButton: true,
  }).then((result) => {
    dateActive = $('#dateQR').val();
    if (result.isConfirmed) {
      if (dateActive) {
        swal(
          {
            title: "Info",
            text: "Apakah anda yakin akan generate QR Code untuk " + ArrayID.length + " " + master + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: true,
            closeOnCancel: true
          },
          function (isConfirm) {
            if (isConfirm) {
              data_post = {
                ArrayID: ArrayID,
                master: master,
                dateActive: dateActive
              };
              $.ajax({
                url: url_qr,
                data: data_post,
                type: "POST",
                dataType: "JSON",
                success: function (data) {

                  if (data.Status) {
                    swal({
                      title: "success",
                      text: "Berhasil generate QR Code",
                      type: "success"
                    });
                    reload_table();
                    $(".div-loader").hide();
                    $(".btn-generate").empty();
                    $(".btn-generate").append(`
                    <span class="btn-label"><i class="fa fa-plus"></i></span> Generate QR Code
                      `);
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  toastr.error("Terjadi kesalahan gagal mendapatkan data", "Information");
                  console.log(jqXHR.responseText);
                }
              });
            }
          });
      } else {
        swal({
          title: "warning",
          text: "Silahkan pilih dulu tanggal aktif QR",
          type: "warning"
        }, function () {
          swalDate();
        });
      }
    }
  })
}

function view_qr(code) {
  Swal.fire({
    title: '<a href="' + host + '/qr/' + code + '" download="' + code + '">Download</a>',
    imageUrl: host + '/qr/' + code,
    imageWidth: 400,
    imageAlt: 'Custom image',
    showConfirmButton: false,
    // confirmButton: '<a href="https://qa.lccd.rcelectronic.co.id/qr/'+code+'" download="'+code+'">Download</a>',
  })
}

function act(method, id) {
  console.log(method);
  target = '.btn-' + id;
  target1 = '.txt-' + id;
  console.log(target);
  data_post = {
    method: method,
    id: id
  }
  $.ajax({
    url: url_qr_act,
    data: data_post,
    type: "POST",
    dataType: "JSON",
    success: function (data) {
      if (data.Status) {
        swal({
          title: "success",
          text: data.Message,
          type: "success"
        });
        if (method == 'deact') {
          $(target).attr('onclick', `act('act', '` + id + `')`);
          $(target).removeClass('btn-danger');
          $(target).addClass('btn-primary');
          $(target).html('Activate');
          $(target1).css('background-color', '#f05050');
          $(target1).html('Non-active');
        } else {
          $(target).attr('onclick', `act('deact', '` + id + `')`);
          $(target).removeClass('btn-primary');
          $(target).addClass('btn-danger');
          $(target).html('Deactivate');
          $(target1).css('background-color', '#213e7a');
          $(target1).html('Active');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      toastr.error("Terjadi kesalahan gagal mendapatkan data", "Information");
      console.log(jqXHR.responseText);
    }
  });

}

function waitPromise(funcToWait) {
	return new Promise((resolve) => {
		funcToWait(resolve);
	});
}

// for email

function readFileEmail() {
  dt = $(".data-page, .page-data").data();
  modul = dt.modul;

  var files = this.files;
  var reader;
  var file;
  var i;

  namefile = files[0].name.split(".")[0];
  for (i = 0; i < files.length; i++) {
    file = files[i];
    reader = new FileReader();
    reader.onload = (function (file) {
      return function (e) {
        if (modul == "transaction_contract" || modul == "transaction_vehicle_send") {
          // add_attachment('add_new',e,3);
          // EE - Add name original 
          add_attachmentEmail('add_new', e, 3, '', file.name.split(".")[0]);
        } else {
          // add_attachment('add_new',e);
          add_attachmentEmail('add_new', e, '', '', file.name.split(".")[0]);
        }
      };
    })(file);
    reader.readAsDataURL(file);
  }
}
var saved = 0;
function add_attachmentEmail(modul, e, column, setting, namefile, total = 0) {

  add_list = '';
  limit = 10;
  limit_big = 2000; //2MB
  HakDelete = 1;
  dt = $(".list-attachment-email").data();
  list_att = $(".list-attachment-email .item-attachment-email");
  CategoryB64 = $("[name=ADD-CategoryB64]").find(':selected').val();
  CategoryB64Label = CategoryB64;
  if (dt) {
    if (dt.limit) {
      limit = dt.limit;
    }
  }

  if (CategoryB64 == "NOPOL") {
    CategoryB64Label = 'NO POLISI';
  } else if (CategoryB64 == "INSURANCE") {
    CategoryB64Label = 'ASURANSI';
  } else if (CategoryB64 == "LEASE") {
    CategoryB64Label = 'LEASING';
  }

  if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
    add_list = '-null';
    list_att = $(".list-attachment-email-null .item-attachment-email");
  }


  if (setting) {
    if (setting.add_list != 'null') {
      add_list = setting.add_list;
    }
    if (setting.limit != 'null') {
      limit = setting.limit;
    }
    if (setting.limit_big != 'null') {
      limit_big = setting.limit_big;
    }
  }
  if (modul == "add_new") {
    link = "javascript:;";
    b64 = e.target.result;
    id = 0;
    if (list_att.length >= limit) {
      toastr.error('Maximum file up to ' + limit + ' file', "Information");
      return;
    }
    limit_big = limit_big * 1000;
    if (e && e.total > limit_big) {
      limit_big_txt = limit_big / 1000000;
      toastr.error('File size too big, size maximum is ' + limit_big_txt + 'MB', "Information");
      return;
    }
    TypeFileb64 = b64.split(';')[0].split('/')[1];
  } else {
    link = hostS3 + e.File;
    b64 = hostS3 + e.File;
    id = e.AttachmentID;
    TypeFileb64 = e.FormatFile;
  }
  if (TypeFileb64 == 'pdf') {
    img_div = '<img src="' + host + '/aset/icon/icon-pdf.jpg" height="100px" >';
  } else if (TypeFileb64 == 'xlsx' || TypeFileb64 == "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
  } else if (TypeFileb64 == "xls" || TypeFileb64 == "vnd.ms-excel") {
    img_div = '<img src="' + host + '/aset/icon/icon-excel.jpg" height="100px" >';
  } else if (TypeFileb64 == "docx" || TypeFileb64 == "vnd.openxmlformats-officedocument.wordprocessingml.document") {
    img_div = '<img src="' + host + '/aset/icon/icon-docx.jpg" height="100px" >';
  } else if (TypeFileb64 == "doc" || TypeFileb64 == "msword") {
    img_div = '<img src="' + host + '/aset/icon/icon-doc.jpg" height="100px" >';
  } else if (TypeFileb64 == "txt" || TypeFileb64 == "plain") {
    img_div = '<img src="' + host + '/aset/icon/icon-txt.jpg" height="100px" >';
  } else {
    img_div = '<img src="' + b64 + '" height="100px" >';
  }
  if (TypeFileb64 == 'pdf' ||
    TypeFileb64 == 'vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    TypeFileb64 == 'vnd.ms-excel' ||
    TypeFileb64 == 'vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    TypeFileb64 == 'msword' ||
    TypeFileb64 == 'plain' ||
    TypeFileb64 == 'png' ||
    TypeFileb64 == 'jpeg' ||
    TypeFileb64 == 'jpg' ||
    TypeFileb64 == 'txt' ||
    TypeFileb64 == 'xlsx' ||
    TypeFileb64 == 'xls' ||
    TypeFileb64 == 'docx' ||
    TypeFileb64 == 'doc'
  ) { } else {
    toastr.error('Format file not allowed, please use file format (png,jpg,pdf,doc,docx,xls,xlsx,txt)', "Information");
    return;
  }
  Name = '';
  no = 0;
  if (list_att.length > 0) {
    $.each(list_att, function (i, v) {
      if (i == 0) {
        dt = $(v).data();
        no = dt.no;
      }
    });
  }
  no = no + 1;
  item_no = 'item-attachment-email-' + no;
  if (Name == "") {
    Name = 'untitled-' + no;
  }
  if (e.NameOriginal) {
    Name = e.NameOriginal;
  }
  div_delete = "";
  if (HakDelete == 1) {
    if (modul == "update" || modul == "add_new") {
      div_delete = '<div class="item-remove pointer" onclick="remove_attachment(this)" data-item="' + item_no + '" data-modul="' + modul + '" data-id="' + id + '"><i class="fa fa-trash"></i></div>';
    }
  }
  div_check = '<div style="float: left; padding: 5px;"><input type="checkbox" name="Check[]" id="Check-'+id+'"></div>';
  if (mobile) {
    col = "col-sm-6";
  } else {
    if (column == 1) {
      col = "col-sm-12";
    } else if (column == 2) {
      col = "col-sm-6";
    } else if (column == 3) {
      col = "col-sm-4";
    } else {
      col = "col-sm-3";
    }
  }

  item = '<div class="' + col + ' col-xs-4 text-center item item-attachment-email ' + item_no + '" data-no="' + no + '">\
        <div class="item-body">\
        '+ div_check +'\
        '+ div_delete + '\
          <a href="'+ link + '" target="_blank">\
          <div class="div-img">\
          '+ img_div + '\
            </div>\
          </div>\
        </a>'
  if (modul == "add_new") {
    item += '<input class="NameAttachments-email" type="hidden" name="NameAttachmentsemail[]" value="' + namefile + '">';
    item += '<input class="FileB64Attachment-emil" type="hidden" name="FileB64email[]" value="' + b64 + '">';
    item += '<input class="FormatFileB64Attachment-email" type="hidden" name="FormatFileB64email[]" value="' + TypeFileb64 + '">';
    if (CategoryB64) {
      item += '<input class="CategoryB64" type="hidden" name="CategoryB64[]" value="' + CategoryB64 + '">';
    }
  }
  if (modul != "add_new") {
    item += '<a href="' + link + '" class="title" title="' + Name + '" target="_blank">' + Name + '</a>';
    item += '<a href="' + link + '" class="btn" title="' + Name + '" download="' + Name + '" target="_blank">Download</a>';
  }
  if (modul == "add_new" && CategoryB64 && CategoryB64.length > 0) {
    item += '<span>' + CategoryB64Label + '</span>';
  }
  item += '</div>';
  if (window.location.href.split("/")[4] == "cetak_lampiran" || column == 'save_img') {
    // DISINI
    let getImg = "";
    var getX = function (boat, logo) {
      return 50;
    };
    var getY = function (boat, logo) {
      return 650;
    };
    originalImage = document.querySelector(".item");
    watermarkImagePath = host + '/aset/img/Footer.png';

    if(column != 'save_img'){
      let fileInput = document.getElementById('item').value;
      Fr = JSON.parse(fileInput);
    }
    Ga = new Image();
    Ga.crossOrigin = 'foobarmoo';
    Ga.src = b64;


    if (TypeFileb64 == "jpg" || TypeFileb64 == "png" || TypeFileb64 == "jpeg") {


      // if (Ga.width > 1000 && Ga.height <= 1000) {

      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.height = "300px";

      //       img.style.margin = "40px";
      //     });
      // } else if (Ga.width > 700) {

      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer1.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr1.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek1.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.height = "300px";

      //       img.style.margin = "10px";
      //     });
      // } else if (Ga.height > 960) {
      //   console.log("ehehe");
      //   watermark(['' + b64 + '', '' + host + '/aset/img/Footer1.png'])
      //     // .image(watermark.image.atPos(getX, getY, 1))
      //     .image(watermark.image.lowerCenter(1))
      //     .load(['' + host + '/aset/img/qr1.jpg'])
      //     .image(watermark.image.lowerRightt(1))
      //     .load(['' + host + '/aset/img/icon_derek1.png'])
      //     .image(watermark.image.upperLeft(1))
      //     .then(function (img) {
      //       document.getElementById('alpha-image').appendChild(img);
      //       img.style.width = "650px";
      //       // img.style.max-height = "750px";
      //       img.style.margin = "10px";
      //     });
      // } else {
      var options = {
        init: function (img) {
          img.crossOrigin = 'foobarmoo';
        }
      };
      
      watermark(['' + b64 + '', '' + host + '/aset/img/Footer.png'], options)
        // .image(watermark.image.atPos(getX, getY, 1))
        .image(watermark.image.lowerCenter(1))
        .load(['' + host + '/aset/img/qr.jpg'])
        .image(watermark.image.lowerRightt(1))
        .load(['' + host + '/aset/img/icon_derek.png'])
        .image(watermark.image.upperLeft(1))
        .then(function (img) {
          if (column != 'save_img'){
            document.getElementById('alpha-image').appendChild(img);
            img.style.width = "650px";
            // img.style.height = "300px";
            img.style.margin = "10px";
          }
          if (column == 'save_img'){
            modifiedImageData = img.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            $.ajax({
                url: host + 'api/saveImage', 
                type: 'POST',
                dataType: "JSON",
                data: { image: modifiedImageData, name: e.AttachmentID, id: e.TransactionID },
                success: function (response) {
                    console.log(response.status);
                    saved += 1
                    if(total == saved){
                      saveAttachment('lampiran')
                    }
                },
                error: function (jqXHR, status, error) {
                  console.log(jqXHR.responseText);
                }
            });
          }
        
        });
      // }

    }
  }
  if (modul == 'return') {
    return item;
  } else {
    list_class = ".list-attachment-email" + add_list;
    // console.log(add_list);
    $(list_class).prepend(item);
  }
}