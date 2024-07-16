//note : kalau lu gak paham bertanya kepada yang bisa selamat mencoba
//note :  tanya sama yang bikinnya lah tarif 100rb sekali tanya
var host = window.location.origin + '/';
var url = window.location.href;
var save_method; //for save method string
var table;
var page;
var data_post = [];
var report_type = 0;
var report, app, start_date, end_date, tahun, bulan, jenis_transaksi, bank, plate, Group;
var url_table;
$(document).ready(function () {
    $(".v_filter, .v_bulan, .v_tahun, .v_button, .v_UserID, .v_WorkStatusID, .v_pekerjaan, .v_pegawai").hide();
    v = $(".page-data").data();
    page = v.page;
    report = v.report;
    StartDate = v.start_date;
    EndDate = v.end_date;
    Tahun = v.tahun;
    Bulan = v.bulan;
    // UserID        = v.UserID;
    // WorkStatusID  = v.WorkStatusID;


    start_date = StartDate;
    end_date = EndDate;
    tahun = Tahun;
    bulan = Bulan;
    // UserID        = v.UserID;
    // WorkStatusID  = v.WorkStatusID

    $("[name=StartDate]").val(start_date);
    $("[name=EndDate]").val(end_date);
    $("[name=Tahun]").val(Tahun);
    $("[name=Bulan]").val(Bulan);
    // $("[name=UserID]").val(UserID);
    // $("[name=WorkStatusID]").val(WorkStatusID);


    if (report != "none") {
        $("[name=report]").val(report);
        load_page("report", report);
    }
});
function checked_status(element) {
    dt = $(element).data();
    if ($("[name=Report]").val() == "laporan_outstanding_order" || $("[name=Report]").val() == "laporan_outstanding_invoice") {
        if (dt.id == 1) {
            if ($(element).is(":checked")) {
                $("#CheckSPK").prop("checked", true);
                $("#CheckCranePool, #CheckInvoice, #CheckPayment").prop("checked", false);
            } else {
                $("#CheckSPK, #CheckCranePool, #CheckInvoice, #CheckPayment").prop("checked", false);
            }
        } else if (dt.id == 2) {
            if ($(element).is(":checked")) {
                $("#CheckSPK, #CheckCranePool").prop("checked", true);
                $("#CheckInvoice, #CheckPayment").prop("checked", false);
            } else {
                $("#CheckCranePool, #CheckInvoice, #CheckPayment").prop("checked", false);
            }
        } else if (dt.id == 3) {
            if ($(element).is(":checked")) {
                $("#CheckSPK, #CheckCranePool, #CheckInvoice").prop("checked", true);
                $("#CheckPayment").prop("checked", false);
            } else {
                $("#CheckInvoice, #CheckPayment").prop("checked", false);
            }
        } else if (dt.id == 4) {
            if ($(element).is(":checked")) {
                $("#CheckSPK, #CheckCranePool, #CheckInvoice, #CheckPayment").prop("checked", true);
            } else {
                $("#CheckSPK, #CheckCranePool, #CheckInvoice").prop("checked", true);
            }
        } else {
            // $("#CheckSPK, #CheckCranePool, #CheckInvoice, #CheckPayment").prop("checked",false);
        }
        Status = $("input[name='Status[]']").map(function () {
            if ($(this).is(":checked")) {
                return $(this).val();
            }
        }).get();
        // if(Status.length >= 1){
        //     $(".v_operator, .v_rigger").show();
        // } else {
        //     $(".v_operator, .v_rigger").hide();
        // }
    }
}
function load_page(page = "") {
    div_report = $("#div-report")
    report = $("[name=Report]").val();
    Group = $("[name=Group]").val();
    $("[name=Search]").val("");
    $(".div-loader").show();
    if (report == "none") {
        div_report.empty();
        $(".div-loader").hide();
        $(".v_filter, .v_button").hide();
        $(".select2").val('none').trigger('change');
        $("input[type=checkbox]").prop("checked", false);
    } else {
        $("input[type=checkbox]").prop("checked", false);
        $(".select2").val('none').trigger('change');
        $(".v_filter, .v_status .v_checkbox").hide();
        $(".v_date_start, .v_date_end").show();
        $(".v_button").show();
        if (report == "laporan_outstanding_order") {
            $(".v_search, .v_status, .v_status .v_checkbox, .v_konsumen, .v_rigger, .v_operator, .v_ppn, .lb_ppn").show();
            $(".v_status").css("width", "40%");
        } else if (report == "laporan_kartu_piutang") {
            $(".v_konsumen").show();
        } else if (report == "laporan_absen_stp") {
            $(".v_pegawaiSTP").show();
            $(".v_typeSTP").show();
            // $(".btn-excell").hide();
        } else if (report == "laporan_rekap_stp_jmto") {
            $(".v_search").show();
        } else if (report == "laporan_rekap_stp") {
            $(".v_search").show();
        } else if (report == "laporan_pengguna_jasa") {
            $(".v_search").show();
        } else if (report == "matrix_golongan") {
            // $("#Tahun").datepicker({ dateFormat: 'yy' });
            $(".v_year").show();
            $(".v_date_start, .v_date_end").hide();
        } else if (report == "laporan_saldo_piutang") {
            $(".v_konsumen").show();
        } else if (report == "laporan_outstanding_invoice") {
            $(".v_status").css("width", "20%");
            $(".v_search, .v_konsumen, .v_status, .v_status .v_check_payment, .v_ppn").show();
        } else if (report == "laporan_hasil_survey") {
            $(".v_search, .v_marketing, .v_agent").show();
        } else if (report == "laporan_uang_jalan") {
            $(".v_search, .v_marketing, .v_agent, .v_ppn").show();
        } else if (report == "laporan_bad_debt") {
            $(".v_konsumen").show();
        } else if (report == "laporan_umur_piutang") {
            $(".v_konsumen, .v_search").show();
        } else if (report == "laporan_kontrak") {
            $(".v_konsumen, .v_search").show();
        } else if (report == "laporan_stnk") {
            $(".v_search").show();
        } else if (report == "laporan_mobil") {
            $(".v_date_start, .v_date_end").hide();
            $(".v_vehicle").show();
        } else if (report == "laporan_kartu_spk") {
            $(".v_konsumen, .v_ppn").show();
        } else if (report == "laporan_history_order") {
            $(".v_konsumen, .v_ppn").show();
        } else if (report == "laporan_marketing") {
            $(".v_marketing, .v_agent").show();
        } else if (report == "laporan_odometer") {
            $(".v_vehicle").show();
        } else if (report == "laporan_odometer") {
            $(".v_konsumen").show();
        } else if (report == "laporan_pemakaian_bbm") {
            $(".v_search, .v_spbu").show();
        } else if (report == "laporan_overdue") {
            $(".v_filter").hide();
            $(".v_konsumen").show();// tambahan -- agil 23-01-2024
        } else if (report == "laporan_pph23"){
            $(".v_konsumen").show();
        } else if(report == "laporan_piutang"){
            // $(".v_konsumen").show();// tambahan -- agil 23-01-2024 gajadi
        }
        if (report == "laporan_outstanding_order"
            || report == "laporan_hasil_survey"
            || report == "laporan_outstanding_invoice"
            || report == "laporan_kartu_piutang"
            || report == "laporan_uang_jalan"
            || report == "laporan_crane"
            || report == "laporan_bad_debt"
            || report == "laporan_kontrak"
            || report == "laporan_mobil"
            || report == "laporan_kartu_spk"
            || report == "laporan_history_order"
            || report == "laporan_invoice"
            || report == "laporan_pembayaran"
            || report == "laporan_piutang"
            || report == "laporan_jurnal_kas"
            || report == "laporan_marketing"
            || report == "laporan_odometer"
            || report == "laporan_overdue"
            || report == "laporan_pemakaian_bbm"
            || report == "laporan_point"
            || report == "laporan_pph23"
            || report == "laporan_bukti_potong"
            || report == "laporan_rekap_stp_jmto"
            || report == "laporan_rekap_stp"
            || report == "laporan_pengguna_jasa"
            || report == "matrix_golongan"
            || report == "laporan_absen_stp"
            || report == "laporan_stnk"
        ) {
            report_type = 'table';
            load_report_table();
        } else if (report == "lap_grafik_pegawai") {
            report_type = 'grafik';
            $(".div-loader").hide();
            $("#div-report").load("report/grafik/" + report, {
                Group: Group
            }, function () {
                search_data();
                $(".div-loader").hide();
            });
        } else {
            report_type = 'json';
            $(".div-loader").hide();
            $("#div-report").load("report/table/" + report, {
                Group: Group
            }, function () {
                search_data();
                $(".div-loader").hide();
            });
        }
    }
}
function search_data() {
    if (report_type == 'table') {
        load_report_table();
    } else {
        if (report == "none") {
            swal("info", "please select report");
        } else {
            if (report_type == 'json') {
                filter_table();
            } else if (report_type == 'grafik') {
                filter_grafik();
            } else {
                swal("info", "please select report");

            }
        }
    }
}
function load_report_table() {
    report = $("[name=Report]").val();
    start_date = $("[name=StartDate]").val();
    end_date = $("[name=EndDate]").val();
    year = $("[name=Year]").val();
    search = $("[name=Search]").val();
    bulan = $("[name=Bulan]").val();
    VendorID = $("[name=VendorID]").val();
    TypeSTP = $("[name=TypeSTP]").val(); // 14/03/23 putra
    PegawaiID = $("[name=PegawaiID]").val(); // 14/03/23 putra
    Supir1ID = $("[name=Supir1ID]").val();
    Supir2ID = $("[name=Supir2ID]").val();
    MarketingID = $("[name=MarketingID]").val();
    AgentID = $("[name=AgentID]").val();
    VehicleID = $("[name=VehicleID]").val();
    PPN = $("[name=PPN]").val();
    Status = $("input[name='Status[]']").map(function () {
        if ($(this).is(":checked")) {
            return $(this).val();
        }
    }).get();
    Search = $("[name=Search]").val();
    SearchSPBU = $("[name=SearchSPBU]").val();
    data_post = {
        cetak: "load",
        Report: report,
        StartDate: start_date,
        EndDate: end_date,
        Year: year,
        Status: Status,
        VendorID: VendorID,
        PegawaiID: PegawaiID,
        TypeSTP: TypeSTP,
        Supir1ID: Supir1ID,
        Supir2ID: Supir2ID,
        MarketingID: MarketingID,
        AgentID: AgentID,
        VehicleID: VehicleID,
        PPN: PPN,
        Search: Search,
        SearchSPBU: SearchSPBU,
    }
    console.log(data_post);
    $(".div-loader").show();
    table_report = true;
    $("#div-report").load("report/table/" + report, data_post, function (status) {
        if (status == "error") {
            var errorMessage = "Error: " + xhr.status + " " + xhr.statusText;
            console.log(errorMessage);
        }
        $(".div-loader").hide();
    });
}
function filter_grafik() {
    report = $("[name=Report]").val();
    start_date = $("[name=StartDate]").val();
    end_date = $("[name=EndDate]").val();
    search = $("[name=Search]").val();
    bulan = $("[name=Bulan]").val();
    WorkStatusID = $("[name=WorkStatusID]").val();
    TransactionListID = $("[name=TransactionListID]").val();
    UserID = $("[name=UserID]").val();
    Plate = $(".Plate").val();
    Status = $("[name=Status]").val();
    Group = $("[name=Group]").val();

    // if(TransactionListID == 'none'){
    //     swal("Info","Nama proyek tidak boleh kosong","");
    //     return;
    // }
    // if(UserID == 'none'){
    //     swal("Info","Nama pegawai tidak boleh kosong","");
    //     return;
    // }


    data_post = {
        cetak: "load",
        Report: report,
        StartDate: start_date,
        EndDate: end_date,
        TransactionListID: TransactionListID,
        UserID: UserID,
        WorkStatusID: WorkStatusID,
        Plate: Plate,
        Status: Status,
        Group: Group,
    }
    $.ajax({
        url: 'report/datagrafik/' + report,
        data: data_post,
        type: "POST",
        dataType: "JSON",
        success: function (json) {
            console.log(json);
            $(".btn-cetak").hide();
            if (json.btn_cetak) {
                btn = json.btn_cetak;
                if (btn.Cetak == 1) {
                    $(".btn-print").show();
                }
                if (btn.Pdf == 1) {
                    $(".btn-pdf").show();
                }
                if (btn.Excell == 1) {
                    $(".btn-excell").show();
                }
            }


            grafik_pegawai(json.GrafikData);



        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}
function filter_table() {

    report = $("[name=Report]").val();
    start_date = $("[name=StartDate]").val();
    end_date = $("[name=EndDate]").val();
    search = $("[name=Search]").val();
    bulan = $("[name=Bulan]").val();
    VendorID = $("[name=VendorID]").val();
    OperatorID = $("[name=OperatorID]").val();
    RiggerID = $("[name=RiggerID]").val();
    MarketingID = $("[name=MarketingID]").val();
    AgentID = $("[name=AgentID]").val();
    Status = $("input[name='Status[]']").map(function () {
        if ($(this).is(":checked")) {
            return $(this).val();
        }
    }).get();
    Search = $("[name=Search]").val();
    data_post = {
        cetak: "load",
        Report: report,
        StartDate: start_date,
        EndDate: end_date,
        Status: Status,
        VendorID: VendorID,
        OperatorID: OperatorID,
        RiggerID: RiggerID,
        MarketingID: MarketingID,
        AgentID: AgentID,
        Search: Search

    }
    table = $('#table-report').DataTable({
        paging: false,
        info: false,
        searching: false,
        destroy: true,
        processing: true, //Feature control the processing indicator.
        serverSide: false, //Feature control DataTables' server-side processing mode.
        // "order": [], //Initial no order.
        ajax: {
            url: "report/datatables/" + report,
            type: "POST",
            data: data_post,
            dataSrc: function (json) {
                console.log(json);
                df = json.datafoot;
                if (df) {
                    $("tfoot .Total1").text(df.Total1);
                    $("tfoot .Total2").text(df.Total2);
                    $("tfoot .Total3").text(df.Total3);
                    $("tfoot .Total4").text(df.Total4);
                }
                if (json.report == "lap_harian") {
                    df = json.datafoot;
                    $("tfoot .total1").text(df.total1);
                    $("tfoot .total2").text(df.total2);
                }
                $(".btn-cetak").hide();
                if (json.btn_cetak) {
                    console.log(json.btn_cetak);
                    btn = json.btn_cetak;
                    if (btn.Cetak == 1) {
                        $(".btn-print").show();
                    }
                    if (btn.Pdf == 1) {
                        $(".btn-pdf").show();
                    }
                    if (btn.Excell == 1) {
                        $(".btn-excell").show();
                    }

                }
                return json.data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        },
        // columnDefs: [{
        //     targets: [0], //last column
        //     orderable: false, //set not orderable
        // },],
    });
    $(".dataTables_processing").empty();
}

function reload_table() {
    if (report_type == 'table') {
        load_report_table();
    } else if (report_type == 'grafik') {

    } else {
        table.ajax.reload(null, false); //reload datatable ajax
    }
}

function cetak(data) {
    host = window.location.origin + '/';
    // console.log(data);
    method = data.method;
    status = data.cetak;
    view = data.view;
    url = "";
    report = $("[name=Report]").val();
    if (report == "none") {
        alert("please select report");
    } else {
        if (status == "print") {
            url = host + "report/cetak/" + report + "?cetak=" + status;;
        } else if (status == "pdf") {
            url = host + "report/cetak/" + report + "?cetak=" + status + "&view=" + view;
        } else {
            url = host + "report/" + report + "_excell";
        }


        if (method == "wizard_excell") {
            Query = codemirror.getValue();
            if (Query.length == 0) {
                toastr.info("Maaf query masih kosong, silakan masukan query", "Information");
                return;
            }
            url = host + "report/wizard_excell";
        }
        console.log(host);
        console.log(url);
        $('form').attr('action', url);
        // if(status == "print" || status == "excell"){
        $('form').attr('target', '_blank');
        // }
        $("#form").submit();
        Plate = $("[name=Plate]").val();
        data_post = {
            variable: "tes",
            Plate: Plate,
            Platex: Plate
        };
        console.log(data_post);
        $.post(url, data_post);

    }
}



var GrafikPegawai = null;
function grafik_pegawai(v) {
    labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September"];
    labels = v.labels;
    data = v.data;
    min = v.min;
    max = v.max;
    stepsize = v.stepsize;
    datasets = [];
    DataMarketing = v.list_data;
    $.each(DataMarketing, function (i, val) {
        color = getRandomColor();
        color = val.Color;
        item = {
            label: val.Name,
            fill: false,
            lineTension: 0.1,
            backgroundColor: color,
            borderColor: color,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: color,
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: color,
            pointHoverBorderColor: color,
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 10,
            data: val.data
        }
        datasets.push(item);
    });

    var ctx = document.getElementById("GrafikCanvas");
    if (GrafikPegawai != null) {
        GrafikPegawai.destroy();
    }
    GrafikPegawai = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        max: max,
                        min: min,
                        stepSize: stepsize
                    }
                }]
            }
        }
    });
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var codemirror;
$(document).ready(function () {
    if ($("textarea").hasClass("codemirror")) {
        var mime = 'text/x-mariadb';
        // get mime type
        if (window.location.href.indexOf('mime=') > -1) {
            mime = window.location.href.substr(window.location.href.indexOf('mime=') + 5);
        }
        codemirror = CodeMirror.fromTextArea(document.getElementById('code'), {
            mode: mime,
            indentWithTabs: true,
            smartIndent: true,
            lineNumbers: true,
            matchBrackets: true,
            autofocus: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            hintOptions: {
                tables: {
                    users: ["name", "score", "birthDate"],
                    countries: ["name", "population", "size"]
                }
            }
        });
    }
});

function run_query(element) {
    btn_saving(element);
    $(".item-alert").hide();
    $('.help-block').empty();
    $(".error-message").text("");
    dt = $(element).data();
    method = dt.method;
    QueryID = $("[name=QueryID]").val();
    QueryName = dt.name;
    Query = codemirror.getValue();
    if (method == "save") {
        url = host + 'report/wizard_query_save/';
    } else {
        url = host + 'report/wizard_query/';
    }
    data_post = {
        QueryID: QueryID,
        QueryName: QueryName,
        Query: Query,
    }
    if (method == "reset") {
        $('.help-block, #table-query-run thead, #table-query-run tbody').empty();
        $("[name=QueryID]").val("");
        $("[name=QueryName]").val("");
        $("#QueryNameTxt, .TotalRow").text("");
        codemirror.setValue("");
        codemirror.clearHistory();
        btn_saving(element, 'reset');
        return;
    }
    if (Query.length == 0) {
        toastr.info("Maaf query masih kosong, silakan masukan query", "Information");
        btn_saving(element, 'reset');
        return;
    }
    $.ajax({
        url: url,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            console.log(json.Query);
            if (json.Status) {
                if (method == "run") {
                    $('.help-block, #table-query-run thead, #table-query-run tbody').empty();
                    $(".TotalRow").text("Jumlah data yang ditampilkan : " + json.TotalData);
                    if (json.Data.length > 0) {
                        thead = '';
                        tbody = '';
                        // thead-----------------------------------------------------------
                        thead = '<tr>';
                        thead += '<th style="background: #777777;">No</th>';
                        $.each(json.Data[0], function (i, v) {
                            thead += '<th style="background: #777777;">' + i + '</th>';
                        });
                        thead += '</tr>';
                        $("#table-query-run thead").append(thead);
                        //tbody------------------------------------------------------------
                        $.each(json.Data, function (i, v) {
                            tbody = '<tr>';
                            tbody += '<td>' + (i + 1) + '</td>';
                            $.each(json.Data[i], function (ii, vv) {
                                tbody += '<td>' + vv + '</td>';
                            });
                            tbody += '</tr>';
                            $("#table-query-run tbody").append(tbody);
                        });
                    } else {
                        $(".error-message").text("data kosong");
                    }
                } else if (method == "save") {
                    $("[name=QueryID]").val(json.QueryID);
                    $("[name=QueryName]").val(json.QueryName);
                    $("#QueryNameTxt").text(json.QueryName);
                    toastr.success("Query berhasil disimpan", "Information");
                }
            } else {
                $(".error-message").text(json.Message);
            }
            btn_saving(element, 'reset');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            btn_saving(element, 'reset');
            // toastr.error("Terjadi kesalahan gagal menyimpan data","Information");
        }
    });
}
function save_query(element) {
    // btn_saving(element);
    QueryName = $("[name=QueryName]").val();
    Query = codemirror.getValue();
    if (Query.length == 0) {
        toastr.info("Maaf query masih kosong, silakan masukan query", "Information");
        btn_saving(element, 'reset');
        return;
    }
    htmltext = "<label>Nama Query</label><textarea class='form-control' id='QueryName' style='margin-top:20px;' placeholder='Masukan nama query'>" + QueryName + "</textarea>";
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
        var remark = $('#QueryName').val();
        if (remark === "") {
            swal.showInputError("Nama Query tidak boleh kosong");
            return false
        } else {
            run_query('<span data-method="save" data-name="' + remark + '"></span>')
            swal.close();
            // btn_saving(element, 'reset');
        }
    });
}