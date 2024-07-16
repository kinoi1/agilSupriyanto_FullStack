<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Tambah Pasien</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="form">
            <div class="col-md-6 form-group">
                <label for="UserID"> Nama Pengguna</label>
                <?php if($this->session->HakAksesID == 1): ?>
                    <input class="form-control" type="text" name="UserID" value="<?= $this->session->nama; ?>" readonly>
                <?php else: ?>
                <select class="form-control" name="UserID" >
                    <option value="none">pilih</option>
                    <?php foreach ($pasien as $a):  ?>
                        <option value="<?= $a->UserID; ?>"><?= $a->nama; ?></option>
                    <?php endforeach; ?>
                </select>
                <?php endif; ?>
            </div>
            <div class="col-md-6 form-group">
                <label for="DokterID"> Nama Dokter</label>
                <select class="form-control" name="DokterID" >
                    <option value="none">pilih</option>
                    <?php foreach ($dokter as $a):  ?>
                        <option value="<?= $a->UserID; ?>"><?= $a->nama; ?></option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="col-md-12 form-group">
                <label for="keluhan">Keluhan</label>
                <textarea  class="form-control" name="keluhan" rows="3"></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <a href="javascript:void(0)" onclick="save(this)" class="btn btn-primary">Save changes</a>
            </div>
            </form>
        </div>
    </div>
  </div>
</div>

<!-- Modal -->
<div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editModalLabel">Edit Data Pasien</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="form-edit">
            <div class="col-md-6 form-group">
                <input type="hidden" name="PasienID">

                <label for="UserID"> Nama Pengguna</label>                
                <select class="form-control list_pasien" name="UserID" >
                </select>
            </div>
            <div class="col-md-6 form-group">
                <label for="DokterID"> Nama Dokter</label>
                <select class="form-control list_dokter" name="DokterID" >
                    
                </select>
            </div>
            <div class="col-md-12 form-group">
                <label for="keluhan">Keluhan</label>
                <textarea  class="form-control" name="keluhan" rows="3"></textarea>
            </div>

            <div class="col-md-6 form-group">
                <label for="status"> Status</label>
                <select class="form-control" name="status" >
                    <option value="0"><span class="badge badge-primary">Belum Diperiksa</span></option>
                    <option value="1"><span class="badge badge-info">Sedang Diperiksa</span></option>
                    <option value="2"><span class="badge badge-success">Selesai Diperiksa</span></option>
                </select>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <a href="javascript:void(0)" onclick="save(this)" data-category="edit" class="btn btn-primary">Save changes</a>
            </div>
            </form>
        </div>
    </div>
  </div>
</div>