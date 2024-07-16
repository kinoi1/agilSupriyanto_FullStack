<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_validation extends CI_Model {

    public function pasien(){
        $output = array(
            'status' => TRUE,
            'Message' => '',
        );
        if($this->session->HakAksesID == 1):
            $UserID = $this->session->UserID;
        else:
            $UserID = $this->input->post('UserID');
        endif;
 
        $DokterID = $this->input->post('DokterID');
        $keluhan = $this->input->post('keluhan');

        if($UserID == "none" || $DokterID == "none"):
            $output = array(
                'status' => FALSE,
                'Message' => 'Data tidak lengkap',
            );
        endif;

        if($output['status'] == FALSE):
            echo json_encode($output);
            exit();
        endif;

    }
}