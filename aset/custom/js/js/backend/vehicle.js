var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var page_login = host + "main/login";
var page_register = host + "main/register";
var save_method = "add";
var table;
var url_list = host + "vehicle/list_data/";
var url_edit = host + "vehicle/edit/";
var url_hapus = host + "vehicle/delete/";
var url_simpan = host + "vehicle/save/";
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
var LastID;
$(document).ready(function () {
    load_datatables();
    $('#table tbody').on('click', 'tr', function () {
        $("#table tbody, .table tr").removeClass("active");
        row = table.row(this);
        data = table.row(this).data();
        element = this.childNodes[1].childNodes[0];
        if (element.classList.contains("active")) {
            element.classList.remove("active");
            $(this).removeClass("active");
        } else {
            $(".table div").removeClass("active");
            $(this).addClass("active");
            element.classList.add("active");
        }
    });
    // document.getElementById("add-attachment").addEventListener("change", readFile);    
    $("#form-stnk-input input").on("keyup", function (a) {
        STNK_TOTAL = 0;
        $.each($("#form-stnk-input input"), function (i, v) {
            if ($(v).hasClass("duit")) {
                val = $(v).val();
                if (val.length > 0) {
                    val = parseInt(val.replace(/\,/g, ''));
                } else {
                    val = 0;
                }
                STNK_TOTAL += val;
            }
        });
        $("#form-stnk-input [name=STNK_TOTAL]").val(number_format(STNK_TOTAL));
    });
    $("#form-kir-input input").on("keyup", function (a) {
        KIR_TOTAL = 0;
        $.each($("#form-kir-input input"), function (i, v) {
            if ($(v).hasClass("duit")) {
                val = $(v).val();
                if (val.length > 0) {
                    val = parseInt(val.replace(/\,/g, ''));
                } else {
                    val = 0;
                }
                KIR_TOTAL += val;
            }
        });
        $("#form-kir-input [name=KIR_TOTAL]").val(number_format(KIR_TOTAL));
    });
    $("#form-nopol-input input").on("keyup", function (a) {
        NOPOL_TOTAL = 0;
        $.each($("#form-nopol-input input"), function (i, v) {
            if ($(v).hasClass("duit")) {
                val = $(v).val();
                if (val.length > 0) {
                    val = parseInt(val.replace(/\,/g, ''));
                } else {
                    val = 0;
                }
                NOPOL_TOTAL += val;
            }
        });
        $("#form-nopol-input [name=NOPOL_TOTAL]").val(number_format(NOPOL_TOTAL));
    });
    document.getElementById("add-attachment").addEventListener("change", readFile);

    // Select type vehicle
    StatusVehicle = $('#form [name=STNK_JENIS]').find(':selected').val();
    if (StatusVehicle == "PERPANJANG_STNK") {
        $(".v_tnkb , .v_stnk").show(300);
    } else if (StatusVehicle == "BAYAR_PAJAK") {
        $(".v_tnkb , .v_stnk").hide(300);
        $("[name=STNK_ADM]").val("");
        $("[name=STNK_ADM_TNKB]").val("");
    }
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
    Status = $('#form-filter [name=Status]').find(':selected').val();

    data_post = {
        Filter: filter,
        InvoiceID: id,
        MenuID: menuid,
        Status: Status,
    }
    console.log(data_post);
    table = $('#table').DataTable({
        "pageLength": 25,
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
        "drawCallback": function(settings) {
            console.log(settings.json);
            //do whatever  
         },
        "columnDefs": [
            {
                "targets": [0], //last column
                "orderable": false, //set not orderable
            },
        ],
    });
    if (id && id > 0) {
        edit('<span data-id="' + id + '" data-method="view"></span>');
    }
}
function tambah(modul) {
    save_method = 'add';
    $(".form-title").text("Tambah Data");
    $("#form [name=DealerID]").next().show();
    $("#form [name=DealerName]").attr("type", "hidden");
    img_preview("reset");
    div_form("open");
    $("#StatusBPKB").val(1);
    $(".v_bpkb").hide();
    $(".approval-status-msg").empty();
    $(".c-disabled").attr("disabled", false);
    $(".panel-form .nav-tabs").hide();
    $("#form .main-input").next().show();
    $("#form .sub-input").attr("type", "hidden");
    $("#form .select2").val('none').trigger('change');
    NavID = 'tab-1';
}
function check_bpkb(element) {
    if ($(element).is(":checked")) {
        $(".v_bpkb").show();
    } else {
        $(".v_bpkb").hide();
    }
}

function edit(element) {
    dt = $(element).data();
    id = dt.id;
    method = dt.method;
    LastID = id;
    if (method == "view" || method == "view_next" || method == "view_prev") {
        save_method = 'view';
        method_before = 'view';
        $(".form-title").text("Lihat Data");
    } else {
        save_method = 'update';
        method_before = 'edit';
        $(".form-title").text("Ubah Data");
    }
    img_preview("reset");
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
                $("#StatusBPKB").val(1);
                $(".c-disabled").attr("disabled", true);
                $(".panel-form .nav-tabs").show();
                $("#form .select2").val('none').trigger('change');
                a = json.Data;
                NextID = a.NextID;
                PrevID = a.PrevID;
                DIV_STATUS_VEHICLE(a);

                $("#form [name=VehicleID]").val(a.VehicleID);

                $("#form [name=BrandID]").val(a.BrandID);
                $("#form [name=BrandID").val(a.BrandID).trigger('change');
                $("#form [name=BrandName]").val(a.BrandName);

                $("#form [name=TypeID]").val(a.TypeID);
                $("#form [name=TypeID").val(a.TypeID).trigger('change');
                $("#form [name=TypeName]").val(a.TypeName);

                $("#form [name=Code]").val(a.Code);
                $("#form [name=Codex]").val(a.Code);
                $("#form [name=VehicleIndexNo]").val(a.VehicleIndexNo);
                $("#form [name=VehicleIndexNo]").attr("disabled", true);
                $("#form [name=VehicleNoSTNK]").val(a.VehicleNoSTNK);
                $("#form [name=BackNo]").val(a.BackNo);
                $("#form [name=AsetNo]").val(a.AsetNo);
                $("#form [name=STNKNo]").val(a.STNKNo);
                $("#form [name=VehicleNo]").val(a.VehicleNo);
                $("#form [name=VehicleNoSTNK]").val(a.VehicleNoSTNK);
                $("#form [name=NOPOL_CODE_OLD]").val(a.VehicleNo);
                $("#form [name=InName]").val(a.InName);
                $("#form [name=Address]").val(a.Address);
                $("#form [name=VehicleType]").val(a.VehicleType);
                $("#form [name=VehicleType").val(a.VehicleType).trigger('change');
                $("#form [name=VehicleTypeName]").val(a.VehicleTypeName);

                if (a.Image) {
                    img_preview("set", host + a.Image);
                }
                if (a.StatusBPKB == 1) {
                    $("#form #StatusBPKB").prop("checked", true);
                    $(".v_bpkb").show();
                } else {
                    $("#form #StatusBPKB").prop("checked", false);
                    $(".v_bpkb").hide();
                }

                if (a.QrCode) {
                    item = "";
                    $.each(a.QrCode, function (i, v) {
                        qrc = v.QRValue + '.png';
                        if (v.Active) {
                            buttonAct = `<button type="button" class="btn-` + v.QRCodeID + ` btn btn-danger" onclick="act('deact', '` + v.QRCodeID + `')">Deactivate</button>`
                            labelAct = `<span style="width:25%;" class="txt-` + v.QRCodeID + ` badge text-bg-success">Active</span>`
                        } else {
                            buttonAct = `<button type="button" class="btn-` + v.QRCodeID + ` btn btn-success" onclick="act('act', '` + v.QRCodeID + `')">Activate</button>`
                            labelAct = `<span style="width:25%;" class="txt-` + v.QRCodeID + ` badge text-bg-danger">Non-Active</span>`
                        }
                        item += `
                        <tr>
                            <td>
                            <div style="display:flex;flex-direction:column;">
                            <a style="cursor:pointer;" onclick='view_qr("`+ qrc + `")' ><img style="box-shadow: 0px 2px 5px 3px #888888;" src="` + host + `/qr/` + qrc + `" width="20%"/></a>
                            `+ labelAct + `
                            </div>
                            </td>
                            <td>
                                `+ v.DateActive + `
                            </td>
                            <td>
                                `+ v.DateAdd + `
                            </td>
                            <td>
                            `+ buttonAct + `
                            </td>
                        </tr>`
                        $("#form #table-qr tbody").html(item);
                    })
                    console.log(item);
                }
                $("#form [name=Merk]").val(a.Merk);
                $("#form [name=Type]").val(a.Type);
                $("#form [name=Category]").val(a.Category);
                $("#form [name=Model]").val(a.Model);
                $("#form [name=Year]").val(a.Year);
                $("#form [name=Cylinder]").val(a.Cylinder);
                $("#form [name=FrameNo]").val(a.FrameNo);
                $("#form [name=MachineNo]").val(a.MachineNo);
                $("#form [name=Color]").val(a.Color);
                $("#form [name=TNKBColor]").val(a.TNKBColor);
                $("#form [name=Fuel]").val(a.Fuel);
                $("#form [name=FuelStandart]").val(a.FuelStandart)
                $("#form [name=RegisterYear]").val(a.RegisterYear);
                $("#form [name=BPKBNo]").val(a.BPKBNo);
                $("#form [name=LocationCode]").val(a.LocationCode);
                $("#form [name=RegisterOrderNo]").val(a.RegisterOrderNo);
                $("#form [name=Tranmission]").val(a.Tranmission);
                $("#form [name=OTRPrice]").val(a.OTRPrice);
                $("#form [name=GpsNo]").val(a.GpsNo);
                $("#form [name=PoolAddress]").val(a.PoolAddress);
                $("#form [name=Tolerance]").val(a.Tolerance);
                $("#form [name=Branch]").val(a.Branch);
                $("#form [name=STNKDate]").val(a.STNKDate);
                // $("#form [name=STNKDate]").datepicker("setDate", a.STNKDate);
                $("#form [name=BPKBDate]").val(a.BPKBDate);
                // $("#form [name=BPKBDate]").datepicker("setDate", a.BPKBDate);
                $("#form [name=SKPDDate]").val(a.SKPDDate);
                // $("#form [name=SKPDDate]").datepicker("setDate", a.SKPDDate);
                $("#form [name=InsuranceDate]").val(a.InsuranceDate);
                // $("#form [name=InsuranceDate]").datepicker("setDate", a.InsuranceDate);
                $("#form [name=KIRDate]").val(a.KIRDate);
                // $("#form [name=KIRDate]").datepicker("setDate", a.KIRDate);
                $("#form [name=PlateDate]").val(a.PlateDate);
                // $("#form [name=PlateDate]").datepicker("setDate", a.PlateDate);
                $("#form [name=SIPADate]").val(a.SIPADate);
                // $("#form [name=SIPADate]").datepicker("setDate", a.SIPADate);
                $("#form [name=IBMDate]").val(a.IBMDate);
                // $("#form [name=IBMDate]").datepicker("setDate", a.IBMDate);
                $("#form [name=IZINDate]").val(a.IZINDate);
                // $("#form [name=IZINDate]").datepicker("setDate", a.IZINDate);
                $("#form [name=Remark]").val(a.Remark);

                if (a.DATA_LEASE) {
                    b = a.DATA_LEASE;
                    $(".panel-form [name=VehicleLeaseID]").val(b.VehicleLeaseID);
                    $(".panel-form [name=CodeLease]").val(b.Code);
                    $(".panel-form [name=DealerName]").val(b.DealerName);
                    $(".panel-form [name=MarketingNameLease]").val(b.MarketingName);
                    $(".panel-form [name=MarketingPhoneLease]").val(b.MarketingPhone);
                    $(".panel-form [name=FlatRate]").val(b.FlatRate);
                    $(".panel-form [name=EffectiveRate]").val(b.EffectiveRate);
                    $(".panel-form [name=Periode]").val(b.Periode);
                    $(".panel-form [name=StartDateLease]").val(b.StartDate);
                    $(".panel-form [name=StartDateLease]").datepicker("setDate", b.StartDate);
                    $(".panel-form [name=EndDateLease]").val(b.EndDate);
                    $(".panel-form [name=EndDateLease]").datepicker("setDate", b.EndDate);
                    $(".panel-form [name=DownPayment]").val(b.DownPayment);
                    $(".panel-form [name=MainDebt]").val(b.MainDebt);
                    $(".panel-form [name=InstallmentMonth]").val(b.InstallmentMonth);
                    $(".panel-form [name=AdmFee]").val(b.AdmFee);
                    $(".panel-form [name=ProvinceFee]").val(b.ProvinceFee);
                    $(".panel-form [name=FidusiaFee]").val(b.FidusiaFee);
                    $(".panel-form [name=LeaseLiquidation]").val(b.LeaseLiquidation);
                    $(".panel-form [name=SettlementDealer]").val(b.SettlementDealer);
                    $(".panel-form [name=InsuranceValue]").val(b.InsuranceValue);
                    $(".panel-form [name=DiscountLease]").val(b.DiscountLease);
                    $(".panel-form [name=OTR]").val(b.OTR);
                    $(".panel-form [name=NetPrice]").val(b.NetPrice);
                    $(".panel-form [name=BPKBDateLease]").val(b.BPKBDate);
                    $(".panel-form [name=BPKBDateLease]").datepicker("setDate", b.BPKBDate);
                    $(".panel-form [name=RemarkLease]").val(b.Remark);
                    $(".panel-form [name=DealerID]").val(b.DealerID);
                    $(".panel-form [name=DealerID").val(b.DealerID).trigger('change');
                }
                if (a.DATA_INSURANCE) {
                    c = a.DATA_INSURANCE;
                    $(".panel-form [name=VehicleInsuranceID]").val(c.VehicleInsuranceID);
                    $(".panel-form [name=CodeInsurance]").val(c.Code);
                    $(".panel-form [name=InsuranceName]").val(c.InsuranceName);
                    $(".panel-form [name=InsuredName]").val(c.InsuredName);
                    $(".panel-form [name=MarketingNameInsurance]").val(c.MarketingName);
                    $(".panel-form [name=MarketingPhoneInsurance]").val(c.MarketingPhone);
                    $(".panel-form [name=TypeInsurance]").val(c.Type);
                    $(".panel-form [name=ThirdPartyLiability]").val(c.ThirdPartyLiability);
                    $(".panel-form [name=ThirdPartyLiabilityRate]").val(c.ThirdPartyLiabilityRate);
                    $(".panel-form [name=Premium]").val(c.Premium);
                    $(".panel-form [name=NetPremium]").val(c.NetPremium);
                    $(".panel-form [name=PAP]").val(c.PAP);
                    $(".panel-form [name=PAPRate]").val(c.PAPRate);
                    $(".panel-form [name=PAD]").val(c.PAD);
                    $(".panel-form [name=PADRate]").val(c.PADRate);
                    $(".panel-form [name=StartDateInsurance]").val(c.StartDate);
                    $(".panel-form [name=StartDateInsurance]").datepicker("setDate", c.StartDate);
                    $(".panel-form [name=EndDateInsurance]").val(c.EndDateInsurance);
                    $(".panel-form [name=EndDateInsurance]").datepicker("setDate", c.EndDate);
                    $(".panel-form [name=Discount]").val(c.Discount);
                    $(".panel-form [name=OwnRisk]").val(c.OwnRisk);
                    $(".panel-form [name=TotalSumInsured]").val(c.TotalSumInsured);
                    $(".panel-form [name=TotalSumInsuredRate]").val(c.TotalSumInsuredRate);
                    $(".panel-form [name=RemarkInsurance]").val(c.Remark);
                    $(".panel-form [name=InsuranceID]").val(c.InsuranceID);
                    $(".panel-form [name=InsuranceID").val(c.InsuranceID).trigger('change');
                }

                if (method_before == "view") {
                    $("#form .main-input").next().hide();
                    $("#form .sub-input").attr("type", "text");

                    $("#form [name=DealerID], #form [name=InsuranceID]").next().hide();
                    $("#form [name=DealerName], #form [name=InsuranceName]").attr("type", "text");
                } else {
                    $("#form .main-input").next().show();
                    $("#form .sub-input").attr("type", "hidden");

                    $("#form [name=DealerID], #form [name=InsuranceID]").next().show();
                    $("#form [name=DealerName], #form [name=InsuranceName]").attr("type", "hidden");
                }
                // $("#form [name=VehilceType]").attr("disabled",true);
                // $("#form [name=VehicleType]").next().hide();
                // $("#form [name=VehicleTypeName]").attr("type","text");

                if (a.ListDetail) {
                    ArraySTNK = [];
                    ArrayKIR = [];
                    ArrayNOPOL = [];
                    ArrayINSURANCE = [];
                    ArraySIPA = [];
                    ArrayIBM = [];
                    ArrayIZIN = [];
                    $.each(a.ListDetail, function (i, v) {
                        if (v.Type == "STNK" || v.Type == "STNK_PLAT") {
                            ArraySTNK.push(v);
                        } else if (v.Type == "KIR") {
                            ArrayKIR.push(v);
                        } else if (v.Type == "NOPOL") {
                            ArrayNOPOL.push(v);
                        } else if (v.Type == "INSURANCE") {
                            ArrayINSURANCE.push(v);
                        } else if (v.Type == "SIPA") {
                            ArraySIPA.push(v);
                        } else if (v.Type == "IBM") {
                            ArrayIBM.push(v);
                        } else if (v.Type == "IZIN") {
                            ArrayIZIN.push(v);
                        }
                    });
                    $("#table-history-stnk tbody").empty();
                    if (ArraySTNK.length > 0) {
                        $.each(ArraySTNK, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-stnk-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + number_format(vv.STNK_BBNKB) + '</td>';
                            item += '<td>' + number_format(vv.STNK_PKB) + '</td>';
                            item += '<td>' + number_format(vv.STNK_SWDKLLJ) + '</td>';
                            item += '<td>' + number_format(vv.STNK_ADM) + '</td>';
                            item += '<td>' + number_format(vv.STNK_ADM_TNKB) + '</td>';
                            item += '<td>' + number_format(vv.STNK_DENDA) + '</td>';
                            item += '<td>' + number_format(vv.STNK_BIAYA_SERVICE) + '</td>';
                            item += '<td>' + number_format(vv.STNK_TOTAL) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            if(v.Type == 'STNK_PLAT'){
                                item += '<td> Pajak 5 Tahunan </td>';
                            }else{
                                item += '<td> Pajak Tahunan </td>';
                            }
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-stnk tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="12" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-stnk tbody").append(item);
                    }
                    $("#table-history-kir tbody").empty();
                    if (ArrayKIR.length > 0) {
                        $.each(ArrayKIR, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-kir-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + number_format(vv.KIR_BIAYA_PERPANJANGAN) + '</td>';
                            item += '<td>' + number_format(vv.KIR_GANTI_BUKU) + '</td>';
                            item += '<td>' + number_format(vv.KIR_BUKU_HILANG) + '</td>';
                            item += '<td>' + number_format(vv.KIR_DENDA) + '</td>';
                            item += '<td>' + number_format(vv.KIR_BIAYA_SERVICE) + '</td>';
                            item += '<td>' + number_format(vv.KIR_TOTAL) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-kir tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="9" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-kir tbody").append(item);
                    }
                    $("#table-history-nopol tbody").empty();
                    if (ArrayNOPOL.length > 0) {
                        $.each(ArrayNOPOL, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-nopol-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + vv.NOPOL_CODE_OLD + '</td>';
                            if (vv.NOPOL_CODE_NEW) {
                                item += '<td>' + vv.NOPOL_CODE_NEW + '</td>';
                            } else {
                                item += '<td>' + vv.NOPOL_CODE + '</td>';
                            }
                            item += '<td>' + number_format(vv.NOPOL_CEK_FISIK) + '</td>';
                            item += '<td>' + number_format(vv.NOPOL_PRINT_STNK) + '</td>';
                            item += '<td>' + number_format(vv.NOPOL_DENDA) + '</td>';
                            item += '<td>' + number_format(vv.NOPOL_BIAYA_SERVICE) + '</td>';
                            item += '<td>' + number_format(vv.NOPOL_TOTAL) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-nopol tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="10" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-nopol tbody").append(item);
                    }
                    $("#table-history-insurance tbody").empty();
                    if (ArrayINSURANCE.length > 0) {
                        $.each(ArrayINSURANCE, function (i, v) {
                            vv = v.Detail[0];
                            console.log(vv);
                            class_tr = 'tr-item-insurance-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + v.Code + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + vv.Type + '</td>';
                            item += '<td>' + v.VendorName + '</td>';
                            item += '<td>' + number_format(vv.NetPremium) + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-insurance tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="7" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-insurance tbody").append(item);
                    }
                    $("#table-history-sipa tbody").empty();
                    if (ArraySIPA.length > 0) {
                        $.each(ArraySIPA, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-sipa-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + number_format(v.TotalPrice) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-sipa tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-sipa tbody").append(item);
                    }
                    $("#table-history-ibm tbody").empty();
                    if (ArrayIBM.length > 0) {
                        $.each(ArrayIBM, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-ibm-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + number_format(v.TotalPrice) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-ibm tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-ibm tbody").append(item);
                    }
                    $("#table-history-izin tbody").empty();
                    if (ArrayIZIN.length > 0) {
                        $.each(ArrayIZIN, function (i, v) {
                            vv = v.Detail[0];
                            class_tr = 'tr-item-izin-' + v.VehicleDetailID;
                            link_delete = '<a href="javascrip:void(0);" onclick="hapus_detail(this)" data-id="' + v.VehicleDetailID + '" data-class="' + class_tr + '" class="btn btn-xs btn-white"><i class="ti-trash"></i></a>'
                            item = '<tr class="' + class_tr + '">';
                            item += '<td>' + number_format(v.TotalPrice) + '</td>';
                            item += '<td>' + v.DateOld + '</td>';
                            item += '<td>' + v.DateNew + '</td>';
                            item += '<td>' + link_delete + '</td>';
                            item += '</tr>';
                            $("#table-history-izin tbody").append(item);
                        });
                    } else {
                        item = '<tr><td colspan="4" class="empty">Data tidak ada</td></tr>';
                        $("#table-history-izin tbody").append(item);
                    }

                }
                if (json.Data.ListAttachment && json.Data.ListAttachment.length > 0) {
                    $.each(json.Data.ListAttachment, function (i, v) {
                        setting = {
                            add_list: '-' + v.Category,
                            limit: 20,
                            limit_big: 10000, // kb
                        }
                        add_attachment('update', v, '', setting);
                    });
                }

                SetHistoryData('HistoryBuySell', json.Data.HistoryBuySell);
                SetHistoryData('HistoryContract', json.Data.HistoryContract);
                SetHistoryData('HistoryContractDay', json.Data.HistoryContractDay);
                SetHistoryData('HistorySendPooling', json.Data.HistorySendPooling);
                SetHistoryData('HistoryService', json.Data.HistoryService);

                CheckBtnNextPrev();

            } else {

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", "Terjadi kesalahan gagal mendapatkan data");
        }
    });
}

function SetListPiutang(ListData) {
    $("#table-piutang tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            classtr = "";
            if (v.TOP < 0) {
                classtr = "tr-red";
            } else if (v.TOP == 0) {
                classtr = "tr-yellow";
            }

            Code = '<a href="' + host + 'backend/invoice?id=' + v.InvoiceID + '" target="_blank">' + v.Code + '</a>';
            VendorName = '<a href="' + host + 'backend/konsumen?id=' + v.VendorID + '" target="_blank">' + v.VendorName + '</a>';

            item = '<tr class="' + classtr + '">';
            item += '<td>' + VendorName + '</td>';
            item += '<td>' + Code + '</td>';
            item += '<td class="text-right">' + v.TotalPrice + '</td>';
            item += '<td style="text-align:center;">' + v.TOP + '</td>';
            item += '</tr>';
            $("#table-piutang tbody").append(item);
        });
    } else {
        $("#table-piutang tbody").append('<tr><td colspan="4">Data Tidak Ada</td></tr>');
    }
}
function SetHistoryData(table, ListData) {
    id_table = "";
    colspan = 0;
    if (table == "HistoryBuySell") {
        id_table = "#table-history-buysell";
        colspan = 5;
    } else if (table == "HistoryContract") {
        id_table = "#table-history-contract";
        colspan = 6;
    } else if (table == "HistoryContractDay") {
        id_table = "#table-history-contract-day";
        colspan = 6;
    } else if (table == "HistorySendPooling") {
        id_table = "#table-history-send-pooling";
        colspan = 5;
    } else if (table == "HistoryService") {
        id_table = "#table-history-service";
        colspan = 5;
    }
    tr_empty = '<tr><td colspan="' + colspan + '">Data tidak ada</td></tr>';
    $(id_table + ' tbody').empty();
    if (ListData) {
        if (ListData.length > 0) {
            $.each(ListData, function (i, v) {
                item = '';
                item += '<tr>';
                $.each(v, function (ii, vv) {
                    item += '<td>' + vv + '</td>';
                });
                item += '</tr>';
                $(id_table + ' tbody').append(item);
            });
        } else {
            $(id_table + ' tbody').append(tr_empty);
        }
    } else {
        $(id_table + ' tbody').append(tr_empty);
    }
}
function reload_table() {
    table.ajax.reload(null, false); //reload datatable ajax
}
var count_save = 0;
function save(element) {
    console.log(save_method);
    btn_saving(element);
    if (save_method == "view") {
        swal("Info", "Maaf anda tidak bisa melakukan transaksi");
        return;
    }
    if (count_save == 0) {
        count_save = 1;
        dt = $(element).data();
        method = dt.method;
        url = host;
        url = host + 'vehicle/save/' + save_method;
        var form = $('#form')[0];
        var formData = new FormData(form);
        $.ajax({
            url: url,
            type: "POST",
            data: formData,
            mimeType: "multipart/form-data", // upload
            contentType: false, // upload
            cache: false, // upload
            processData: false, //upload
            dataType: "JSON",
            success: function (json) {
                console.log(json);
                if (json.Status) {
                    NextID = json.NextID;
                    PrevID = json.PrevID;
                    CheckBtnNextPrev();
                    $("#form-stnk-input input, #form-kir-input input, #form-nopol-input input").val("");
                    toastr.success(json.Message, "Information");
                    if (method == "close") {
                        div_form("close");
                    } else if (method == "new") {
                        save_method = "add";
                        img_preview("reset");
                        div_form("reset");
                    } else if (method == "keep") {
                        save_method = "update";
                        $("#form [name=VehicleID]").val(json.VehicleID);
                        edit('<span data-id="' + json.VehicleID + '" data-method="edit_keep"></span>');
                    }
                    reload_table();
                    btn_saving(element, 'reset');
                    count_save = 0;
                } else {
                    $('.form-group').removeClass('has-error');
                    $('.help-block').empty();
                    if (json.inputerror) {
                        console.log(json);
                        console.log(json.inputerror.length);
                        for (var i = 0; i < json.inputerror.length; i++) {
                            toastr.error(json.error_string[i], "Information");
                            if (json.type[i] == "alert") {
                                $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                                $('.' + json.inputerror[i] + 'Alert').text(json.error_string[i]);
                            } else if (json.type[i] == "alert_2") {
                                $('[name="' + json.inputerror[i] + '"]').parent().parent().addClass('has-error');
                                $('.' + json.inputerror[i] + 'Alert').text(json.error_string[i]);
                            } else {
                                $('[name="' + json.inputerror[i] + '"]').parent().addClass('has-error');
                                $('[name="' + json.inputerror[i] + '"]').next().text(json.error_string[i]);
                            }
                        }
                    }
                    if (json.inputerrordetail) {
                        $.each(json.inputerrordetail, function (i, v) {
                            toastr.error(v, "Information");
                            if (json.inputerrordetailid[i] != "") {
                                $("." + json.inputerrordetailid[i]).addClass("has-error");
                                $("." + json.inputerrordetailid[i] + ' .item-alert').show();
                            }
                        });
                    }
                    if (json.popup) {
                        swal("Info", json.Message);
                    }
                    btn_saving(element, 'reset');
                    count_save = 0;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                count_save = 0;
                console.log(jqXHR.responseText);
                btn_saving(element, 'reset');
                toastr.error("Terjadi kesalahan gagal menyimpan data", "Information");
            }
        });
    }
}
function hapus(id) {
    swal({
        title: "Info",
        text: language_app.are_you_sure,
        // type: "warning",   
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
                    url: url_hapus + id + "/nonactive",
                    type: "POST",
                    dataType: "JSON",
                    success: function (data) {
                        reload_table();
                        swal("Info", language_app.success_deleted);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Info", language_app.error_transaction);
                        console.log(jqXHR.responseText);
                    }
                });
            } else {
                swal("Info", language_app.cancel_deleted);
            }
        });
}
function hapus_detail(element) {
    dt = $(element).data();
    id = dt.id;
    classtr = dt.class;
    swal({
        title: "Info",
        text: language_app.are_you_sure,
        // type: "warning",   
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
                    url: host + 'vehicle/delete_detail/' + id,
                    type: "POST",
                    dataType: "JSON",
                    success: function (data) {
                        $("." + classtr).remove();
                        swal("Info", language_app.success_deleted);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Info", language_app.error_transaction);
                        console.log(jqXHR.responseText);
                    }
                });
            } else {
                swal("Info", language_app.cancel_deleted);
            }
        });
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
        }
    });
}
function DIV_STATUS_VEHICLE(a) {
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

    if (a.Status == 1) { asm.addClass("primary"); }
    else if (a.Status == 2) { asm.addClass("success"); }
    else if (a.Status == 3) { asm.addClass("warning"); }
    else if (a.Status == 4) { asm.addClass("danger"); }
    else if (a.Status == 5) { asm.addClass("inverse"); }
    else { asm.addClass("default"); }
    item += '<span><b>Status : </b> ' + a.StatusLabel + '</span>';
    asm.show();
    asm.append(item);
}
function GetType() {
    dt = $('#form [name=BrandID]').find(':selected').data();
    value = $('#form [name=BrandID]').find(':selected').val();
    type_tipe_op = $(".type_select option");
    $(".type_select_level").empty();
    item = '<option value="none">Pilih Tipe</option>';
    $(".type_select_level").append(item);
    if (value != "none") {
        $.each(type_tipe_op, function (i, v) {
            dtx = $(v).data();
            item = '<option value="' + dtx.id + '">' + dtx.name + '</option>';
            if (dt && dtx && dt.id == dtx.parentid) {
                $(".type_select_level").append(item);
            }
        });
    }
}

function select_type(element) {
    value = $(element).val();
    if (value == "PERPANJANG_STNK") {
        $(".v_tnkb , .v_stnk").show(300);
    } else if (value == "BAYAR_PAJAK") {
        $(".v_tnkb , .v_stnk").hide(300);
        $("[name=STNK_ADM]").val("");
        $("[name=STNK_ADM_TNKB]").val("");
    }
}

function NetHarga(){
    let OTR = parseFloat(document.getElementById('OTR').value.replace(/\,/g, '')) || 0;
    let discount = parseFloat($('#DiscountLease').val().replace(/\,/g, '')) || 0;
    NetPrice = OTR-discount;
    NetPrice = NetPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
  
    $('#NetPrice').val(NetPrice);
    
  }