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

    public function edit(){
        $PasienID = $this->input->post('PasienID');

        $res = $this->pasien->get_by_id($PasienID);

        $data['pasien'] = array(
            'PasienID' => $res->PasienID,
            'UserID' => $res->UserID,
            'DokterID' => $res->DokterID,
            'keluhan' => $res->keluhan,
            'nama_dokter' => $res->nama_dokter,
            'nama' => $res->nama

        );

        echo json_encode($data);
    }

    public function update(){
        $this->validation->pasien();
        if($this->session->HakAksesID == 1):
            $UserID = $this->session->UserID;
        else:
            $UserID = $this->input->post('UserID');
        endif;
 
        $DokterID = $this->input->post('DokterID');
        $keluhan = $this->input->post('keluhan');
        $PasienID = $this->input->post('PasienID');

        // $antrian = $this->main->cek_antrian($DokterID);
        $data = array(
            'UserID' => $UserID,
            'DokterID' => $DokterID,
            'keluhan' => $keluhan,
        );

        $updateID = $this->pasien->update($PasienID, $data);
        if($updateID):
            $output = array(
                'status' => TRUE,
                'Message' => 'Berhasil update pemeriksaan',
                

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