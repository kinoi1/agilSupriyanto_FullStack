var host        = window.location.origin +"/";
var url_list    = host + 'rumahsakit/api/list_pasien';
var url_simpan  = host + 'rumahsakit/pasien/save';


$(document).ready(function () {
    // load_datatables();

});

// function load_datatables() {
    
//     url_list = host + 'rumahsakit/api/list_pasien';
    
// table = $('#table').DataTable({
//     "pageLength": 25,
//     "destroy": true,
//     "processing": true, //Feature control the processing indicator.
//     "serverSide": true, //Feature control DataTables' server-side processing mode.
//     "searching": true,
//     "order": [], //Initial no order.
//     ajax: {
//         url: url_list,
//         type: "POST",
//         data: $('#form').serialize(),
//         error: function (jqXHR, textStatus, errorThrown) {
//             // Do something here
//             console.log(jqXHR.responseText);
//         }
//     },
//     "drawCallback": function(settings) {
//         console.log(settings.json);
//         //do whatever  
//      },
//     "columnDefs": [
//         {
//             "targets": [0], //last column
//             "orderable": false, //set not orderable
//         },
//     ],
// });
// }

if($('div').hasClass('list_pasien')){
    getlist();
}

function getlist() {
    url = url_list;
    $.ajax({
        url : url,
        type: "POST",
        data: $('#form-login').serialize(),
        dataType: "JSON",
        success: function(data)
        {
            console.log(json);

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
           
            console.log(jqXHR.responseText);
            console.log(textStatus);
            console.log(errorThrown);

        }
    });
}

function save(){
    $.ajax({
        url : url_simpan,
        type: "POST",
        data: $('#form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
            if (data.status) {
                $('#exampleModal').modal('hide');
                swal(data.Message,'', "success");
            }else{
                swal(data.Message,'', "warning");

            }

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            
            console.log(jqXHR.responseText);
            console.log(textStatus);
            console.log(errorThrown);

        }
    });
}

if($('select').hasClass('list_pasien')){
    getdata('pasien');
}

if($('select').hasClass('list_dokter')){
    getdata('dokter');
}

function getdata(type){
    console.log('jojo');
    if(type == 'pasien'){   
        url = host + 'rumahsakit/pasien/list_pasien';
    }else{
        url = host + 'rumahsakit/main/list_dokter';
    }
    console.log(url);
    $.ajax({
        url : url,
        type: "POST",
        // data: $('#form').serialize(),
        dataType: "JSON",
        success: function(data)
        {
            console.log(data);
            if(type == 'pasien'){
                var select = $('.list_pasien');

            }else{
                var select = $('.list_dokter');
            }
                select.empty(); // Clear existing options
                $.each(data.data, function(key, value) {
                    select.append('<option value="' + value.UserID + '">' + value.nama + '</option>');
                });

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            
            console.log(jqXHR.responseText);
            console.log(textStatus);
            console.log(errorThrown);

        }
    });
}