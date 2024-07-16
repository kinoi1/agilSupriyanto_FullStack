<div class="container-fluid">

    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Tables</h1>
    

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Daftar User</h6>
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                Tambah
            </button>
        </div>
        <!-- Button trigger modal -->



        <div class="card-body">
            <div class="table-responsive">
                <table id="list_pasien" class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Alamat</th>
                            <th>Tanggal Lahir</th>
                            <th>Password</th>
                            <th>Hak Akses</th>
                            <th>Action</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        <?php $i = 1; foreach($data as $a):?>
                            <tr>
                                <td><?= $i++; ?></td>
                                <td><?= $a->nama; ?></td>
                                <td><?= $a->username; ?></td>
                                <td><?= $a->alamat; ?></td>
                                <td><?= $a->tgl_lahir; ?></td>
                                <td><?= $a->password; ?></td>
                                <td><?= $this->main->hak_akses($a->HakAksesID); ?></td>
                                <td>
                                    <a class="btn btn-info" href="javascript:void(0)" onclick="edit('<?= $a->UserID; ?>')" >Edit</a>
                                    <a class="btn btn-danger" href="javascript:void(0)" onclick="hapus_data('<?= $a->UserID; ?>')" >Hapus</a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>


<?php $this->load->view('backend/admin/modal')?>
<script src="<?= base_url('aset/');?>custom/js/backend/admin.js"></script>
