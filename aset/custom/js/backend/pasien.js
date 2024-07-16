var host        = window.location.origin +"/";
var url_list    = host + 'rumahsakit/api/list_pasien';
var url_simpan  = host + 'rumahsakit/pasien/save';
var url_update  = host + 'rumahsakit/pasien/update';
var url_edit    = host + 'rumahsakit/pasien/edit';


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

function save(element){
    console.log(element);
    var category = $(element).data('category');
    if(category == 'edit'){
        url = url_update;
        data = $('#form-edit').serialize()
    }else{
        url = url_simpan;
        data = $('#form').serialize()
    }

    $.ajax({
        url : url,
        type: "POST",
        data: data,
        dataType: "JSON",
        success: function(data)
        {
            if (data.status) {
                if(category == 'edit'){
                    $('#editModal').modal('hide');

                }else{
                    $('#exampleModal').modal('hide');

                }
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
                select.append('<option value="none"> Pilih </option>');
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

function edit(id){
    console.log('tes');
    $.ajax({
        url : url_edit,
        type: "POST",
        data: {PasienID:id},
        dataType: "JSON",
        success: function(data)
        {
           console.log(data);
           pasien = data.pasien;
           console.log(pasien);
           $('[name="UserID"]').val(pasien.UserID);
           $('[name="DokterID"]').val(pasien.DokterID);
           $('[name="keluhan"]').val(pasien.keluhan);
           $('[name="name"]').val(pasien.nama);
           $('[name="dokter"]').val(pasien.nama_dokter);
           $('[name="PasienID"]').val(pasien.PasienID);
        //    $('#dokter').val(pasien.nama_dokter);
        //    console.log(pasien.nama_dokter);
        //    $('#dokter').val('ijfojfo');
          

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            
            console.log(jqXHR.responseText);
            console.log(textStatus);
            console.log(errorThrown);

        }
    });
}

function hapus_data(id){
    swal({
        title: "Info",
        text: "Apakah anda yakin akan menghapus data ini ?",
        // type: "warning",   
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Ya",
        cancelButtonText: "Tidak",
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
                       
                        swal("Info", "Transaksi berhasil dibatalkan");

                        

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Info", "Terjadi kesalahan gagal melakukan transaksi data");
                        console.log(jqXHR.responseText);
                    }
                });
            } else {
                swal("Info", "Transaksi tidak jadi");
            }
        });
}