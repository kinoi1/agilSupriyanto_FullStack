var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var url_pengajuan_kpr = host + "api/autocomplete_pengajuan_kpr";
var url_marketing = host + "api/autocomplete_marketing";
var url_pemesanan = host + "api/autocomplete_no_pemesanan";
var url_pic = host + "api/autocomplete_pic";
var url_frameNo = host + "api/autocomplete_frameNo";

$(document).ready(function () {
  if ($("input").hasClass("autocomplete_pic")) {
    autocomplete_pic(".autocomplete_pic");

  }
  // $("#VendorID").on("change", function () {
  //   if ($(this).val() != "none" && $("#Membership").is(":checked")) {
  //     autocomplete_frameNo(".autocomplete_frameNo");
  //   } else if ($(".autocomplete_frameNo").data('ui-autocomplete') != undefined) {
  //     $(".autocomplete_frameNo").autocomplete("destroy");
  //   }
  // });

});

function autocomplete_frameNo(classnya) {
  VendorID = $("#VendorID").val();
  // MembershipCek = $("#Membership").is(":checked");
  // if (VendorID == "none" || !MembershipCek) {
  //   return;
  // }
  page = "";
  $("input" + classnya).autocomplete({
    minLength: 3,
    delay: 0,
    max: 10,
    scroll: true,
    source: function (request, response) {
      dt = $(classnya + ".ad").data();
      value = $(classnya).val();
      data_post = {
        Search: $("input" + classnya).val(),
        DataType: "datalist",
        VendorID: VendorID,
        Active: 1,
      }
      $.ajax({
        url: url_frameNo,
        data: data_post,
        dataType: "json",
        type: "POST",
        success: function (json) {
          response(json);
        }
      });
    },
    select: function (event, ui) {
      a = ui.item;
      $("#BrandID").val(a.BrandID).trigger("change");
      $("#TypeID").val(a.TypeID).trigger("change");
      $("#VehicleNo").val(a.VehicleNo);
      $("#FrameNo").val(a.FrameNo);
      $("#MachineNo").val(a.MachineNo);
      $("#Color").val(a.Color);

      $("#TypeMembership").val(a.TypeMembership);
      $("#ExpDate").val(a.ExpDate);
      $("#MaxUse").val(a.MaxUse);
      $("#RemainUse").val(a.RemainUse);

    }
  });
}

function autocomplete_pic(classnya) {
  page = "";
  $("input" + classnya).autocomplete({
    minLength: 2,
    delay: 0,
    max: 10,
    scroll: true,
    source: function (request, response) {
      dt = $(classnya + ".ad").data();
      modul = dt.modul;
      active = dt.active
      active = dt.select
      value = $(classnya).val();
      data_post = {
        Modul: modul,
        Search: $("input" + classnya).val(),
        DataType: "datalist",
        Active: active,
        Select: select,
      }
      $.ajax({
        url: url_pic,
        data: data_post,
        dataType: "json",
        type: "POST",
        success: function (json) {
          response(json);
        }
      });
    },
    select: function (event, ui) {
      datatag = $(classnya + ".ad").data();
      v = ui.item;
      $('[name="PIC"]').val(v.Name);
      $('[name="Phone"]').val(v.Phone);
    }
  });
}

function autocomplete_pengajuan_kpr(classnya) {
  page = "";
  $(classnya).keyup(function (e) {
    if (e.keyCode == 46 || e.keyCode == 8) {
      $(classnya + " .ad").val("");
      datatag = $(classnya + ".ad").data();
      if (datatag.page && datatag.page == "pembagian_komisi") {
        $(".div-komisi").empty();
        $(".v_marketing").hide();
      }
    }
  });
  $("input" + classnya).autocomplete({
    minLength: 1,
    delay: 0,
    max: 10,
    scroll: true,
    source: function (request, response) {
      datatag = $(classnya + ".ad").data();
      page = datatag.page;
      value = $(classnya).val();
      data_post = {
        search: $("input" + classnya).val(),
        modul: page,
      }
      $.ajax({
        url: url_pengajuan_kpr,
        data: data_post,
        dataType: "json",
        type: "POST",
        success: function (data) {
          response(data);
        }
      });
    },
    select: function (event, ui) {
      datatag = $(classnya + ".ad").data();
      v = ui.item;
      SubmissionKPRID = ui.item.SubmissionKPRID;
      if (datatag.page && datatag.page == "pembagian_komisi") {
        pembagian_komisi_get('klaim_imbalan_kpr', ui.item);
      } else {
        $('[name="SubmissionKPRID"]').val(v.SubmissionKPRID);
        $('[name="Code"]').val(v.Code);
        $('[name="Date"]').val(v.Date);
        $('[name="BankID"]').val(v.BankID);
        $('[name="BankName"]').val(v.BankName);
        $('[name="VendorName"]').val(v.VendorName);
        $('[name="VendorPhone"]').val(v.VendorPhone);
        $('[name="AddressProperty"]').val(v.AddressProperty);
        $('[name="Price"]').val(v.Price);
        $('[name="PriceTxt"]').val(v.PriceTxt);
        $('[name="PPN"]').val(v.PPN);
        $('[name="TotalPO"]').val(v.TotalPO);
        $('[name="MarketingName"]').val(v.MarketingName);
      }
    }
  });
}
function autocomplete_marketing(classnya) {
  $(classnya).keyup(function (e) {
    if (e.keyCode == 46 || e.keyCode == 8) {
      $(classnya + " .ad").val("");
      // ad : autodelete
    }
  });
  $("input" + classnya).autocomplete({
    minLength: 1,
    delay: 0,
    max: 10,
    scroll: true,
    source: function (request, response) {

      value = $(classnya).val();
      $.ajax({
        url: url_marketing,
        data: { search: $("input" + classnya).val() },
        dataType: "json",
        type: "POST",
        success: function (data) {
          response(data);
        }
      });
    },
    select: function (event, ui) {
      console.log(ui.item);
      v = ui.item;
      ID = ui.item.ID;
      $('[name="BrokerID"]').val(v.ID);
      $('[name="BrokerName"]').val(v.Name);
      // $('[name="BrokerBankName"]').val(v.BankName);
      // $('[name="BrokerAccountNo"]').val(v.AccountNo);
      // $('[name="BrokerNPWP"]').val(v.NPWP);
    }
  });
}
var Condition;
var HakAkses;
var MarketingIDLogin;
function autocomplete_pemesanan(classnya) {
  $(classnya).keyup(function (e) {
    if (e.keyCode == 46 || e.keyCode == 8) {
      $(classnya + " .ad").val("");
      // ad : autodelete
      if (Condition == 1 || Condition == 2) {
        $(".div-komisi").empty();
      }
      datatag = $(classnya + ".ad").data();
      if (datatag.page && datatag.page == "pembagian_komisi") {
        $(".div-komisi").empty();
        $(".v_marketing").hide();
      } else if (datatag.page == "pengajuan_kpr") {
        $("[name=MarketingID]").val(0).trigger('change');
      }
    }
  });


  $("input" + classnya).autocomplete({
    minLength: 1,
    delay: 0,
    max: 10,
    scroll: true,
    source: function (request, response) {
      value = $(classnya).val();
      datatag = $(classnya + ".ad").data();
      modul = "";
      if (datatag.page == "pengajuan_kpr") {
        modul = "pengajuan_kpr";
      }
      data_post = {
        modul: modul,
        search: $("input" + classnya).val()
      };
      $.ajax({
        url: url_pemesanan,
        data: data_post,
        dataType: "json",
        type: "POST",
        success: function (data) {
          response(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        }
      });
    },
    select: function (event, ui) {
      datatag = $(classnya + ".ad").data();
      v = ui.item;
      ID = ui.item.ID;
      Condition = ui.item.Condition;
      $('[name="SellID"]').val(v.ID);

      if (datatag.page == "pembagian_komisi") {
        pembagian_komisi_get('pemesanan', ui.item);
      } else if (datatag.page == "pengajuan_kpr") {
        $("[name=SellID]").val(ID);
        $("[name=ProductID]").val(ui.item.ProductID);
        $("[name=ProductName]").val(ui.item.ProductName);
        $("[name=Price]").val(ui.item.ProductPrice);
        $('[name="MarketingID"]').val(ui.item.ListingID).trigger('change');
      }
    }
  });
}

function pembagian_komisi_get(page, data) {
  console.log(data);
  $(".div-komisi").empty();

  ui = data;
  Condition = ui.Condition;
  SellID = ui.SellID;
  SubmissionKPRID = ui.SubmissionKPRID;
  Transaksi = page;
  data_post = {
    SellID: SellID,
    SubmissionKPRID: SubmissionKPRID,
    Condition: Condition,
    Transaksi: Transaksi
  };
  console.log(ui);
  $.ajax({
    url: host + "api/pembagian_komisi_get/",
    data: data_post,
    dataType: "json",
    type: "POST",
    success: function (val) {
      if (Condition == 1) {

      } else {
        console.log(val);
        HakAkses = val.HakAkses;
        MarketingIDLogin = val.MarketingID;
        $("[name=MarketingID]").empty();
        op_marketing = '<option value="0">Pilih Nama Marketing</option>';
        $.each(val.Data, function (key, v) {
          if (v.MarketingName) {
            op_marketing += '<option value="' + v.MarketingID + '">' + v.MarketingName + '</option>';
          }
        });
        $("[name=MarketingID]").append(op_marketing);

        //buka fungsi untuk menghapus duplicate option
        var optionValues = [];
        $('[name=MarketingID] option').each(function () {
          if ($.inArray(this.value, optionValues) > -1) {
            $(this).remove()
          } else {
            optionValues.push(this.value);
          }
        });
        //tutup fungsi untuk menghapus duplicate option
        if (val.DataPembayaran.length > 0) {
          $(".v_marketing").show();



          if (val.Condition == 1 && val.Transaksi == "pemesanan") {
            $.each(val.DataPembayaran, function (key, v) {
              append_komisi_primary(val, v, ui, v.PaymentDetID);
            });
          } else {
            $.each(val.DataPembayaran, function (key, v) {
              append_komisi_secondary(val, v, ui, v.PaymentDetID);
            });
          }

        } else {
          item = '<div class="full-width" style="text-align:center;height:250px; margin:20px 0px; border:1px solid #eaeaea;"><h3 style="line-height:250px !important;">Data Komisi Tidak Ada</h3></div>';
          $(".div-komisi").append(item);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    }
  });
}
function append_komisi_primary(val, v, ui, PaymentDetID) {
  ApproveStatus = 0;
  DuitMarketing = 0;
  BiayaAdm = v.BiayaAdm;
  BiayaAdmTxt = v.BiayaAdmTxt;
  NetCommission = v.GrandTotal;
  ReferalFee = v.Referal;
  ReferalFeeTxt = v.ReferalFeeTxt;
  ReferalName = v.ReferalName;
  PPH23 = v.PPH23;
  PPH23Txt = v.PPH23Txt;
  PPHFinal = v.PPHFinal;
  PPHFinalTxt = v.PPHFinalTxt;
  TypePembayaranID = v.TypePembayaranID;
  PropertiName = v.PropertiName;
  AtasNama = v.AtasNama;
  PaymentType = v.PaymentType;
  NoPemesanan = v.NoPemesanan;
  NilaiTransaksi = v.NilaiTransaksi;
  NilaiTransaksi = parseFloat(NilaiTransaksi);
  NilaiTransaksi = NilaiTransaksi.format(0, 3, ',', ',');
  KomisiPersen = v.KomisiPersen;
  KomisiPersen = parseFloat(v.KomisiPersen);
  KomisiKotor = v.KomisiKotor;
  KomisiKotor = parseFloat(KomisiKotor);
  KomisiKotorNet = KomisiKotor - PPHFinal - PPH23 - BiayaAdm - ReferalFee;
  KomisiKotorNet = parseFloat(KomisiKotorNet);
  TotalPotongan = PPHFinal + PPH23 + BiayaAdm + ReferalFee;
  ListingLead = v.ListingLead;
  ListingProperty = v.ListingProperty;
  MarketingType = v.MarketingType;
  ListingPersen = v.CommissionLead / KomisiPersen * 100;
  SellingPersen = v.CommissionSell / KomisiPersen * 100;
  TotalPPHFinalSell = KomisiKotorNet / 100 * SellingPersen;
  TotalPPHFinalLead = KomisiKotorNet / 100 * ListingPersen;

  KomisiListing = 0;
  KomisiSelling = 0;
  TotalKomisiListing = 0;
  TotalKomisiSelling = 0;
  TotalPPHFinalListing = 0;
  TotalPPHFinalSelling = 0;

  if (ListingLead == 1) {
    if (MarketingType == 2 || MarketingType == 3) {
      KomisiListing = v.CommissionLead;
      KomisiSelling = v.CommissionSell;
      TotalKomisiListing = v.TotalCommissionLead;
      TotalKomisiSelling = v.TotalCommissionSell;
      TotalPPHFinalListing = TotalPPHFinalLead;
      TotalPPHFinalSelling = TotalPPHFinalSell;
      NetCommission = TotalPPHFinalLead;
    }
  } else {
    if (MarketingType == 2 || MarketingType == 3) {
      $.each(val.arrayBagiKomisi, function (i, t) {
        potonganlistingselling = TotalPotongan / 100 * t.CommissionPercent;
        Com = t.Commission; if (Com == ".00") { Com = 0; }
        ComP = t.CommissionPercent;



        if (t.TypeCommission == 1) {
          KomisiListing += t.CommissionPercent;
          TotalKomisiListing += Com + potonganlistingselling;
          TotalPPHFinalListing += parseFloat(Com);
        } else {
          KomisiSelling += ComP;
          TotalKomisiSelling += Com + potonganlistingselling;
          TotalPPHFinalSelling += parseFloat(Com);
        }
      });
      KomisiListing = KomisiListing / KomisiPersen;
      KomisiSelling = KomisiSelling / KomisiPersen;
      TotalKomisiListing = TotalKomisiListing;
      TotalKomisiSelling = TotalKomisiSelling;
      TotalPPHFinalListing = TotalPPHFinalListing;
      TotalPPHFinalSelling = TotalPPHFinalSelling;
      NetCommission = TotalPPHFinalListing;
    }
  }
  TotalCommissionLead = parseFloat(v.TotalCommissionLead);
  TotalCommissionSell = parseFloat(v.TotalCommissionSell);
  NetCommission = parseFloat(NetCommission);
  if (v.Transaksi == "pemesanan" || v.Transaksi == "pemesanan_detail") {
    PropetiName = PropertiName + " An. " + AtasNama;
  } else {
    PropetiName = "Fee KPR " + PropertiName + " An. " + AtasNama;
  }
  itemo = '<table class="full-width">';
  itemo += '<tr>';
  itemo += '<td style="width:300px">Nomor Surat Pesanan</td>';
  itemo += '<td colspan="4">' + NoPemesanan + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td>Property</td>';
  itemo += '<td colspan="4">' + PropetiName + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td colspan="2">Nilai Transaksi</td>';
  itemo += '<td colspan="3">' + NilaiTransaksi + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td>Komisi</td>';
  itemo += '<td style="width:300px">' + KomisiPersen + '%</td>';
  itemo += '<td colspan="2">' + KomisiKotor.format(0, 3, ',', ',') + '</td>';
  itemo += '<td class="text-right">' + KomisiKotorNet.format(0, 3, ',', ',') + '</td>';
  itemo += '</tr>';

  if (ListingLead == 1 && MarketingType == 1) {
    itemo += '<tr>';
    itemo += '<td>Selling Comission</td>';
    itemo += '<td>' + parseFloat(v.CommissionSell) + '%</td>';
    itemo += '<td>' + TotalCommissionSell.format(0, 3, ',', ',') + '</td>';
    itemo += '<td colspan="2" class="text-right">' + TotalPPHFinalSell.format(0, 3, ',', ',') + '</td>';
    itemo += '</tr>';
    itemo += '<tr>';
    itemo += '<td>Lead Agent Commission</td>';
    itemo += '<td>' + parseFloat(v.CommissionLead) + '%</td>';
    itemo += '<td>' + TotalCommissionLead.format(0, 3, ',', ',') + '</td>';
    itemo += '<td colspan="2" class="text-right">' + TotalPPHFinalLead.format(0, 3, ',', ',') + '</td>';
    itemo += '</tr>';
  }
  if (MarketingType == 2 || MarketingType == 3) {
    $.each(val.arrayBagiKomisi, function (i, atk) {
      if (atk.Type == 1 || atk.Type == 2) {
        if (atk.TypeCommission == 1) {
          itemo += '<tr>';
          itemo += '<td style="width:300px">Listing Commission <br/><strong>' + atk.OfficeName + '</strong></td>';
          itemo += '<td>' + parseFloat(KomisiListing) + '%</td>';
          itemo += '<td>' + format1(TotalKomisiListing, "") + '</td>';
          itemo += '<td colspan="2" class="text-right">' + format1(TotalPPHFinalListing, "") + '</td>';
          itemo += '</tr>';
        } else {
          itemo += '<tr>';
          itemo += '<td style="width:300px">Selling Commission <br/><strong>' + atk.OtherOfficeName + '</strong></td>';
          itemo += '<td>' + parseFloat(KomisiSelling) + '%</td>';
          itemo += '<td>' + format1(TotalKomisiSelling, "") + '</td>';
          itemo += '<td colspan="2" class="text-right">' + format1(TotalPPHFinalSelling, "") + '</td>';
          itemo += '</tr>';
        }
      }
    });
  }
  if (BiayaAdm > 0) {
    itemo += '<tr>';
    itemo += '<td>Biaya Administrasi</td>';
    itemo += '<td colspan="4" class="text-right">' + BiayaAdmTxt + '</td>';
    itemo += '</tr>';
  }
  if (PPH23 > 0) {
    itemo += '<tr>';
    itemo += '<td>PPH 23</td>';
    itemo += '<td colspan="2">2%</td>';
    itemo += '<td colspan="2">' + PPH23Txt + '</td>';
    itemo += '</tr>';
  }
  if (ReferalName != null && ReferalName.length > 0) {
    itemo += '<tr>';
    itemo += '<td>Referal Fee</td>';
    itemo += '<td colspan="2">' + ReferalName + '</td>';
    itemo += '<td colspan="2">' + ReferalFeeTxt + '</td>';
    itemo += '</tr>';
  }
  if (PPHFinal > 0) {
    itemo += '<tr>';
    itemo += '<td>PPH Final</td>';
    itemo += '<td colspan="2">1%</td>';
    itemo += '<td colspan="2">' + PPHFinalTxt + '</td>';
    itemo += '</tr>';
  }
  itemo += '<tr>';
  itemo += '<td colspan="4"><strong>Total Net Commission</strong></td>';
  itemo += '<td class="text-right"><strong>' + NetCommission.format(0, 3, ',', ',') + '</stong></td>';
  itemo += '</tr>';
  itemo += '</table>';
  itemm = '';
  itemoffice = '';
  itemx = '';
  itemprinciple = '';
  itemmanager = '';
  itemkoor = '';
  itemmarketing = '';

  MarketCommission = 0;
  $.each(val.arrayBagiKomisi, function (i, a) {
    if (
      v.PaymentDetID == PaymentDetID && HakAkses == "marketing" && MarketingIDLogin == a.MarketingID ||
      v.PaymentDetID == PaymentDetID && HakAkses != "marketing") {
      ApproveStatus = a.ApproveStatus;
      Commission = a.Commission;
      MarketingName = a.MarketingName;
      Commission = parseInt(Commission);
      persenkomisi = 100 / KomisiPersen;

      CommissionPercent = parseFloat(a.CommissionPercent);
      // CommissionPercent   = Commission / KomisiKotorNet * 100 / persenkomisi;
      // CommissionPercent   = CommissionPercent.format(2, 3, ',', ',');
      // if(a.Type == 4){
      //   CommissionPercent   = Commission / KomisiKotorNet * 100 / persenkomisi;
      //   CommissionPercent   = CommissionPercent.format(3, 3, ',', ',');
      // }

      CommissionTxt = a.CommissionTxt;
      PPH21Txt = a.PPH21Txt;
      TotalCommissionTxt = a.TotalCommissionTxt;
      GrandTotal = a.GrandTotal;
      TotalMarketing = val.arrayBagiKomisi.length;
      MarketCommission = GrandTotal / TotalMarketing;
      if (DuitMarketing > 0) {
        MarketCommission = DuitMarketing;
      }
      if (a.Type == 1) {
        label_marketing = "Kantor";
      } else if (a.Type == 3) {
        label_marketing = "Principal Comission";
      } else if (a.Type == 4) {
        label_marketing = "Manager Comission";
      } else if (a.Type == 5) {
        label_marketing = "Koordinator Comission";
      } else {
        label_marketing = "Marketing Commission";
      }
      label_name = '';
      if (a.Type == 6) {
        label_name = 'Marketing 1';
      } else if (a.Type == 1) {
        label_name = 'Antar Kantor';
        MarketingName = a.OfficeName;
      } else if (a.Type == 2) {
        label_name = 'Kantor Lain';
        MarketingName = a.OtherOfficeName;
      }
      if (a.Type == 1) {
        if (a.TypeCommission == 1) {
          itemoffice += '<tr><td><table class="full-width">';
          itemoffice += '<tr>';
          itemoffice += '<td style="width:300px;"><strong>' + label_marketing + '</strong></td>';
          // MarketingName = "";
          itemoffice += '<td style="width:300px;"><strong>' + MarketingName + '</stong></td>';
          itemoffice += '<td style="width:150px;">' + CommissionPercent + '%</td>';
          itemoffice += '<td colspan="2">' + CommissionTxt + '</td>';
          itemoffice += '</tr>';
          itemoffice += '<tr>';
          itemoffice += '<td colspan="4"><strong>Total Komisi Kantor </strong></td>';
          itemoffice += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
          itemoffice += '</tr>';
          itemoffice += '</table></td></tr>';
        }
      }
      if (a.Type > 2) {
        itemx = '<tr><td><table class="full-width">';
        itemx += '<tr>';
        itemx += '<td colspan="5"><strong>' + label_marketing + '</strong></td>';
        itemx += '</tr>';
        itemx += '<tr>';
        itemx += '<td style="width:300px;">' + label_name + '</td>';
        itemx += '<td style="width:300px;"><strong>' + MarketingName + '</stong></td>';
        itemx += '<td style="width:150px;">' + CommissionPercent + '%</td>';
        itemx += '<td colspan="2">' + CommissionTxt + '</td>';
        itemx += '</tr>';
        itemx += '<tr>';
        itemx += '<td colspan="4">PPH 21</td>';
        itemx += '<td class="text-right">' + PPH21Txt + '</td>';
        itemx += '</tr>';
        itemx += '<tr>';
        itemx += '<td colspan="4"><strong>Net Commission</strong></td>';
        itemx += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
        itemx += '</tr>';
        itemx += '</table></td></tr>';

        if (a.Type == 3) {
          itemprinciple += itemx;
        } else if (a.Type == 4) {
          itemmanager += itemx;
        } else if (a.Type == 5) {
          itemkoor += itemx;
        } else if (a.Type == 6) {
          itemmarketing += itemx;
        }
      }
    }
  });

  itemm += itemmarketing;
  itemm += itemmanager;
  itemm += itemkoor;
  itemm += itemprinciple;


  itemk = '<table class="full-width">';
  itemk += '<tr>';
  itemk += '<td><strong>Total Commission</strong></td>';
  itemk += '<td class="text-right"><strong>' + NetCommission.format(0, 3, ',', ',') + '</strong></td>';
  itemk += '</tr>';
  itemk += '</table>';
  tbl = '<table id="table" class="table table-bordered full-width">';
  if (TypePembayaranID == 1) {
    PaymentType = 'Klaim Imbalan KPR';
  } else if (TypePembayaranID == 2) {
    PaymentType = PaymentType;
  } else {
    PaymentType = "";
  }


  inputan = '<input name="cekbox[]" type="checkbox" value="' + PaymentDetID + '" />';
  inputan += '<input name="PaymentDetID[]" type="hidden" value="' + PaymentDetID + '" />';
  inputan += '<input name="PPN[]" type="hidden" value="' + NilaiTransaksi + '" />';
  inputan += '<input name="TotalPO[]" type="hidden" value="' + NilaiTransaksi + '" />';

  if (ApproveStatus == 2) {
    tbl += '<tr><td>' + inputan + ' <stong style="margin:left:20px;">' + PaymentType + '</strong></td></tr>';
  } else {
    if (ApproveStatus == 3) {
      ApproveStatustext = "ditolak";
    } else {
      ApproveStatustext = "belum disetujui";
    }
    ApproveStatustext = "<strong>Maaf pembagian komisi ini " + ApproveStatustext + "</strong>";
    tbl += '<tr><td><stong style="margin:left:20px;">' + PaymentType + '</strong> - ' + ApproveStatustext + '</td></tr>';
  }
  console.log(ApproveStatus);
  tbl += '<tr><td>' + itemo + '</td></tr>';
  tbl += itemm;
  tbl += itemoffice;
  tbl += '<tr><td>' + itemk + '</td></tr>';
  tbl += '</table>';
  item = '<div class="row paymentdetid-' + v.PaymentDetID + '">';
  item += '<div class="div-komisi-pembayaran">' + tbl + '</div>';
  item += '</div>';
  $(".div-komisi").append(item);
}
function append_komisi_secondary(val, v, ui, PaymentDetID) {
  ApproveStatus = 0;
  DuitMarketing = 0;
  BiayaAdm = v.BiayaAdm;
  BiayaAdmTxt = v.BiayaAdmTxt;
  NetCommission = v.GrandTotalTxt;
  ReferalFee = v.Referal;
  ReferalFeeTxt = v.ReferalFeeTxt;
  ReferalName = v.ReferalName;
  PPH23 = v.PPH23;
  PPH23Txt = v.PPH23Txt;
  PPHFinal = v.PPHFinal;
  PPHFinalTxt = v.PPHFinalTxt;
  TypePembayaranID = v.TypePembayaranID;
  PropertiName = v.PropertiName;
  AtasNama = v.AtasNama;
  PaymentType = v.PaymentType;
  NoPemesanan = v.NoPemesanan;
  NilaiTransaksi = parseFloat(v.NilaiTransaksi);
  KomisiPersen = parseFloat(v.KomisiPersen);
  KomisiKotor = parseFloat(v.KomisiKotor);

  if (TypePembayaranID == 1) {
    PropetiName = "Fee KPR " + PropertiName + " An. " + AtasNama;

  } else if (TypePembayaranID == 2) {
    PropetiName = PropertiName + " An. " + AtasNama;
  }


  itemo = '<table class="full-width">';
  itemo += '<tr>';
  itemo += '<td style="width:300px">Nomor Surat Pesanan</td>';
  itemo += '<td colspan="4">' + NoPemesanan + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td>Property</td>';
  itemo += '<td colspan="4">' + PropetiName + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td colspan="2">Nilai Transaksi</td>';
  itemo += '<td colspan="3">' + NilaiTransaksi.format(0, 3, ',', ',') + '</td>';
  itemo += '</tr>';
  itemo += '<tr>';
  itemo += '<td>Komisi</td>';
  itemo += '<td style="width:300px">' + KomisiPersen + '%</td>';
  itemo += '<td colspan="3">' + KomisiKotor.format(0, 3, ',', ',') + '</td>';
  itemo += '</tr>';
  if (BiayaAdm > 0) {
    itemo += '<tr>';
    itemo += '<td>Biaya Administrasi</td>';
    itemo += '<td colspan="4" class="text-right">' + BiayaAdmTxt + '</td>';
    itemo += '</tr>';
  }
  if (PPH23 > 0) {
    itemo += '<tr>';
    itemo += '<td>PPH 23</td>';
    itemo += '<td>2%</td>';
    itemo += '<td colspan="3" class="text-right">' + PPH23Txt + '</td>';
    itemo += '</tr>';
  }
  if (PPHFinal > 0) {
    itemo += '<tr>';
    itemo += '<td>PPH Final</td>';
    itemo += '<td>1%</td>';
    itemo += '<td colspan="3" class="text-right">' + PPHFinalTxt + '</td>';
    itemo += '</tr>';
  }
  if (ReferalName != null && ReferalName.length > 0) {
    itemo += '<tr>';
    itemo += '<td><strong>Referal Fee</strong></td>';
    itemo += '<td colspan="3">' + ReferalName + '</td>';
    itemo += '<td  class="text-right"><strong>' + ReferalFeeTxt + '</strong></td>';
    itemo += '</tr>';
  }
  itemo += '<tr>';
  itemo += '<td colspan="4"><strong>Total Net Commission</strong></td>';
  itemo += '<td class="text-right"><strong>' + NetCommission + '</stong></td>';
  itemo += '</tr>';
  itemo += '</table>';
  itemselling = '';
  itemlisting = '';
  itemm = '';
  $.each(val.arrayBagiKomisi, function (i, v) {
    itemm = '';
    if (
      v.PaymentDetID == PaymentDetID && HakAkses == "marketing" && MarketingIDLogin == v.MarketingID ||
      v.PaymentDetID == PaymentDetID && HakAkses != "marketing") {
      itemm = '<tr><td><table class="full-width">';

      ApproveStatus = v.ApproveStatus;
      Commission = v.Commission;
      MarketingName = v.MarketingName;
      CommissionPercentTxt = v.CommissionPercentTxt;
      CommissionTxt = v.CommissionTxt;
      PPH21Txt = v.PPH21Txt;
      TotalCommissionTxt = v.TotalCommissionTxt;
      TotalMarketing = val.arrayBagiKomisi.length;
      GrandTotal = v.GrandTotal;
      MarketCommission = parseFloat(GrandTotal) / parseFloat(TotalMarketing);
      MarketCommission = parseFloat(v.Commission);

      if (v.TypeCommission == 1) {
        label_marketing = "Listing Commission";
      } else {
        label_marketing = "Selling Commission";
      }

      label_name = '';
      if (v.Type == 6) {
        label_name = 'Marketing 1';
      } else if (v.Type == 8) {
        label_name = 'Antar Kantor';
        MarketingName = v.OfficeName;
      } else if (v.Type == 2) {
        label_name = 'Kantor Lain';
        MarketingName = v.OtherOfficeName;
      }
      if (v.Type == 1 || v.Type == 2) {
        itemm += '<tr>';
        itemm += '<td colspan="5"><strong>' + label_marketing + '</strong></td>';
        itemm += '</tr>';
        itemm += '<tr>';
        itemm += '<td style="width:300px;">' + label_name + '</td>';
        itemm += '<td colspan="3" style="width:300px;" ><strong>' + MarketingName + '</stong></td>';
        itemm += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
        itemm += '</tr>';
      } else if (v.Type == 7) {
        itemm += '<tr>';
        itemm += '<td style="width:300px;"><strong>Listing commission</strong></td>';
        itemm += '<td style="width:300px;"><strong>' + MarketingName + '</strong></td>';
        itemm += '<td style="width:150px;">' + CommissionPercentTxt + '%</td>';
        itemm += '<td colspan="2" class="text-right">' + CommissionTxt + '</td>';
        itemm += '</tr>';
      } else {
        $.each(val.arrayOffice, function (ip, vo) {
          if (vo.ParentID == v.CommissionDetailID) {
            MarketCommission += parseFloat(vo.Commission);
          }
        });

        itemm += '<tr>';
        itemm += '<td colspan="2"><strong>' + label_marketing + '</strong></td>';
        itemm += '<td colspan="3" class="text-right">' + MarketCommission.format(0, 3, ',', ',') + '</td>';
        itemm += '</tr>';
        itemm += '<tr>';
        itemm += '<td style="width:300px;">' + label_name + '</td>';
        itemm += '<td style="width:300px;"><strong>' + MarketingName + '</stong></td>';
        itemm += '<td style="width:150px;">' + CommissionPercentTxt + '%</td>';
        itemm += '<td colspan="2">' + CommissionTxt + '</td>';
        itemm += '</tr>';
        itemm += '<tr>';
        itemm += '<td colspan="4">PPH 21</td>';
        itemm += '<td class="text-right">' + PPH21Txt + '</td>';
        itemm += '</tr>';
        itemm += '<tr>';
        itemm += '<td colspan="4"><strong>Net Commission</strong></td>';
        itemm += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
        itemm += '</tr>';

      }
      $.each(val.arrayOffice, function (ip, vo) {
        if (vo.ParentID == v.CommissionDetailID) {
          MarketingName = vo.MarketingName;
          CommissionPercentTxt = vo.CommissionPercentTxt;
          Commission = vo.Commission;
          CommissionTxt = vo.CommissionTxt;
          PPH21Txt = vo.PPH21Txt;
          TotalCommissionTxt = vo.TotalCommissionTxt;
          PotonganPrinciple = parseFloat(Commission) / 100 * 10;

          CommissionOfficeNet = Commission - PotonganPrinciple;
          CommissionOfficeNet = CommissionOfficeNet.format(0, 3, ',', ',');
          if (v.Type == 7) {
            itemm += '<tr>';
            itemm += '<td><strong>Selling Commission</strong></td>';
            itemm += '<td><strong>Discovery</strong></td>';
            itemm += '<td>' + CommissionPercentTxt + '%</td>';
            itemm += '<td class="text-right">' + CommissionTxt + '</td>';
            // itemm += '<td class="text-right">'+CommissionOfficeNet+'</td>';
            itemm += '</tr>';
            DuitMarketing = Commission;
          } else {
            itemm += '<tr>';
            itemm += '<td colspan="2">Komisi Kantor</td>';
            itemm += '<td>' + CommissionPercentTxt + '%</td>';
            itemm += '<td>' + CommissionTxt + '</td>';
            itemm += '<td class="text-right">' + CommissionOfficeNet + '</td>';
            itemm += '</tr>';

          }

          $.each(val.arrayPrinciple, function (ip, vp) {
            if (vp.ParentID == vo.CommissionDetailID) {
              MarketingName = vp.MarketingName;
              CommissionPercentTxt = vp.CommissionPercentTxt;
              CommissionTxt = vp.CommissionTxt;
              PPH21Txt = vp.PPH21Txt;
              TotalCommissionTxt = vp.TotalCommissionTxt;

              itemm += '<tr>';
              itemm += '<td style="width:300px">Principal Commission</td>';
              itemm += '<td style="width:300px;"><strong>' + MarketingName + '</stong></td>';
              itemm += '<td>' + CommissionPercentTxt + '%</td>';
              itemm += '<td colspan="2">' + CommissionTxt + '</td>';
              itemm += '</tr>';
              itemm += '<tr>';
              itemm += '<td colspan="4">PPH 21</td>';
              itemm += '<td class="text-right">' + PPH21Txt + '</td>';
              itemm += '</tr>';
              itemm += '<tr>';
              itemm += '<td colspan="4"><strong>Net Principal Commission</strong></td>';
              itemm += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
              itemm += '</tr>';
            }
          });

          $.each(val.arrayAM, function (ip, vam) {
            if (vam.ParentID == vo.CommissionDetailID) {
              MarketingName = vam.MarketingName;
              CommissionPercentTxt = vam.CommissionPercentTxt;
              CommissionTxt = vam.CommissionTxt;
              PPH21Txt = vam.PPH21Txt;
              TotalCommissionTxt = vam.TotalCommissionTxt;

              itemm += '<tr>';
              itemm += '<td style="width:300px">Manager Commission</td>';
              itemm += '<td style="width:300px;"><strong>' + MarketingName + '</stong></td>';
              itemm += '<td>' + CommissionPercentTxt + '%</td>';
              itemm += '<td colspan="2">' + CommissionTxt + '</td>';
              itemm += '</tr>';
              itemm += '<tr>';
              itemm += '<td colspan="4">PPH 21</td>';
              itemm += '<td class="text-right">' + PPH21Txt + '</td>';
              itemm += '</tr>';
              itemm += '<tr>';
              itemm += '<td colspan="4"><strong>Net Manager Commission</strong></td>';
              itemm += '<td class="text-right"><strong>' + TotalCommissionTxt + '</stong></td>';
              itemm += '</tr>';
            }
          });
        }
      });
      itemm += '</table></td></tr>';
      if (v.TypeCommission == 1) {
        itemlisting += itemm;
      } else {
        itemselling += itemm;
      }
    }
  });
  itemm = itemlisting;
  itemm += itemselling;

  itemk = '<table class="full-width">';
  itemk += '<tr>';
  itemk += '<td><strong>Total Commission</strong></td>';
  itemk += '<td class="text-right"><strong>' + NetCommission + '</strong></td>';
  itemk += '</tr>';
  itemk += '</table>'
  tbl = '<table class="table table-bordered full-width">';
  if (TypePembayaranID == 1) {
    PaymentType = 'Klaim Imbalan KPR';
  } else if (TypePembayaranID == 2) {
    PaymentType = PaymentType;
  }
  inputan = '<input name="cekbox[]" type="checkbox" value="' + PaymentDetID + '" />';
  inputan += '<input name="PaymentDetID[]" type="hidden" value="' + PaymentDetID + '" />';
  inputan += '<input name="PPN[]" type="hidden" value="' + NilaiTransaksi + '" />';
  inputan += '<input name="TotalPO[]" type="hidden" value="' + NilaiTransaksi + '" />';

  if (ApproveStatus == 2) {
    tbl += '<tr><td>' + inputan + ' <stong style="margin:left:20px;">' + PaymentType + '</strong></td></tr>';
  } else {

    if (ApproveStatus == 3) {
      ApproveStatustext = "ditolak";
    } else {
      ApproveStatustext = "belum disetujui";
    }

    ApproveStatustext = "<strong>Maaf pembagian komisi ini " + ApproveStatustext + "</strong>";
    tbl += '<tr><td><stong style="margin:left:20px;">' + PaymentType + '</strong> - ' + ApproveStatustext + '</td></tr>';
  }
  tbl += '<tr><td>' + itemo + '</td></tr>';
  tbl += itemm;
  tbl += '<tr><td>' + itemk + '</td></tr>';
  tbl += '</table>';
  item = '<div class="row paymentdetid-' + v.PaymentDetID + '">';
  item += '<div class="div-komisi-pembayaran">' + tbl + '</div>';
  item += '</div>';
  $(".div-komisi").append(item);
}
Number.prototype.format = function (n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};
function format1(n, currency) {
  if (n > 0 || n < 0) {
    return currency + " " + n.toFixed(0).replace(/./g, function (c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    });
  } else {
    return 0.00;
  }
}