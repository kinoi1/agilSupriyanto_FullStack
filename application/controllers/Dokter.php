<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dokter extends CI_Controller {


    public function __construct()
    {
        parent::__construct();
        $this->load->model('M_dokter','dokter');
        is_logged_in();
    }

    public function index(){
        $data['page'] = 'backend/dokter/dashboard';
        $this->load->view('backend/index',$data);
    }
}