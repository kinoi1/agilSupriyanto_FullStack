<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_main extends CI_Model {

    public function cek_session($page = "")
    {
        if ($page == "luar") :
            if ($this->session->login) :
                redirect("dashboard");
            endif;
        else :
            if (!$this->session->login) :
                redirect("login");
            endif;
        endif;
        if ($this->session->position || $this->session->position == "frontend") :
            $this->session->set_userdata("position", "backend");
        endif;
    }

    public function getlist_dokter(){
        $this->db->where('HakAksesID', 3);
         $query = $this->db->get('ut_user');
         return $query->result();
     }

    public function cek_antrian($DokterID){
        $this->db->where('DokterID', $DokterID);
        $query = $this->db->count_all_results('ps_pasien');
        return $query;
    }

    public function pasien_status($status){
        if($status == 0):
            return '<span class="badge badge-primary">Belum Diperiksa</span>';
        elseif($status == 1):
            return '<span class="badge badge-info">Sedang Diperiksa</span>';
        elseif($status == 2):
            return '<span class="badge badge-success">Selesai Diperiksa</span>';
        endif;
    }

    public function hak_akses($HakAksesID){
        if($HakAksesID == 1):
            return 'Pasien';
        elseif($HakAksesID == 2):
            return 'Admin';
        elseif($HakAksesID == 3):
            return 'Dokter';
        endif;
    }
}
