var mobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
var host = window.location.origin + "/";
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "transaction_validation_order/list_data/";
var url_edit = host + "transaction_validation_order/edit/";
var url_hapus = host + "transaction_validation_order/delete/";
var url_simpan = host + "transaction_validation_order/save/";
var url_approve = host + "transaction_validation_order/approve_data/";
var url_resend = host + "transaction_validation_order/ResendMessage/";
var addressno = 0;
var contactno = 0;
var modul = "";
var app = "";
var radius_val = 0;
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
$(document).ready(function () {
  load_datatables();

  // let urlParam = url.split('?');
  // if (urlParam.length > 1) {
  //   let queryString = new URLSearchParams(urlParam[1]);
  //   for (let pair of queryString.entries()) {
  //     if (pair[0] == 'id') {
  //       tambah();
  //       // modal_receive_order($("#ReceiveCode")[0]);
  //       modul_requst_modal = "transaction_validation_order";
  //       modal_receive_order_click(pair[1]);
  //     }
  //   }
  // }

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
function load_datatables() {
  data_page = $(".data-page, .page-data").data();
  modul = data_page.modul;
  app = data_page.app;
  page_name = data_page.page_name;
  menuid = data_page.menuid;
  ConnectToSAP = data_page.connecttosap;
  CurrentDate = data_page.currentdate;
  id = data_page.id;
  filter = data_page.filter;

  StartDate = $("#form-filter [name=StartDate]").val();
  EndDate = $("#form-filter [name=EndDate]").val();
  VendorID = $("#form-filter [name=VendorID]").find(":selected").val();
  VehicleID = $("#form-filter [name=VehicleID]").find(":selected").val();
  jenisTrans = $('#form-filter [name=jenisTrans]').find(':selected').val();
  ProductID = $("#form-filter [name=ProductID]").find(":selected").val();

  data_post = {
    Filter: filter,
    InvoiceID: id,
    MenuID: menuid,
    StartDate: StartDate,
    EndDate: EndDate,
    jenisTrans: jenisTrans,
    VendorID: VendorID,
    VehicleID: VehicleID,
    ProductID: ProductID,
  };
  table = $("#table").DataTable({
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
      },
    },
    columnDefs: [
      {
        targets: [0], //last column
        orderable: false, //set not orderable
      },
    ],
  });
  if (id && id > 0) {
    edit('<span data-id="' + id + '" data-method="view"></span>');
  }
}
function tambah(modul) {
  save_method = "add";
  $(".form-title").text("Tambah Data");
  $(".main-input").next().show();
  $(".sub-input").attr("type", "hidden");
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .action").show();
  $(".table-data-detail tfoot .item-total").text("");
  // add_data_detail('add_new','<span data-method="new_data"></span>');
  div_form("open");
  $("#form [name=TransactionValidationOrderID], #form [name=TransactionReceiveOrderID], #form [name=VendorID], #form [name=TransactionReceiveOrderDetailID]").val("");
  $("#form [name=Date]").val(CurrentDate);
  $("#form [name=Date]").datepicker("setDate", CurrentDate);
  $("#form .select2").val("none").trigger("change");
  $("[name=TypeOrder]").val("derek");
  $("[name=TypeOrder]").val("derek").trigger("change");
  approval_status_msg({ method: "close" });
}
function edit(element) {
  dt = $(element).data();
  id = dt.id;
  method = dt.method;
  LastID = id;
  if (method == "view" || method == "view_next" || method == "view_prev") {
    save_method = "view";
    method_before = "view";
    $(".form-title").text("Lihat Data");
  } else {
    save_method = "update";
    method_before = "edit";
    $(".form-title").text("Ubah Data");
  }
  $(".table-data-detail tbody").empty();
  $(".table-data-detail tfoot .action").hide();
  $(".table-data-detail tfoot .item-total").text("");
  $.ajax({
    url: url_edit + id,
    type: "GET",
    dataType: "JSON",
    success: function (json) {
      if (json.HakAkses == "rc") {
        console.log(json);
      }
      if (json.Status) {
        console.log(json);
        div_form(method);
        $("#form .input-group-addon").addClass("disabled");
        $("#form .input-group-addon").addClass("text");
        $("#form .select2").val("none").trigger("change");
        a = json.Data;
        if (a.ApproveStatus == 3) {
          approval_status_msg({ method: "open", data: a });
          $("#msg_approve_send").remove();
        } else {
          approval_status_msg({ method: "close" });
        }
        NextID = a.NextID;
        PrevID = a.PrevID;
        $("#form [name=TransactionValidationOrderID]").val(a.TransactionValidationOrderID);
        $("#form [name=TransactionReceiveOrderID]").val(a.TransactionReceiveOrderID);
        $("#form [name=TransactionReceiveOrderDetailID]").val(a.TransactionReceiveOrderDetailID);
        $("#form [name=VendorID]").val(a.VendorID);
        $("#form [name=VehicleID]").val(a.VehicleID);
        $("#form [name=OperatorID]").val(a.OperatorID);
        $("#form [name=RiggerID]").val(a.RiggerID);
        $("#form [name=SupirID]").val(a.SupirID);
        $("#form [name=LainlainID]").val(a.LainlainID);
        $("#form [name=VehicleID").val(a.VehicleID).trigger("change");
        $("#form [name=OperatorID").val(a.OperatorID).trigger("change");
        $("#form [name=RiggerID").val(a.RiggerID).trigger("change");
        $("#form [name=SupirID").val(a.SupirID).trigger("change");
        $("#form [name=LainlainID").val(a.LainlainID).trigger("change");
        $("#form [name=TypeOrder").val(a.TypeOrder).trigger("change");
        $("#form [name=Code]").val(a.Code);
        $("#form [name=ReferenceCode]").val(a.ReferenceCode);
        $("#form [name=ReceiveCode]").val(a.ReceiveCode);
        $("#form [name=ContractCode]").val(a.ContractCode);
        $("#form [name=Date]").val(a.Date);
        $("#form [name=Address]").val(a.Address);
        $("#form [name=ProductName]").val(a.ProductName);
        $("#form [name=ProductUnit]").val(a.ProductUnit);

        $("#form [name=VendorID]").val(a.VendorID);
        $("#form [name=VendorName]").val(a.VendorName);
        $("#form [name=DerekName]").val(a.DerekName);
        $("#form [name=VehicleName]").val(a.VehicleName);
        $("#form [name=OperatorName]").val(a.OperatorName);
        $("#form [name=RiggerName]").val(a.RiggerName);
        $("#form [name=SupirName]").val(a.SupirName);
        $("#form [name=LainlainName]").val(a.LainlainName);
        // $("#form [name=Remark]").val(a.Remark);
        let finishRemark = a.Remark;
        if (a.apkRemark) {
          finishRemark += `\n${a.apkRemark}`;
        }
        if (a.sTime) {
          finishRemark += `\nWaktu Penjemputan: ${a.sTime}`;
        }
        if (a.eTime) {
          finishRemark += `\nWaktu Sampai tujuan: ${a.eTime}`;
        }
        $("#form [name=Remark]").val(finishRemark);
        $("#form [name=TripMoney]").val(a.TripMoney);
        $("#form [name=DepositeMoney]").val(a.DepositeMoney);
        $("#form [name=Price]").val(a.Price);
        $("#form [name=Pricex]").val(a.Price);
        $("#form [name=EstimationPrice]").val(a.EstimationPrice);
        $("#form [name=ReductionPrice]").val(a.ReductionPrice);
        $("#form [name=TotalPrice]").val(a.TotalPrice);
        $("#form [name=Terms]").val(a.Terms);

        $("#form [name=FromCityID]").val(a.FromCityID);
        $("#form [name=FromCityID").val(a.FromCityID).trigger("change");
        $("#form [name=FromCityName]").val(a.FromCityName);
        $("#form [name=FromAddress]").val(a.FromAddress);
        $("#form [name=FromGoogleAddress]").val(a.FromGoogleAddress);
        $("#form [name=FromLatLng]").val(a.FromLatLng);
        $("#form [name=ToCityID]").val(a.ToCityID);
        $("#form [name=ToCityID").val(a.ToCityID).trigger("change");
        $("#form [name=ToCityName]").val(a.ToCityName);
        $("#form [name=ToAddress]").val(a.ToAddress);
        $("#form [name=ToGoogleAddress]").val(a.ToGoogleAddress);
        $("#form [name=FromLat]").val(a.FromLat);
        $("#form [name=FromLng]").val(a.FromLng);
        $("#form [name=ToLat]").val(a.ToLat);
        $("#form [name=ToLng]").val(a.ToLng);
        $("#form [name=ToLatLng]").val(a.ToLatLng);

        if (a.TypeOrder == 'derek') {
          $("#form [name=TypeOrderName]").val('Derek');
        } else {
          $("#form [name=TypeOrderName]").val('Contract');
        }
        $(".table-data-detail tfoot .item-total").text(a.TotalPrice);
        if (method_before == "view") {
          $(".main-input").next().hide();
          $(".sub-input").attr("type", "text");
        } else {
          $(".main-input").next().hide();
          $(".sub-input").attr("type", "text");
          $("#form input, #form select,#form textarea").addClass("text");
          $("#form input, #form select,#form textarea").attr("disabled", true);

          $("#form [name=TransactionValidationOrderID],#form [name=Remark], #add-attachment").attr("disabled", false);
          $("#form [name=TransactionValidationOrderID],#form [name=Remark]").removeClass("text");
        }
        if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
          $.each(json.Data.ListAttachment, function (i, v) {
            add_attachment("update", v);
          });
        }
        CheckBtnNextPrev();
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      swal("Info", "Terjadi kesalahan gagal mendapatkan data");
    },
  });
}
function reload_table() {
  table.ajax.reload(null, false); //reload datatable ajax
}
var count_save = 0;
function save(element) {
  btn_saving(element);
  if (save_method == "view") {
    swal("Info", "Maaf anda tidak bisa melakukan transaksi");
    return;
  }
  if (count_save == 0) {
    count_save = 0;
    $("div, input, span, form, td, tr").removeClass("has-error");
    $(".item-alert").hide();
    $(".help-block").empty();
    dt = $(element).data();
    method = dt.method;
    url = host;
    url = host + "transaction_validation_order/save/" + save_method;
    $.ajax({
      url: url,
      type: "POST",
      data: $("#form").serialize(),
      dataType: "JSON",
      success: function (json) {
        if (json.Status) {
          NextID = json.NextID;
          PrevID = json.PrevID;
          CheckBtnNextPrev();
          toastr.success(json.Message, "Information");
          if (method == "close") {
            div_form("close");
          } else if (method == "new") {
            save_method = "add";
            // div_form("reset");
            tambah();
          } else if (method == "keep") {
            save_method = "update";
            $("#form [name=TransactionValidationOrderID]").val(json.TransactionValidationOrderID);
            $("#form [name=Code]").val(json.Code);
            $("#form [name=ReceiveCode]").val(json.Code);
            // div_form('change_id');
            edit('<span data-id="' + json.TransactionValidationOrderID + '" data-method="edit"></span>');
          }
          reload_table();
          btn_saving(element, "reset");
          count_save = 0;
          $(".FileB64Attachment, .FormatFileB64Attachment").remove();
        } else {
          $(".form-group").removeClass("has-error");
          $(".help-block").empty();
          if (json.inputerror) {
            console.log(json);
            for (var i = 0; i < json.inputerror.length; i++) {
              toastr.error(json.error_string[i], "Information");
              if (json.type[i] == "alert") {
                $('[name="' + json.inputerror[i] + '"]')
                  .parent()
                  .addClass("has-error");
                $("." + json.inputerror[i] + "Alert").text(json.error_string[i]);
              } else if (json.type[i] == "alert_2") {
                $('[name="' + json.inputerror[i] + '"]')
                  .parent()
                  .parent()
                  .addClass("has-error");
                $("." + json.inputerror[i] + "Alert").text(json.error_string[i]);
              } else {
                $('[name="' + json.inputerror[i] + '"]')
                  .parent()
                  .addClass("has-error");
                $('[name="' + json.inputerror[i] + '"]')
                  .next()
                  .text(json.error_string[i]);
              }
            }
          }
          if (json.inputerrordetail) {
            $.each(json.inputerrordetail, function (i, v) {
              toastr.error(v, "Information");
              if (json.inputerrordetailid[i] != "") {
                $("." + json.inputerrordetailid[i]).addClass("has-error");
                $("." + json.inputerrordetailid[i] + " .item-alert").show();
              }
            });
          }
          if (json.popup) {
            swal("Info", json.Message);
          }
          btn_saving(element, "reset");
          count_save = 0;
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        count_save = 0;
        console.log(jqXHR.responseText);
        btn_saving(element, "reset");
        toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
      },
    });
  }
}
function hapus_data(id) {
  // swal({   title: "Info",
  //          text: "Apakah anda yakin akan membatalkan transaksi ini ?",
  //          // type: "warning",
  //          showCancelButton: true,
  //          confirmButtonColor: "#DD6B55",
  //          confirmButtonText: "Ya",
  //          cancelButtonText: "Tidak",
  //          closeOnConfirm: false,
  //          closeOnCancel: false },
  //          function(isConfirm){
  //              if (isConfirm) {
  //                 $.ajax({
  //                     url : url_hapus+id+"/nonactive",
  //                     type: "POST",
  //                     dataType: "JSON",
  //                     success: function(data){
  //                         reload_table();
  //                         swal("Info", "Transaksi berhasil dibatalkan");
  //                     },
  //                     error: function (jqXHR, textStatus, errorThrown){
  //                         swal("Info", "Terjadi kesalahan gagal melakukan transaksi data");
  //                         console.log(jqXHR.responseText);
  //                     }
  //                 });
  //             } else {
  //                 swal("Info", "Transaksi tidak jadi");
  //             }
  // });

  htmltext = "Apakah anda yakin akan membatalkan transaksi ini ?" + "<textarea class='form-control' id='CancelRemark' style='margin-top:20px;' placeholder='tulis alasan anda disini'></textarea>";
  swal(
    {
      title: "Info",
      text: htmltext,
      html: true,
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonColor: "#DD6B55",
      showLoaderOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "",
    },
    function (isConfirm) {
      if (isConfirm) {
        var CancelRemark = $("#CancelRemark").val();
        if (CancelRemark === "") {
          swal.showInputError("Alasan tidak boleh kosong");
          return false;
        } else {
          data_post = {
            CancelRemark: CancelRemark,
          };
          $.ajax({
            url: url_hapus + id + "/nonactive",
            type: "POST",
            data: data_post,
            dataType: "JSON",
            success: function (data) {
              reload_table();
              swal("Info", "Transaksi berhasil dibatalkan");
              swal.close();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              swal("Info", "Terjadi kesalahan gagal melakukan transaksi data");
              console.log(jqXHR.responseText);
            },
          });
        }
      } else {
        swal("Info", "Transaksi tidak jadi");
      }
    }
  );
}
function active_data(id) {
  $.ajax({
    url: url_hapus + id + "/active",
    type: "POST",
    dataType: "JSON",
    success: function (data) {
      reload_table();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
      swal("Info", language_app.error_transaction);
    },
  });
}
function resend_message(element) {
  dt = $(element).data();
  id = dt.id;
  $.ajax({
    url: url_resend + id + "/nonactive",
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (data) {
      swal("Info", data.Message);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      swal("Info", "Terjadi kesalahan gagal mengirim data");
      console.log(jqXHR.responseText);
    },
  });
}
function approve_data(element) {
  dt = $(element).data();
  action = dt.action;
  id = dt.id;
  status = dt.status;
  remark = "";
  if (action == "agree") {
    pesan = "Apa anda yakin akan menyetujui data ini ?";
  } else if (action == "decline") {
    pesan = "Apa anda yakin akan menolak data ini ?";
  } else if (action == "send") {
    pesan = "Apa anda yakin akan mengirim ulang data ini ?";
  } else {
    return false;
  }
  if (action == "decline") {
    htmltext = pesan + "<textarea class='form-control' id='RemarkTolak' style='margin-top:20px;' placeholder='tulis alasan anda menolak'></textarea>";
    swal(
      {
        title: "Info",
        text: htmltext,
        html: true,
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonColor: "#DD6B55",
        showLoaderOnConfirm: true,
        animation: "slide-from-top",
        inputPlaceholder: "",
      },
      function (inputValue) {
        var remark = $("#RemarkTolak").val();
        if (remark === "") {
          swal.showInputError("Keterangan tidak boleh kosong");
          return false;
        } else {
          approve_data_save({ action: action, id: id, status: status, remark: remark });
          swal.close();
        }
      }
    );
  } else {
    swal(
      {
        title: "Info",
        text: pesan,
        showCancelButton: true,
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
        closeOnConfirm: true,
        closeOnCancel: true,
      },
      function (isConfirm) {
        if (isConfirm) {
          approve_data_save({ action: action, id: id, status: status, remark: remark });
        }
      }
    );
  }
}
function approve_data_save(element) {
  if (element && element.action) {
    dt = element;
    action = dt.action;
    id = dt.id;
    status = dt.status;
    remark = dt.remark;
  } else {
    dt = $(element).data();
    action = dt.action;
    id = dt.id;
    status = dt.status;
    remark = dt.remark;
  }
  data_post = {
    TransactionValidationOrderID: id,
    ApproveStatus: status,
    ApproveRemark: remark,
  };
  $.ajax({
    url: host + "transaction_validation_order/approve_data/",
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      if (json.Status) {
        toastr.success(json.Message, "Information");
        reload_table();
      } else {
        toastr.error(json.Message, "Information");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      toastr.error("Terjadi kesalahan gagal mengirim data", "Information");
      console.log(jqXHR.responseText);
    },
  });
}

function add_data_detail(method, element) {
  count_dd = 1 + count_dd;
  rowid = "item-detail-" + count_dd;
  td_width = "70px";
  i_search = "";
  i_remove = "";
  i_alert = "";
  disabled = "";
  TransactionDetailID = "";
  ID = "";
  Name = "";
  CraneName = "";
  OperatorName = "";
  RiggerName = "";
  SupirName = "";
  LainlainName = "";
  Unit = "";
  Qty = "";
  Price = "";
  PriceTxt = "";
  SubTotal = "";
  SubTotalTxt = "";
  addclass = "";
  if (element && element.ID) {
    a = element;
    if (method == "view") {
      disabled = ' disabled="" ';
      addclass = " text ";
    }
    TransactionDetailID = a.TransactionDetailID;
    ID = a.ID;
    Name = a.Name;
    CraneName = a.CraneName;
    OperatorName = a.OperatorName;
    RiggerName = a.RiggerName;
    SupirName = a.SupirName;
    LainlainName = a.LainlainName;
    Unit = a.Unit;
    Qty = a.Quantity;
    Price = a.Price;
    PriceTxt = a.PriceTxt;
    SubTotal = a.TotalPrice;
    SubTotalTxt = a.TotalPriceTxt;
  } else {
    dt = $(element).data();
  }
  if (method == "add_new") {
    i_alert = '<i class="item-alert sembunyi ti-alert"></i>';
    i_search = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="modal_tarif(this)" data-rowid="' + rowid + '"><i class="fa fa-search"></i></a> ';
    i_remove = '<a href="javascript:;" class="btn btn-xs btn-white pointer" onclick="remove_data_detail(this)" data-rowid="' + rowid + '"><i class="fa fa-trash"></i></a> ';
  }
  if (method == "empty") {
    item = '<tr class="empty"><td colspan="6">Data tidak ada</td></tr>';
  } else if (method == "view" || method == "update" || method == "edit") {
    item = '<tr class="item ' + rowid + '">';
    // item += '<td></td>';
    item += "<td>" + Name + "</td>";
    item += "<td>" + CraneName + "</td>";
    item += "<td>" + OperatorName + "</td>";
    item += "<td>" + RiggerName + "</td>";
    item += "<td>" + SupirName + "</td>";
    item += "<td>" + LainlainName + "</td>";
    item += "</tr>";
  } else {
    select_crane = create_detail_select("crane", "all");
    select_operator = create_detail_select("pegawai", "operator");
    select_rigger = create_detail_select("pegawai", "rigger");
    select_supir = create_detail_select("pegawai", "supir");
    select_lain = create_detail_select("pegawai", "lain-lain");
    input_h = '<input type="hidden" name="DetailCount[]" class="item-count" value="' + rowid + '">';
    input_h += '<input type="hidden" name="TransactionDetailID[]" value="' + TransactionDetailID + '">';
    input_h += '<input type="hidden" name="DetailID[]" class="item-id" value="' + ID + '">';
    input_h += '<input type="hidden" name="DetailName[]" class="item-name" value="' + Name + '">';
    input_h += '<input type="hidden" name="DetailUnit[]" class="item-unit" value="' + Unit + '">';
    input_h += '<input type="hidden" name="DetailQty[]" class="item-price" value="' + Qty + '">';
    input_h += '<input type="hidden" name="DetailPrice[]" class="item-price" value="' + Price + '">';

    item = '<tr class="item ' + rowid + '">';
    // item += '<td>'+i_alert+'<div class="btn-group btn-xs">'+i_search+i_remove+'</div>'+input_h+'</td>';
    item += '<td class="item-name-txt">' + Name + input_h + "</td>";
    item += "<td>" + select_crane + "</td>";
    item += "<td>" + select_operator + "</td>";
    item += "<td>" + select_rigger + "</td>";
    item += "<td>" + select_supir + "</td>";
    item += "<td>" + select_lain + "</td>";
    item += "</tr>";
  }
  $("#table-detail-1 tbody").append(item);
}
function remove_data_detail(element) {
  tbody_tr = $("#table-detail-1 tbody tr");
  dt = $(element).data();
  $("." + dt.rowid).remove();
  calculation_total_price();
}
function calculation_total_price() {
  total = 0;
  list = $("#table-detail-1.table-data-detail tbody tr");
  if (list.length > 0) {
    $.each(list, function (i, v) {
      rowid = v.classList[1];
      class_rowid = "." + rowid;
      id = $(class_rowid + " .item-id").val();
      qty = $(class_rowid + " .item-qty").val();
      price = $(class_rowid + " .item-price").val();
      if (id == "") {
        id = 0;
      }
      if (qty == "") {
        qty = 0;
      }
      if (price == "") {
        price = 0;
      }
      id = parseInt(id);
      qty = parseInt(qty);
      price = parseInt(price);
      sub_total = qty * price;
      if (id > 0) {
        total += sub_total;
        price = $(class_rowid + " .item-sub-total-txt").text(number_format(sub_total));
      }
    });
    $(".table-data-detail tfoot .item-total").text(number_format(total));
  } else {
    $(".table-data-detail tfoot .item-total").text(number_format(total));
  }
}
function calculation_last_price() {
  Price = $("[name=Price]").val();
  EstimationPrice = $("[name=EstimationPrice]").val();
  ReductionPrice = $("[name=ReductionPrice]").val();
  console.log(EstimationPrice);

  if (Price == "") {
    Price = 0;
  }
  if (EstimationPrice == "") {
    EstimationPrice = 0;
  }
  if (ReductionPrice == "") {
    ReductionPrice = 0;
  }
  if (Price.length > 0) {
    Price = Price.replace(/\,/g, "");
  }
  if (EstimationPrice.length > 0) {
    EstimationPrice = EstimationPrice.replace(/\,/g, "");
  }
  if (ReductionPrice.length > 0) {
    ReductionPrice = ReductionPrice.replace(/\,/g, "");
  }
  Price = parseFloat(Price);
  EstimationPrice = parseFloat(EstimationPrice);
  ReductionPrice = parseFloat(ReductionPrice);
  TotalPrice = Price + EstimationPrice - ReductionPrice;
  $("[name=TotalPrice]").val(TotalPrice);
}
function create_detail_select(method1, method2) {
  option_select = "";
  if (method1 == "pegawai") {
    list_data = $(".list_pegawai_select").data();
    if (method2 == "operator") {
      option_select += '<select name="DetailOperatorID[]" class="select-td" style="max-width:100px;">';
    } else if (method2 == "rigger") {
      option_select += '<select name="DetailRiggerID[]" class="select-td" style="max-width:100px;">';
    } else if (method2 == "supir") {
      option_select += '<select name="DetailSupirID[]" class="select-td" style="max-width:100px;">';
    } else if (method2 == "lain-lain") {
      option_select += '<select name="DetailLainlainID[]" class="select-td" style="max-width:100px;">';
    } else {
      option_select += '<select name="DetailOperatorID[]" class="select-td" style="max-width:100px;">';
    }
    option_select += '<option value="0">Pilih</option>';
    $.each(list_data.json, function (i, v) {
      if (method2 == "operator" && v.TypeName == "operator") {
        option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
      }
      if (method2 == "rigger" && v.TypeName == "rigger") {
        option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
      }
      if (method2 == "supir" && v.TypeName == "supir") {
        option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
      }
      if (method2 == "lain-lain") {
        option_select += '<option value="' + v.ID + '">' + v.Name + "</option>";
      }
    });
    option_select += "</select>";
  } else if (method1 == "crane") {
    list_data = $(".list_crane_select").data();
    option_select += '<select name="DetailCraneID[]" class="select-td" style="max-width:100px;">';
    option_select += '<option value="0">Pilih</option>';
    $.each(list_data.json, function (i, v) {
      option_select += '<option value="' + v.ID + '">' + v.Code + " - " + v.Name + "</option>";
    });
    option_select += "</select>";
  }
  return option_select;
}

$("[name=TypeOrder]").change(function () {
  typeOrder = $(this).val();
  if (typeOrder == "derek") {
    $(".v_derek").show(300);
    $(".v_contract").hide(300);
  } else {
    $(".v_derek").hide(300);
    $(".v_contract").show(300);
  }


});
// REFRESH DATA VEHICLE
// $(".sembunyi").ready(function () {
//   if ($("select").hasClass("vehicle_select")) {
//     vehicle_select();
//   }
// });