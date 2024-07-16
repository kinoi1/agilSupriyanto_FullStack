<div class="container-fluid">

    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Tables</h1>
    

    <!-- DataTales Example -->
    <div class="card shadow mb-4">
        <div class="card-header py-3">
            <h6 class="m-0 font-weight-bold text-primary">Daftar Pasien</h6>
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
                            <th>No Antrian</th>
                            <th>Nama</th>
                            <th>Keluhan</th>
                            <th>Status</th>
                            <?php if($this->session->HakAksesID <> 1):?>
                            <th>Action</th>
                            <?php endif; ?>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $i = 1; foreach($data as $a):?>
                            <tr>
                                <td><?= $i++; ?></td>
                                <td><?= $a->Antrian; ?></td>
                                <td><?= $a->nama; ?></td>
                                <td><?= $a->alamat;?></td>
                                <td><?= $this->main->pasien_status($a->Status); ?></td>
                                <?php if($this->session->HakAksesID <> 1):?>
                                <td>
                                    <button type="button" class="btn btn-primary"  data-toggle="modal" data-target="#editModal" onclick="edit('<?= $a->PasienID;?>')">
                                        Edit
                                    </button>
                                </td>
                                <?php endif; ?>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>


<?php $this->load->view('backend/pasien/modal')?>
<script src="<?= base_url('aset/');?>custom/js/backend/pasien.js"></script>
