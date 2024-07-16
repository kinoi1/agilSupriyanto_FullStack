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
                <label for="UserID"> Nama </label>
                <input class="form-control" type="text" name="nama">
            </div>
            <div class="col-md-6 form-group">
                <label for="UserID"> Email </label>
                <input class="form-control" type="text" name="username">
            </div>
            <div class="col-md-6 form-group">
                <label for="UserID"> Password </label>
                <input class="form-control" type="password" name="password">
            </div>
            <div class="col-md-6 form-group">
                <label for="UserID"> Hak Akses </label>
                <select class="form-control" name="HakAksesID" >
                    <option value="none">pilih</option>
                    <option value="1">Pasien</option>
                    <option value="2">Admin</option>
                    <option value="3">Dokter</option>
                </select>
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
