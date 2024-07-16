var mobile = (/iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
var host = window.location.origin + '/';
var url = window.location.href;
var map;
var markers = [];
var lat;
var lng;
var zoom;
var geocoder;
var cityCircle;
var flightPath;
var directionsService;
var directionsDisplay;
var myCenter = new google.maps.LatLng(20, -10);
var marker = new google.maps.Marker({
  position: myCenter
});
var zoom = 2;
var statusmap;
var menuid;
var LimitCounter = 31;
var modul;
var transactioncode;
var current_url = url;
$(document).ready(function () {

});
$(window).load(function () {
  page_data = $(".page-data").data();
  app = page_data.app;
  currentdate = page_data.currentdate;
  startdate = page_data.startdate;
  menuid = page_data.menuid;
  modul = page_data.modul;
  dx = $(".page-datax").data();
  if (dx) {
    modul = dx.modul;
    transactioncode = dx.transactioncode;
    console.log(modul);
  }
  $("[name=StartDate]").val(startdate);
  $("[name=EndDate]").val(currentdate);
  load_data('basic');
  if (modul == "gps_monitoring") {
    table_data();
  }
});
function periode_change() {
  Periode = $('#form-filter [name=Periode]').find(':selected').val();
  if (Periode == "custom") {
    $("#form-filter .v_date").show(300);
  } else {
    $("#form-filter .v_date").hide(300);
  }
}
var Hitung = 0;
function chek_last_data_interval() {
  hitung();
  nomor = LimitCounter;
  LimitInterval = (LimitCounter * 10000);
  setInterval(function () {
    nomor -= 1;
    if (nomor == 0) {
      nomor = LimitCounter;
    }
    load_data('map');
  }, LimitInterval);
  function hitung() {
    if (Hitung == 0) {
      Hitung = 1;
      var countx = LimitCounter,
        timer = setInterval(function () {
          $("#btn-check-auto #count-auto").text((countx--) - 1);
          $("#btn-check-auto").attr("disabled", true);
          if (countx == 0) {
            countx = LimitCounter;
            $("#btn-check-auto #count-auto").text("");
            $("#btn-check-auto").attr("disabled", false);
          }
        }, 1000);
    }
  }
}
function chek_last_data() {
  load_data('map');
  var count = LimitCounter,
    timer = setInterval(function () {
      $("#btn-check #count").text((count--) - 1);
      $("#btn-check").attr("disabled", true);
      if (count == 0) {
        clearInterval(timer);
        $("#btn-check #count").text("");
        $("#btn-check").attr("disabled", false);
      }
    }, 1000);
}
var CountLoadData = 0;
function load_data(page) {
  if (modul == "tracking-order" || page == "gps-monitoring-tracking-order") {
    url_post = host + "api_gps/TrackingOrder/" + transactioncode;
  } else {
    url_post = host + "api_gps/GetData";
  }
  data_post = {
    page: page,
    modul: modul,
    current_url: current_url,
    FilterMarker: $("[name=FilterMarker]").val(),
    Periode: $("[name=Periode]").find(':selected').val(),
    CraneID: $("[name=CraneID]").find(':selected').val(),
    StartDate: $("[name=StartDate]").val(),
    EndDate: $("[name=EndDate]").val(),
  };
  console.log(data_post);
  $.ajax({
    url: url_post,
    type: "POST",
    data: data_post,
    dataType: "JSON",
    success: function (json) {
      // console.log(json);
      // console.log(json.CraneOperation);
      if (json.status) {
        if (json.CraneOperation) {
          co = json.CraneOperation;
          $("#TotalCrane").text(co.TotalCrane);
          $("#TotalStandBy").text(co.TotalStandBy);
          $("#TotalOperation").text(co.TotalOperation);
          $("#TotalMob").text(co.TotalMob);
          $("#TotalOffline").text(co.TotalOffline);
        }
        deleteMarkers();
        delete_polyline();
        delete_radius();
        reset_direction();
        if (page == "basic" && modul == "gps_monitoring") {
          if (CountLoadData == 0) {
            chek_last_data_interval();
            CountLoadData += 1;
          }
        }
        if (json.modul == "tracking-order") {
          a = json.Data;
          $("#title-span").text("Order : " + a.Code);
          $("#Code").text(a.Code);
          $("#Date").text(a.Date);
          $("#DriverName").text(a.DriverName);
          $("#VehicleNo").text(a.VehicleNo);
          $("#VehicleMerk").text(a.Merk);
          $("#VehicleModel").text(a.Model);
          $("#CustomerName").text(a.CustomerName);
          $("#CustomerTelephone").text(a.CustomerTelephone);
          $("#CustomerAddress").text(a.CustomerAddress);
          $("#DestinationAddress").text(a.DestinationAddress);
          if (a.StatusAntar == "Finish") {
            $("#StatusAntar").empty();
            $("#StatusAntar").append('<span class="label label-success">Selesai Antar</span>');
          } else {
            $("#StatusAntar").empty();
            $("#StatusAntar").append('<span class="label label-danger">Proses Antar</span>');
          }
          if (a.StatusJemput == "Finish") {
            $("#StatusJemput").empty();
            $("#StatusJemput").append('<span class="label label-success">Selesai Jemput</span>');
          } else {
            $("#StatusJemput").empty();
            $("#StatusJemput").append('<span class="label label-danger">Proses Jemput</span>');
          }

          if (a.DriverTelephone) {
            $("#WASUPIR, #TELPSUPIR").empty();
            $("#WASUPIR").append('<a href="' + a.LinkWASupir + '"><i class="fab fa-whatsapp"></i></a>');
            $("#TELPSUPIR").append('<a href="' + a.LinkPhoneSupir + '"><i class="fa fa-phone"></a>');
          }
          $("#Estimate").text(a.JarakJemput + " / " + a.DurasiJemput);
          if (a.StatusJemput == "Process") {
            $("#tr-estimasi").show();
          } else {
            $("#tr-estimasi").hide();
          }
          // if(CountLoadData == 0){
          //   resizeMap(json.Origin.Lat, json.Origin.Lng,{marker:false,radius:false});
          // }
          // directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true,map:map});
          // calculateAndDisplayRoute(directionsService, directionsDisplay,json.ListData,json.Origin,json.Destination);  
          if (json.ListData && json.ListData.length > 0) {
            add_location(json.ListData, { zoom: true });
          }
          if (a.Show == 1 && page != "gps-monitoring-tracking-order") {
            $(".div-tracking .info").remove();
            $(".div-tracking .panel").show();
          } else {
            $(".div-tracking .info").show();
            $(".div-tracking .panel").remove();
          }
          if (modul == "tracking-order" && CountLoadData == 0) {
            CountLoadData += 1;
            // load_data('map');
            resizeMap(json.Origin.Lat, json.Origin.Lng, { marker: false, radius: false });
          }
          if ($("div").hasClass("map-tracking-order")) {
            $('html,body').animate({ scrollTop: $(".map-tracking-order").offset().top - 200 }, 'slow');
          }

        } else {
          if (json.modul == "report_route") {
            set_poliline(json.ListData);
          }
          if (page == "basic") {
            if (json.ListData && json.ListData.length > 0) {
              add_location(json.ListData, { zoom: true });
            }
          } else if (page == "map") {
            if (json.ListData && json.ListData.length > 0) {
              add_location(json.ListData, { zoom: true });
            }
          }
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // alert('Error get data from ajax');
      console.log(jqXHR.responseText);
    }
  });
}
function ResendMessage(element) {
  dt = $(element).data();
  id = dt.id;
  swal({
    title: "Info",
    text: "Apa anda yakin akan menggirim ulang sms ini ?",
    // type: "warning",   
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: lang('lb_yes'),
    cancelButtonText: lang('lb_no'),
    closeOnConfirm: false,
    closeOnCancel: false
  },
    function (isConfirm) {
      if (isConfirm) {
        $.ajax({
          url: host + 'api_gps/ResendMessage/' + id,
          type: "GET",
          dataType: "JSON",
          success: function (json) {
            if (json.status) {
              swal('Info', json.Message, '');
            } else {
              swal('Info', json.Message, 'error');
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            swal("Info", "Terjadi kesalahan gagal mengirim data", "error");
            console.log(jqXHR.responseText);
          }
        });
      } else {
        swal(lang('lb_canceled'), lang('lb_canceled_data'), "error");
      }
    });
}
var table;
function table_data(modul) {
  url = host + 'gps_monitoring/list';
  data_post = {
    Periode: $("[name=Periode]").find(':selected').val(),
    CraneID: $("[name=CraneID]").find(':selected').val(),
    StartDate: $("[name=StartDate]").val(),
    EndDate: $("[name=EndDate]").val(),
  }
  console.log(data_post);
  table = $('#table').DataTable({
    lengthMenu: [10, 25, 50, 100, 200],
    pageLength: 25,
    searching: false,
    destroy: true,
    processing: true, //Feature control the processing indicator.
    serverSide: true, //Feature control DataTables' server-side processing mode.
    order: [], //Initial no order.
    ajax: {
      url: url,
      type: "POST",
      data: data_post,
      dataSrc: function (json) {
        return json.data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    },
    columnDefs: [{
      targets: [0],
      orderable: false,
    },],
  });
}
function reload_table() {
  table.ajax.reload(null, false);
}
function tracking_order(element) {
  dt = $(element).data();
  id = dt.id;
  transactioncode = id;
  modul = "tracking-order";
  load_data("gps-monitoring-tracking-order");
  $('html,body').animate({ scrollTop: $(".page-data").offset().top - 150 }, 'slow');
}
function load_filter() {
  modul = "report_route";
  load_data("map");
  table_data();
}
function reset_data() {
  modul = "gps_monitoring";
  load_data("map");
  if (modul == "gps_monitoring") {
    $("#form-filter input").val("");
    $("#form-filter [name=Periode]").val("custom");
    $("#form-filter [name=CraneID]").val("custom");
    table_data();
  }
}

function initialize() {
  var mapProp = {
    center: myCenter,
    zoom: zoom,
    gestureHandling: 'greedy'
    // mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map"), mapProp);
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = null;
  // directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true,map:map});
  // add_location();
  // map.addListener('click', function(event) {
  //     myCenter = event.latLng; 
  //     addMarker(myCenter);
  //     setMarkerinput(myCenter);
  // });
  cityCircle = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    map: map,
    center: myCenter,
    radius: Math.sqrt(0) * 100
  });
  // directionsDisplay.setMap(map);
}
google.maps.event.addDomListener(window, 'load', initialize);
google.maps.event.addDomListener(window, "resize", resizingMap());

function resizeMap(lat = "", lng = "") {
  if (typeof map == "undefined") return;
  setTimeout(function () {
    resizingMap(lat, lng);
  }, 400);
}

function resizingMap(lat, lng, setting) {
  if (typeof map == "undefined") return;
  statusmap = false;
  if (lat != "" && lng != "") {
    // deleteMarkers();

    myCenter = new google.maps.LatLng(lat, lng);
    marker = new google.maps.Marker({
      position: myCenter
    });
    statusmap = true;
    center = myCenter;
    zoom = 12;
  } else {
    // deleteMarkers();
    zoom = 12;
    myCenter = new google.maps.LatLng(10, -20);
    center = map.getCenter();
  }

  google.maps.event.trigger(map, "resize");
  map.setCenter(center);
  map.setZoom(zoom);
  if (statusmap && setting) {
    if (setting.marker == true) {
      addMarker(myCenter, { Radius: true });
    }
  }
}
function addMarker(location) {
  // deleteMarkers();
  console.log(location);
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    animation: google.maps.Animation.DROP,
    draggable: true

  });
  markers.push(marker);
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
function clearMarkers() {
  setMapOnAll(null);
}
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
function setMarkerinput(location) {
  $("#lat").val(location.lat());
  $("#lng").val(location.lng());
}
function add_location(list_store, setting) {
  if (markers.length > 0) {
    deleteMarkers();
  }
  var bounds = new google.maps.LatLngBounds();
  var infowindow = new google.maps.InfoWindow(); /* SINGLE */
  function placeMarker(v) {
    if (modul == "tracking-order") {
      if (v.Type == "Origin") {
        icon = host + 'aset/img/tow-truck-green.png';
      } else if (v.Type == "DestinationPickup") {
        icon = host + 'aset/img/marker-red-user.png';
      } else if (v.Type == "DestinationFinish") {
        icon = host + 'aset/img/marker-red.png';
      }
    } else {
      icon = v.Icon;
    }
    var IconMarker = {
      url: icon,
      labelOrigin: new google.maps.Point(20, -10),
      scaledSize: new google.maps.Size(40, 40),
      size: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(16, 32)
    };


    var latLng = new google.maps.LatLng(v.Lat, v.Lng);
    bounds.extend(latLng);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: IconMarker,
      label: {
        text: v.Name,
        fontWeight: "bold"
      }
    });
    markers.push(marker);
    google.maps.event.addListener(marker, 'click', function () {
      Name = v.Name;
      Check = v.LastUpdate;
      WindowContentx = "";
      if (modul == "tracking-order") {
        WindowContentx = '<b>' + v.Name + '</b>';
      } else {
        WindowContentx += '<table>';
        WindowContentx += "<tr><td><b>GPS</b></td><td> : <b>" + Name + '</b></td></tr>';
        WindowContentx += "<tr><td>Waktu</td><td> : " + Check + '</td></tr>';
        if (v.Data) {
          // WindowContentx += '<tr><td>Crane</td></td><td> : <a href="'+host+'backend/crane?id='+v.Data.CraneID+'" target="_blank">'+v.Data.CraneName+'</a></td></tr>';
          if (v.Data.ValidationCode) {
            WindowContentx += '<tr><td>No.SPK</td></td><td> : <a href="' + host + 'backend/validasi-order?id=' + v.Data.TransactionValidationOrderID + '" target="_blank">' + v.Data.ValidationCode + '</a></td></tr>';
            WindowContentx += '<tr><td>Tanggal</td><td> : ' + v.Data.Date + '</td></tr>';
          }
        }
        WindowContentx += '</table>';
      }
      WindowContent = "<div id='infowindow'>";
      WindowContent += WindowContentx;
      WindowContent += "</div>";

      infowindow.close(); // Close previously opened infowindow
      infowindow.setContent(WindowContent);
      infowindow.open(map, marker);
    });
  }
  $.each(list_store, function (i, v) {
    if (v.Lat != "0" && v.Lng != "0") {
      if (setting.zoom && i == 0) {
        myCenter = new google.maps.LatLng(v.Lat, v.Lng);
        center = myCenter;
        if (setting.modul == "tracking-order") {
          zoom = 5;
        } else {
          zoom = 8;
        }
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
        map.setZoom(zoom);
      }
      placeMarker(v);
    }
  });
  map.fitBounds(bounds);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, list_data, vorigin, vdestination) {
  origin = new google.maps.LatLng(vorigin.Lat, vorigin.Lng);
  destination = new google.maps.LatLng(vdestination.Lat, vdestination.Lng);
  // origin          = new google.maps.LatLng(-6.89000000000000, 106.236363259999998);
  // destination     = new google.maps.LatLng(-6.9700000001, 107.116363259999998);
  var waypts = [];
  var checkboxArray = document.getElementById('waypoints');
  if (list_data && list_data.length > 0) {
    $.each(list_data, function (i, v) {
      waypts.push({
        location: new google.maps.LatLng(v.Lat, v.Lng),
        stopover: true
      });
    });
  }
  directionsService.route({
    origin: origin,
    destination: destination,
    waypoints: waypts,
    // optimizeWaypoints: true,
    travelMode: 'DRIVING',
    // travelMode: 'BICYCLING',
    provideRouteAlternatives: true,
    avoidHighways: false,
  }, function (response, status) {
    console.log(response);
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
      var leg = response.routes[0].legs[0];
      origin_icon = host + 'aset/img/tow-truck-green.png';
      destination_icon = host + 'aset/img/marker-red-user.png';
      makeMarker(leg.start_location, origin_icon, "title", map);
      makeMarker(leg.end_location, destination_icon, 'title', map);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
function makeMarker(position, icon, title, map) {
  var IconMarker = {
    url: icon,
    size: new google.maps.Size(55, 55),
    origin: new google.maps.Point(-3, -5, 0, 0),
    scaledSize: new google.maps.Size(50, 50)
  };
  marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: IconMarker,
    title: title
  });
  markers.push(marker);
}
function addMarker(location, setting = "") {
  //https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png
  if (setting.Check == 'in') {
    icon = host + 'img/icon/marker-blue.svg';
  } else {
    icon = host + 'img/icon/marker-red.svg';
  }
  console.log(icon);
  var IconMarker = {
    url: icon,
    size: new google.maps.Size(45, 45),
    origin: new google.maps.Point(-3, -5, 0, 0),
    scaledSize: new google.maps.Size(40, 40)
  };
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: IconMarker,
    // animation : google.maps.Animation.DROP,

  });
  markers.push(marker);
  if (setting.Radius == true) {
    addRadius(location);
  }
}
function addRadius(location, setting = "") {
  if (setting) {
    radius_val = setting.radius;
    color = '#4CAF50';
  } else {
    color = '#FF0000';
  }

  if (radius_val) {
    cityCircle = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: location,
      radius: radius_val
    });
  }
}
function set_radius() {
  radius_val = $("[name=radius]").val();
  radius_val = parseInt(radius_val);
  $(".radius_val").text(radius_val + " Meter");
  // radius_val = Math.sqrt(radius_val) * 50;
  // radius_val = Math.round(radius_val);
  cityCircle.setRadius(radius_val);
}
function delete_radius() {
  cityCircle.setMap(null);
}

function set_poliline(PoliLine) {
  // var flightPlanCoordinates = [
  //   {lat: 37.772, lng: -122.214},
  //   {lat: 21.291, lng: -157.821},
  // ];
  // console.log(flightPlanCoordinates);
  // console.log(PoliLine);
  delete_polyline();
  var poly = new Array();
  $.each(PoliLine, function (i, v) {
    var CheckInLatLng = new google.maps.LatLng(v.Lat, v.Lng);
    // var marker = new google.maps.Marker({
    //     position: CheckInLatLng,
    //     map: map
    // });
    poly.push(CheckInLatLng);
  });
  flightPath = new google.maps.Polyline({
    path: poly,
    geodesic: true,
    strokeColor: '#2196F3',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);
  var lengthInMeters = google.maps.geometry.spherical.computeLength(flightPath.getPath());
  console.log("polyline is " + lengthInMeters + " long");
}
function delete_polyline() {
  if (markers.length > 0) {
    deleteMarkers();
  }
  if (flightPath) {
    flightPath.setMap(null);
  }
}
function reset_direction() {
  if (directionsDisplay != null) {
    directionsDisplay.setMap(null);
    directionsDisplay = null;
  }
}

function getRoute(origin, destination) {
  const startPoint = new google.maps.LatLng(-6.9575, 107.6454);
  const endPoint = new google.maps.LatLng(-6.9761, 107.6107);
  // const startPoint = new google.maps.LatLng(origin.lat, origin.long); 
  // const endPoint = new google.maps.LatLng(destination.lat, destination.long);

  const directionsService = new google.maps.DirectionsService();

  const request = {
    origin: startPoint,
    destination: endPoint,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      const route = response.routes[0];
      const coordinates = [];

      route.legs.forEach(leg => {
        leg.steps.forEach(step => {
          const decodedPolyline = google.maps.geometry.encoding.decodePath(step.polyline.points);
          coordinates.push(...decodedPolyline);
        });
      });
      return coordinates;
      // coordinates.forEach(coordinate => {
      //   console.log(coordinate.lat(), coordinate.lng());
      // });
    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
}
