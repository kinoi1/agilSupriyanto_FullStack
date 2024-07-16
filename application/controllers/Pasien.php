<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pasien extends CI_Controller {

    public function __construct(){
        parent::__construct();
        $this->load->model('M_pasien','pasien');
    }

    public function index(){
        $data['page'] = 'backend/pasien/dashboard';
        $this->load->view('backend/index',$data);
    }
    public function list_data(){
        $data['page'] = 'backend/pasien/list_data';
        $data['pasien'] = $this->pasien->getlist();
        $data['dokter'] = $this->main->getlist_dokter();
        $data['data'] = $this->pasien->list_data();
        $this->load->view('backend/index',$data);
    }

    public function list_pasien(){
        $data['data'] = $this->pasien->getlist();
        echo json_encode($data);
    }

    public function save(){
        $this->validation->pasien();
        if($this->session->HakAksesID == 1):
            $UserID = $this->session->UserID;
        else:
            $UserID = $this->input->post('UserID');
        endif;
 
        $DokterID = $this->input->post('DokterID');
        $keluhan = $this->input->post('keluhan');

        $antrian = $this->main->cek_antrian($DokterID);
        $data = array(
            'UserID' => $UserID,
            'DokterID' => $DokterID,
            'keluhan' => $keluhan,
            'antrian' => $antrian + 1
        );

        $insertID = $this->pasien->save($data);
        if($insertID):
            $output = array(
                'status' => TRUE,
                'Message' => 'Berhasil mengajukan pemeriksaan',
                'antrian' => $antrian,

            );
        else:
            $output = array(
                'status' => FALSE,
                'Message' => 'Gagal mengajukan pemeriksaan',
            );
        endif;
        echo json_encode($output);
    }
}