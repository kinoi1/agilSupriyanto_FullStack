var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + "/";
var url = window.location.href;
var url_list = host + "dashboard/point_pegawai/";
var url_agen = host + "dashboard/point_agen/";
var url_total_terima_order = host + "dashboard/HitungReceiveOrder/";
var numberWeek = 0;
var Tahun;
var PageModule;
$(document).ready(function () {
    dt = $(".data-div").data();

    if (dt.pagemodule == "dashboard") {
        get_data_filter();
        $(".portlet-widgets .ion-refresh").click(function () {
            get_data_filter();
        });
    }
    $("[name=SearchVehicleHistory]").on("keydown", function (e) {
        if (e.keyCode === 13) {
            el = $("#SearchVehicleHistory");
            SearchVehicleHistory(el);
        }
    });
    // Baru ditambahkan 18/2/2021
    point();
    
    HitungTerimaOrder();



    var options = {
        series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
      }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
      }, {
        name: 'Free Cash Flow',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
      }],
        chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    
    
  

      var chart = new ApexCharts(document.querySelector("#detail_transaksi"), options);
      chart.render();
      
      // Tes data kendaraan

      var options = {
        series: [
        {
          data: [
            {
              x: 'New Delhi',
              y: 218
            },
            {
              x: 'Kolkata',
              y: 149
            },
            {
              x: 'Mumbai',
              y: 184
            },
            {
              x: 'Ahmedabad',
              y: 55
            },
            {
              x: 'Bangaluru',
              y: 84
            },
            {
              x: 'Pune',
              y: 31
            },
            {
              x: 'Chennai',
              y: 70
            },
            {
              x: 'Jaipur',
              y: 30
            },
            {
              x: 'Surat',
              y: 44
            },
            {
              x: 'Hyderabad',
              y: 68
            },
            {
              x: 'Lucknow',
              y: 28
            },
            {
              x: 'Indore',
              y: 19
            },
            {
              x: 'Kanpur',
              y: 29
            }
          ]
        }
      ],
        legend: {
        show: false
      },
      chart: {
        height: 350,
        type: 'treemap'
      },
      title: {
        text: 'Basic Treemap'
      }
      };

      var chart = new ApexCharts(document.querySelector("#data_kendaraan"), options);
      chart.render();
      
      // tes top 10
      
      var options = {
        series: [44, 55, 13, 43, 22],
        chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
      };

      var chart = new ApexCharts(document.querySelector("#top10"), options);
      chart.render();

        // tes data versus
        var options = {
            series: [{
              name: "Desktops",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }],
            chart: {
            height: 350,
            type: 'line',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Product Trends by Month',
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#data_versus"), options);
          chart.render();

          // top 10 ke 2
          var options = {
            series: [{
            data: [21, 22, 10, 28, 16, 21, 13, 30]
          }],
            chart: {
            height: 350,
            type: 'bar',
            events: {
              click: function(chart, w, e) {
                // console.log(chart, w, e)
              }
            }
          },
          colors: [
        "#008FFB",
        "#00E396",
        "#FEB019",
        "#FF4560",
        "#775DD0",
        "#546E7A",
        "#26a69a",
        "#D10CE8"
      ],
          plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true,
            }
          },
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
          xaxis: {
            categories: [
              ['John', 'Doe'],
              ['Joe', 'Smith'],
              ['Jake', 'Williams'],
              'Amber',
              ['Peter', 'Brown'],
              ['Mary', 'Evans'],
              ['David', 'Wilson'],
              ['Lily', 'Roberts'], 
            ],
            labels: {
              style: {
                colors: [
                    "#008FFB",
                    "#00E396",
                    "#FEB019",
                    "#FF4560",
                    "#775DD0",
                    "#546E7A",
                    "#26a69a",
                    "#D10CE8"
                  ],
                fontSize: '12px'
              }
            }
          }
          };
  
          var chart = new ApexCharts(document.querySelector("#topkedua"), options);
          chart.render();
        
        
      
});

function HitungTerimaOrder(){

    Tahun = $(".filter-dashboard [name=PilihTahun]").find(':selected').val();
    Bulan = $(".filter-dashboard [name=PilihBulan]").find(':selected').val();
    VendorID = $(".filter-dashboard [name=PilihBranch]").find(':selected').val();

    StartDate = Tahun+'-'+Bulan+'-'+'01';
    EndDate = Tahun+'-'+Bulan+'-'+'31';
    data_post = {
        StartDate:StartDate,
        EndDate:EndDate,
        VendorID:VendorID
    }
console.log('data terima order');
console.log(data_post);
    $.ajax({
        url: url_total_terima_order,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
           console.log('berhasil coy');
           console.log(json);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}

function point() {
    //EE - 28092021
    Tahun = $(".filter-dashboard [name=PilihTahun]").find(':selected').val();
    Bulan = $(".filter-dashboard [name=PilihBulan]").find(':selected').val();
    data_post = {
        Tahun: Tahun,
        Bulan: Bulan,
    }
    let no = 0;
    let noagen = 0;
    $.ajax({
        url: url_list,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            $("#poin_pegawai tbody").empty();
            $("#poin_agen tbody").empty();
            if (json.Point.length > 0) {
                $.each(json.Point, function (i, v) {
                    no++;
                    if (v.UserPoint != "0") {
                        item = '<tr>';
                        item += '<td>' + no + '</td>';
                        item += '<td>' + v.UserName + '</td>';
                        item += '<td>' + v.UserPoint + '</td>';
                        item += '</tr>';
                        $("#poin_pegawai tbody").append(item);
                    }
                });
            } else {
                $("#poin_pegawai tbody").append('<tr><td colspan="3">Data Tidak Ada</td></tr>');
            }
            if (json.PointAgent.length > 0) {
                $.each(json.PointAgent, function (i, v) {
                    noagen++;
                    if (v.UserPoint != "0") {
                        item = '<tr>';
                        item += '<td>' + noagen + '</td>';
                        item += '<td>' + v.UserName + '</td>';
                        item += '<td>' + v.UserPoint + '</td>';
                        item += '</tr>';
                        $("#poin_agen tbody").append(item);
                    }
                });
            } else {
                $("#poin_agen tbody").append('<tr><td colspan="3">Data Tidak Ada</td></tr>');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}
function data_week(mod) {
    if (mod == "next") {
        numberWeek += 1;
    } else if (mod == "prev") {
        numberWeek -= 1;
    } else {

    }
    get_data();
}
function check_all_data() {
    get_data_filter();
    chek_last_data();
}
function get_data_filter() {
    get_data();
    point();
}
function get_data() {
    $(".div-loader").show();
    Tahun = $(".filter-dashboard [name=PilihTahun]").find(':selected').val();
    Bulan = $(".filter-dashboard [name=PilihBulan]").find(':selected').val();
    ProjectIDps = $("[name=ProjectIDps]").find(':selected').val();
    FilterProjectStatus = $("[name=FilterProjectStatus]").find(':selected').val();
    data_post = {
        Tahun: Tahun,
        Bulan: Bulan,
        ProjectIDps: ProjectIDps,
        FilterProjectStatus: FilterProjectStatus,
    }
    // console.log(data_post);
    $.ajax({
        url: host + "dashboard/data_dashboard",
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            if (json.HakAkses == "rc") {
                console.log(json);
            }
            if (json.DataTanggal) {
                $.each(json.DataTanggal, function (i, v) {
                    if (v.Data.length > 0) {
                        $("#" + v.Name + " tbody").empty();
                        $.each(v.Data, function (ii, vv) {
                            add_tanggal_row(vv);
                        });
                    } else {
                        $("#" + v.Name + " tbody").empty();
                        $("#" + v.Name + " tbody").append("<tr><td colspan='2'>Data Tidak Ada</td></tr>");
                    }
                });
            }
            // ini crane
            // if(json.TotalSurveyRequest){
            //     SetTotal("SurveyRequest",json.TotalSurveyRequest);
            // }
            // if(json.TotalReceiveOrder){
            //     SetTotal("ReceiveOrder",json.TotalReceiveOrder);
            // }
            // if(json.TotalReceiveOrderPrice){
            //     SetTotal("TotalReceiveOrder",json.TotalReceiveOrderPrice);
            // }
            // if(json.TotalPaymentPrice){
            //     SetTotal("TotalPayment",json.TotalPaymentPrice);
            // }
            // if(json.GrafikTotalOrder){
            //     SetGrafikTotalOrder(json.GrafikTotalOrder);
            // }
            // if(json.GrafikTotalPayment){
            //     SetGrafikTotalPayment(json.GrafikTotalPayment);
            // }
            // if(json.GrafikPekerjaanSPK){
            //     SetGrafikPekerjaanSPK(json.GrafikPekerjaanSPK);
            // }
            // ini rental
            if (json.GrafikEstimasiPendapatanPerusahaan) {
                SetGrafikEstimasiPendapatanPerusahaan(json.GrafikEstimasiPendapatanPerusahaan);
            }
            if (json.GrafikPendapatanPerusahaan) {
                SetGrafikPendapatanPerusahaan(json.GrafikPendapatanPerusahaan);
            }
            if (json.GrafikVehicleStatus) {
                SetGrafikVehicleStatus(json.GrafikVehicleStatus);
            }
            if (json.ListCicilan) {
                SetListCicilan(json.ListCicilan);
            }
            if (json.ListPiutang) {
                SetListPiutang(json.ListPiutang);
            }
            if (json.ListVehicleStock) {
                SetListVehicleStock(json.ListVehicleStock);
            }
            if (json.ListEstimateSelling) {
                SetListEstimateSelling(json.ListEstimateSelling);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    });
}
function SearchVehicleHistory(element) {
    $("#label-vehicle-name").text("");
    $(element).button("loading");
    SearchVal = $("[name=SearchVehicleHistory]").val();
    if (SearchVal.length >= 2) {
        data_post = {
            SearchVehicleHistory: SearchVal,
        }
        $.ajax({
            url: host + "dashboard/VehicleHistoryJSON",
            type: "POST",
            data: data_post,
            dataType: "JSON",
            success: function (json) {
                $(element).button("reset");
                if (json.Data) {
                    row = json.Data.Data;
                    $("#label-vehicle-name").text(" - " + row.VehicleName);
                    SetListVehicleHistory(json.Data.ListData);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                $(element).button("reset");
            }
        });
    } else {
        SetListVehicleHistory([])
        $(element).button("reset");
    }
}
function SetTotal(item, data) {
    iditempercentage = "#Percentage" + item;
    iditemtotal = "#SUM" + item;
    $(iditempercentage + "," + iditemtotal).empty();
    itemtotal = '<span data-plugin="counterup">' + data.TotalCurrent + '</span>';
    if (data.Status == "up") {
        itempercentage = '<i class="fa fa-caret-up text-success mr-1"></i>' + data.Percentage + '%';
    } else if (data.Status == "down") {
        itempercentage = '<i class="fa fa-caret-down text-danger mr-1"></i>' + data.Percentage + '%';
    } else {
        itempercentage = '0%';
    }

    $(iditemtotal).append(itemtotal);
    $(iditempercentage).append(itempercentage);
    // animateValue(iditemtotal);
    // animateValue(iditempercentage);

}
// function animateValue(id){
//     var obj = document.getElementById(id);
//     var current = parseInt(obj.innerHTML);
//     setInterval(function(){
//         obj.innerHTML = current++;
//     },1000);
// }
function add_tanggal_row(v) {
    classtr = "";
    if (v.Selisih < 0) {
        classtr = "tr-red";
    } else if (v.Selisih == 0) {
        classtr = "tr-yellow";
    }
    item = '<tr class="' + classtr + '">';
    item += '<td>' + v.Name + '</td>';
    item += '<td>' + v.Date + '</td>';
    item += '</tr>';
    $("#" + v.Type + " tbody").append(item);
}


var GrafikPendapatanPerusahaan = null;
function SetGrafikPendapatanPerusahaan(v) {
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    color = materialColor();

    datasets = [];
    ListData = v.ListData;
    $.each(ListData, function (i, val) {
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
            data: val.Data
        }
        datasets.push(item);
    });


    var ctx = document.getElementById("GrafikPendapatanPerusahaan");
    //console.log(ctx);
    //console.log(ctx.height);
    ctx.height = 340;
    // ctx.width = 350;
    if (GrafikPendapatanPerusahaan != null ) {
        GrafikPendapatanPerusahaan.destroy();
    }
    GrafikPendapatanPerusahaan = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Bulan '
                    },
                }],
                yAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                                return value;
                            }
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Jumlah (Rp)'
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    // title: function (tooltipItem, data) { return 'Minggu ke ' + data.labels[tooltipItem[0].index]; },
                    label: function (t, d) {
                        var xLabel = d.datasets[t.datasetIndex].label;
                        var yLabel = t.yLabel >= 1000 ? t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : t.yLabel;
                        return xLabel + ': ' + yLabel;
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            }
        }
    });
}

var GrafikEstimasiPendapatanPerusahaan = null;
function SetGrafikEstimasiPendapatanPerusahaan(v) {
    console.log(v);
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    color = materialColor();

    datasets = [];
    ListData = v.ListData;
    $.each(ListData, function (i, val) {
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
            stack: 'Stack ' + i,
            data: val.Data
        }
        datasets.push(item);
    });


    var ctx = document.getElementById("GrafikEstimasiPendapatanPerusahaan");
    ctx.height = 340;
    // ctx.width = 340;
    if (GrafikEstimasiPendapatanPerusahaan != null) {
        // ctx.height = 340;
        GrafikEstimasiPendapatanPerusahaan.destroy();
    }
    GrafikEstimasiPendapatanPerusahaan = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Bulan '
                    },
                }],
                yAxes: [{
                    stacked: false,
                    scaleLabel: {
                        display: true,
                        labelString: 'Jumlah (Rp)'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000 || parseInt(value) <= -1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                                return value;
                            }
                        }
                    },
                }]
            },
            tooltips: {
                callbacks: {
                    // title: function (tooltipItem, data) { return 'Minggu ke ' + data.labels[tooltipItem[0].index]; },
                    label: function (t, d) {
                        var xLabel = d.datasets[t.datasetIndex].label;
                        var yLabel = t.yLabel >= 1000 || t.yLabel <= -1000 ? t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : t.yLabel;
                        return xLabel + ': ' + yLabel;
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            }
        }
    });
}

var GrafikTotalOrder = null;
function SetGrafikTotalOrder(v) {
    $("#TotalOrderPrice").text(v.TotalOrderPrice);
    $("#TotalOrder").text(v.TotalOrder);
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    color = materialColor();
    var ctx = document.getElementById("GrafikTotalOrder");
    ctx.height = 350;
    if (GrafikTotalOrder != null) {
        GrafikTotalOrder.destroy();
    }
    // 'rgba(255,99,132,1)',
    // 'rgba(54, 162, 235, 1)',
    // 'rgba(255, 206, 86, 1)',
    // 'rgba(75, 192, 192, 1)',
    // 'rgba(153, 102, 255, 1)',
    // 'rgba(255, 159, 64, 1)'
    // fill: false,
    // lineTension: 0.1,
    // backgroundColor: color,
    // borderColor: color,
    // borderCapStyle: 'butt',
    // borderDash: [],
    // borderDashOffset: 0.0,
    // borderJoinStyle: 'miter',
    // pointBorderColor: color,
    // pointBackgroundColor: "#fff",
    // pointBorderWidth: 1,
    // pointHoverRadius: 5,
    // pointHoverBackgroundColor: color,
    // pointHoverBorderColor: color,
    // pointHoverBorderWidth: 2,
    // pointRadius: 1,
    // pointHitRadius: 10,
    // data: data
    GrafikTotalOrder = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Order",
                fill: false,
                // backgroundColor: 'rgba(54, 162, 235, 0.2)',
                // borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: color,
                hoverBackgroundColor: color,
                borderWidth: 1,
                data: data
            }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: true,
                        maxRotation: 0,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                                return value;
                            }
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Jumlah (Rp) '
                    },
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Minggu ke '
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) { return 'Minggu ke ' + data.labels[tooltipItem[0].index]; },
                    label: function (t, d) {
                        var xLabel = d.datasets[t.datasetIndex].label;
                        var yLabel = t.xLabel >= 1000 ? t.xLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : t.xLabel;
                        return xLabel + ': ' + yLabel;
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            }
        }
    });
}

var GrafikTotalPayment = null;
function SetGrafikTotalPayment(v) {
    $("#TotalPaymentPrice").text(v.TotalPaymentPrice);
    $("#TotalPayment").text(v.TotalPayment);
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    color = materialColor();
    var ctx = document.getElementById("GrafikTotalPayment");
    ctx.height = 350;
    if (GrafikTotalPayment != null) {
        GrafikTotalPayment.destroy();
    }
    // backgroundColor = [];
    // hoverBackgroundColor = [];
    // $.each(data,function(i,v){
    //     color = materialColor();
    //     backgroundColor.push(color);
    //     hoverBackgroundColor.push(color);
    // });
    GrafikTotalPayment = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Pembayaran",
                fill: false,
                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                // borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: color,
                hoverBackgroundColor: color,
                borderWidth: 1,
                data: data
            }
            ]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Minggu ke '
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Jumlah (Rp) '
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                                return value;
                            }
                        }
                    }
                }],
            },
            tooltips: {
                callbacks: {
                    title: function (tooltipItem, data) { return 'Minggu ke ' + data.labels[tooltipItem[0].index]; },
                    label: function (t, d) {
                        var xLabel = d.datasets[t.datasetIndex].label;
                        var yLabel = t.yLabel >= 1000 ? t.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '$' + t.yLabel;
                        return xLabel + ': ' + yLabel;
                    }
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            }
        },
    });
}
var GrafikPekerjaanSPK = null;
function SetGrafikPekerjaanSPK(v) {
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    // color    = getRandomColor();
    var ctx = document.getElementById("GrafikPekerjaanSPK");
    ctx.height = 350;
    if (GrafikPekerjaanSPK != null) {
        GrafikPekerjaanSPK.destroy();
    }

    backgroundColor = [];
    hoverBackgroundColor = [];
    // $.each(data,function(i,v){
    //     color = materialColor();
    //     backgroundColor.push(color);
    //     hoverBackgroundColor.push(color);
    // });

    GrafikPekerjaanSPK = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Pembayaran",
                fill: false,
                backgroundColor: [
                    "#F7464A",
                    "#46BFBD",
                    "#FDB45C",
                    "#949FB1",
                    "#4D5360",
                ],
                borderWidth: 1,
                data: data
            }
            ]
        },
        options: {
            showAllTooltips: true,
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            },
            plugins: {
                labels: {
                    render: 'label'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        labelx = data.labels[tooltipItem.index];
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return labelx + " : " + percentage + "%";
                    }
                }
            }
        }
    });
}
var GrafikVehicleStatus = null;
function SetGrafikVehicleStatus(v) {
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    // color    = getRandomColor();
    var ctx = document.getElementById("GrafikVehicleStatus");
    ctx.height = 350;
    if (GrafikVehicleStatus != null) {
        GrafikVehicleStatus.destroy();
    }

    backgroundColor = [];
    hoverBackgroundColor = [];
    // $.each(data,function(i,v){
    //     color = materialColor();
    //     backgroundColor.push(color);
    //     hoverBackgroundColor.push(color);
    // });

    GrafikVehicleStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Pembayaran",
                fill: false,
                backgroundColor: [
                    "#F7464A",
                    "#46BFBD",
                    "#FDB45C",
                    "#949FB1",
                    "#4D5360",
                ],
                borderWidth: 1,
                data: data
            }
            ]
        },
        options: {
            showAllTooltips: true,
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            },
            plugins: {
                labels: {
                    render: 'label'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        labelx = data.labels[tooltipItem.index];
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return labelx + " : " + percentage + "%";
                    }
                }
            }
        }
    });
    ctx.onclick = function (evt) {
        var activePoints = GrafikVehicleStatus.getElementsAtEvent(evt);
        if (activePoints[0]) {
            var chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];
            var label = chartData.labels[idx];
            var value = chartData.datasets[0].data[idx];
            // var url = "http://example.com/?label=" + label + "&value=" + value;
            GetGrafikVehicleStatusDetail('<span data-status="' + v.Data2[label] + '"></span>');
        }
    };
}
function GetGrafikVehicleStatusDetail(element) {
    // $(".GrafikVehicleStatusDetail-div").hide(500);

    dt = $(element).data();
    Status = dt.status;
    $.ajax({
        url: host + "dashboard/GrafikVehicleStatusDetailJson/" + Status,
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (json) {
            $(element).button("reset");
            if (json.Data) {
                row = json.Data.Data;
                $(".GrafikVehicleStatusDetail-div").show(500);
                $("#GrafikVehicleStatusDetail-label").text(json.Data.LabelGrafik);
                SetGrafikVehicleStatusDetail(json.Data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            $(element).button("reset");
        }
    });
}
var GrafikVehicleStatusDetail = null;
function SetGrafikVehicleStatusDetail(v) {
    LabelGrafik = v.LabelGrafik;
    labels = v.Label;
    data = v.Data;
    min = v.Max;
    max = v.Min;
    stepsize = v.StepSize;
    // color    = getRandomColor();
    var ctx = document.getElementById("GrafikVehicleStatusDetail");
    ctx.height = 350;
    if (GrafikVehicleStatusDetail != null) {
        GrafikVehicleStatusDetail.destroy();
    }
    backgroundColor = [];
    hoverBackgroundColor = [];
    $.each(data, function (i, v) {
        color = materialColor();
        backgroundColor.push(color);
        hoverBackgroundColor.push(color);
    });
    GrafikVehicleStatusDetail = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: "Total Pembayaran",
                fill: false,
                backgroundColor: backgroundColor,
                borderWidth: 1,
                data: data
            }
            ]
        },
        options: {
            showAllTooltips: true,
            responsive: false,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: LabelGrafik,
            },
            legend: {
                position: 'bottom',
                labels: {
                    // fontColor: "white",
                    boxWidth: 20,
                    padding: 20,
                    usePointStyle: false
                }
            },
            plugins: {
                labels: {
                    render: 'label'
                }
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        labelx = data.labels[tooltipItem.index];
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
                        return labelx + " : " + percentage + "%";
                    }
                }
            }
        }
    });
}
function SetListPiutang(ListData) {
    $("#table-piutang tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            classtr = "";
            classtd = "";
            if (v.TOP < -15) {
                classtd = "td-dark-red";
            } else if (v.TOP < 0 && v.TOP >= -15) {
                classtd = "td-red";
            } else if (v.TOP > 0 && v.TOP <= 15) {
                classtd = "td-blue";
            } else if (v.TOP > 15) {
                classtd = "td-dark-blue";
            }

            // item = '<tr class="'+classtr+'">';
            item = '<tr>';
            item += '<td>' + v.VendorName + '</td>';
            item += '<td>' + v.Code + '</td>';
            item += '<td class="text-right ' + classtd + '">' + v.TotalPrice + '</td>';
            item += '<td style="text-align:center;" class="' + classtd + '">' + v.TOP + '</td>';
            item += '</tr>';
            $("#table-piutang tbody").append(item);
        });
    } else {
        $("#table-piutang tbody").append('<tr><td colspan="4">Data Tidak Ada</td></tr>');
    }
}
function SetListCicilan(ListData) {
    $("#table-cicilan tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            classtr = "";
            classtd = "";
            if (v.TOP < -15) {
                classtd = "tr-dark-red";
            } else if (v.TOP < 0 && v.TOP >= -15) {
                classtd = "tr-red";
            } else if (v.TOP > 0 && v.TOP <= 15) {
                classtd = "tr-blue";
            } else if (v.TOP > 15) {
                classtd = "tr-dark-blue";
            }
            item = '<tr class="' + classtd + '">';
            item += '<td>' + v.ContractCode + '</td>';
            item += '<td>' + v.VendorName + '</td>';
            item += '<td>' + v.VehicleName + '</td>';
            item += '<td>' + v.Date + '</td>';
            item += '<td>' + v.Sort + '</td>';
            item += '<td class="text-right">' + v.TotalPrice + '</td>';
            item += '</tr>';
            $("#table-cicilan tbody").append(item);
        });
    } else {
        $("#table-cicilan tbody").append('<tr><td colspan="4">Data Tidak Ada</td></tr>');
    }
}
function SetListVehicleHistory(ListData) {
    $("#table-riwayat-mobil tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            item = '<tr>';
            $.each(v, function (ii, vv) {
                item += '<td>' + vv + '</td>';
            });
            item += '</tr>';
            $("#table-riwayat-mobil tbody").append(item);
        });
    } else {
        $("#table-riwayat-mobil tbody").append('<tr><td colspan="3">Data Tidak Ada</td></tr>');
    }
}
function SetListVehicleStock(ListData) {
    $("#table-vehicle-stock tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            item = '<tr>';
            $.each(v, function (ii, vv) {
                item += '<td>' + vv + '</td>';
            });
            item += '</tr>';
            $("#table-vehicle-stock tbody").append(item);
        });
    } else {
        $("#table-vehicle-stock tbody").append('<tr><td colspan="5">Data Tidak Ada</td></tr>');
    }
}
function SetListEstimateSelling(ListData) {
    $("#table-estimate-selling tbody").empty();
    if (ListData.length > 0) {
        $.each(ListData, function (i, v) {
            item = '<tr>';
            $.each(v, function (ii, vv) {
                item += '<td>' + vv + '</td>';
            });
            item += '</tr>';
            $("#table-estimate-selling tbody").append(item);
        });
    } else {
        $("#table-estimate-selling tbody").append('<tr><td colspan="5">Data Tidak Ada</td></tr>');
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
            result = prop;
    return result;
}

function materialColor() {
    // colors from https://github.com/egoist/color-lib/blob/master/color.json
    var colors = {
        "red": {
            "50": "#ffebee",
            "100": "#ffcdd2",
            "200": "#ef9a9a",
            "300": "#e57373",
            "400": "#ef5350",
            "500": "#f44336",
            "600": "#e53935",
            "700": "#d32f2f",
            "800": "#c62828",
            "900": "#b71c1c",
            // "hex": "#f44336",
            // "a100": "#ff8a80",
            // "a200": "#ff5252",
            // "a400": "#ff1744",
            // "a700": "#d50000"
        },
        "pink": {
            "50": "#fce4ec",
            "100": "#f8bbd0",
            "200": "#f48fb1",
            "300": "#f06292",
            "400": "#ec407a",
            "500": "#e91e63",
            "600": "#d81b60",
            "700": "#c2185b",
            "800": "#ad1457",
            "900": "#880e4f",
            // "hex": "#e91e63",
            // "a100": "#ff80ab",
            // "a200": "#ff4081",
            // "a400": "#f50057",
            // "a700": "#c51162"
        },
        "purple": {
            "50": "#f3e5f5",
            "100": "#e1bee7",
            "200": "#ce93d8",
            "300": "#ba68c8",
            "400": "#ab47bc",
            "500": "#9c27b0",
            "600": "#8e24aa",
            "700": "#7b1fa2",
            "800": "#6a1b9a",
            "900": "#4a148c",
            // "hex": "#9c27b0",
            // "a100": "#ea80fc",
            // "a200": "#e040fb",
            // "a400": "#d500f9",
            // "a700": "#aa00ff"
        },
        "deepPurple": {
            "50": "#ede7f6",
            "100": "#d1c4e9",
            "200": "#b39ddb",
            "300": "#9575cd",
            "400": "#7e57c2",
            "500": "#673ab7",
            "600": "#5e35b1",
            "700": "#512da8",
            "800": "#4527a0",
            "900": "#311b92",
            // "hex": "#673ab7",
            // "a100": "#b388ff",
            // "a200": "#7c4dff",
            // "a400": "#651fff",
            // "a700": "#6200ea"
        },
        "indigo": {
            "50": "#e8eaf6",
            "100": "#c5cae9",
            "200": "#9fa8da",
            "300": "#7986cb",
            "400": "#5c6bc0",
            "500": "#3f51b5",
            "600": "#3949ab",
            "700": "#303f9f",
            "800": "#283593",
            "900": "#1a237e",
            // "hex": "#3f51b5",
            // "a100": "#8c9eff",
            // "a200": "#536dfe",
            // "a400": "#3d5afe",
            // "a700": "#304ffe"
        },
        "blue": {
            "50": "#e3f2fd",
            "100": "#bbdefb",
            "200": "#90caf9",
            "300": "#64b5f6",
            "400": "#42a5f5",
            "500": "#2196f3",
            "600": "#1e88e5",
            "700": "#1976d2",
            "800": "#1565c0",
            "900": "#0d47a1",
            // "hex": "#2196f3",
            // "a100": "#82b1ff",
            // "a200": "#448aff",
            // "a400": "#2979ff",
            // "a700": "#2962ff"
        },
        "lightBlue": {
            "50": "#e1f5fe",
            "100": "#b3e5fc",
            "200": "#81d4fa",
            "300": "#4fc3f7",
            "400": "#29b6f6",
            "500": "#03a9f4",
            "600": "#039be5",
            "700": "#0288d1",
            "800": "#0277bd",
            "900": "#01579b",
            // "hex": "#03a9f4",
            // "a100": "#80d8ff",
            // "a200": "#40c4ff",
            // "a400": "#00b0ff",
            // "a700": "#0091ea"
        },
        "cyan": {
            "50": "#e0f7fa",
            "100": "#b2ebf2",
            "200": "#80deea",
            "300": "#4dd0e1",
            "400": "#26c6da",
            "500": "#00bcd4",
            "600": "#00acc1",
            "700": "#0097a7",
            "800": "#00838f",
            "900": "#006064",
            // "hex": "#00bcd4",
            // "a100": "#84ffff",
            // "a200": "#18ffff",
            // "a400": "#00e5ff",
            // "a700": "#00b8d4"
        },
        "teal": {
            "50": "#e0f2f1",
            "100": "#b2dfdb",
            "200": "#80cbc4",
            "300": "#4db6ac",
            "400": "#26a69a",
            "500": "#009688",
            "600": "#00897b",
            "700": "#00796b",
            "800": "#00695c",
            "900": "#004d40",
            // "hex": "#009688",
            // "a100": "#a7ffeb",
            // "a200": "#64ffda",
            // "a400": "#1de9b6",
            // "a700": "#00bfa5"
        },
        "green": {
            "50": "#e8f5e9",
            "100": "#c8e6c9",
            "200": "#a5d6a7",
            "300": "#81c784",
            "400": "#66bb6a",
            "500": "#4caf50",
            "600": "#43a047",
            "700": "#388e3c",
            "800": "#2e7d32",
            "900": "#1b5e20",
            // "hex": "#4caf50",
            // "a100": "#b9f6ca",
            // "a200": "#69f0ae",
            // "a400": "#00e676",
            // "a700": "#00c853"
        },
        "lightGreen": {
            "50": "#f1f8e9",
            "100": "#dcedc8",
            "200": "#c5e1a5",
            "300": "#aed581",
            "400": "#9ccc65",
            "500": "#8bc34a",
            "600": "#7cb342",
            "700": "#689f38",
            "800": "#558b2f",
            "900": "#33691e",
            // "hex": "#8bc34a",
            // "a100": "#ccff90",
            // "a200": "#b2ff59",
            // "a400": "#76ff03",
            // "a700": "#64dd17"
        },
        "lime": {
            "50": "#f9fbe7",
            "100": "#f0f4c3",
            "200": "#e6ee9c",
            "300": "#dce775",
            "400": "#d4e157",
            "500": "#cddc39",
            "600": "#c0ca33",
            "700": "#afb42b",
            "800": "#9e9d24",
            "900": "#827717",
            // "hex": "#cddc39",
            // "a100": "#f4ff81",
            // "a200": "#eeff41",
            // "a400": "#c6ff00",
            // "a700": "#aeea00"
        },
        "yellow": {
            "50": "#fffde7",
            "100": "#fff9c4",
            "200": "#fff59d",
            "300": "#fff176",
            "400": "#ffee58",
            "500": "#ffeb3b",
            "600": "#fdd835",
            "700": "#fbc02d",
            "800": "#f9a825",
            "900": "#f57f17",
            // "hex": "#ffeb3b",
            // "a100": "#ffff8d",
            // "a200": "#ffff00",
            // "a400": "#ffea00",
            // "a700": "#ffd600"
        },
        "amber": {
            "50": "#fff8e1",
            "100": "#ffecb3",
            "200": "#ffe082",
            "300": "#ffd54f",
            "400": "#ffca28",
            "500": "#ffc107",
            "600": "#ffb300",
            "700": "#ffa000",
            "800": "#ff8f00",
            "900": "#ff6f00",
            // "hex": "#ffc107",
            // "a100": "#ffe57f",
            // "a200": "#ffd740",
            // "a400": "#ffc400",
            // "a700": "#ffab00"
        },
        "orange": {
            "50": "#fff3e0",
            "100": "#ffe0b2",
            "200": "#ffcc80",
            "300": "#ffb74d",
            "400": "#ffa726",
            "500": "#ff9800",
            "600": "#fb8c00",
            "700": "#f57c00",
            "800": "#ef6c00",
            "900": "#e65100",
            // "hex": "#ff9800",
            // "a100": "#ffd180",
            // "a200": "#ffab40",
            // "a400": "#ff9100",
            // "a700": "#ff6d00"
        },
        "deepOrange": {
            "50": "#fbe9e7",
            "100": "#ffccbc",
            "200": "#ffab91",
            "300": "#ff8a65",
            "400": "#ff7043",
            "500": "#ff5722",
            "600": "#f4511e",
            "700": "#e64a19",
            "800": "#d84315",
            "900": "#bf360c",
            // "hex": "#ff5722",
            // "a100": "#ff9e80",
            // "a200": "#ff6e40",
            // "a400": "#ff3d00",
            // "a700": "#dd2c00"
        },
        // "brown": {
        //   "50": "#efebe9",
        //   "100": "#d7ccc8",
        //   "200": "#bcaaa4",
        //   "300": "#a1887f",
        //   "400": "#8d6e63",
        //   "500": "#795548",
        //   "600": "#6d4c41",
        //   "700": "#5d4037",
        //   "800": "#4e342e",
        //   "900": "#3e2723",
        //   "hex": "#795548"
        // },
        // "grey": {
        //   "50": "#fafafa",
        //   "100": "#f5f5f5",
        //   "200": "#eeeeee",
        //   "300": "#e0e0e0",
        //   "400": "#bdbdbd",
        //   "500": "#9e9e9e",
        //   "600": "#757575",
        //   "700": "#616161",
        //   "800": "#424242",
        //   "900": "#212121",
        //   "hex": "#9e9e9e"
        // },
        // "blueGrey": {
        //   "50": "#eceff1",
        //   "100": "#cfd8dc",
        //   "200": "#b0bec5",
        //   "300": "#90a4ae",
        //   "400": "#78909c",
        //   "500": "#607d8b",
        //   "600": "#546e7a",
        //   "700": "#455a64",
        //   "800": "#37474f",
        //   "900": "#263238",
        //   "hex": "#607d8b"
        // },
        // "black": {
        //   "hex": "#000000"
        // },
        // "white": {
        //   "hex": "#ffffff"
        // }
    }
    // pick random property
    //var property = pickRandomProperty(colors);
    var colorList = colors[pickRandomProperty(colors)];
    var newColorKey = pickRandomProperty(colorList);
    var newColor = colorList[newColorKey];
    return newColor;
}

function set_session_branch() {
    CompanyID = $(".filter-dashboard [name=PilihBranch]").find(':selected').val();
    data_post = {
        CompanyID: CompanyID,
    };
    $.ajax({
        url: host + "dashboard/PilihBranch",
        type: "POST",
        data: data_post,
        dataType: "JSON",
        success: function (data) {
            if (data.status) {
                // toastr.success("Berhasil memilih Cabang","Information");
                location.reload();
            } else {
                // toastr.error("Gagal memilih cabang","Information");
                location.reload();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // toastr.error("Gagal memilih cabang","Information");
            location.reload();
        }
    });
}