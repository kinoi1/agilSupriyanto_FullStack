<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {


    public function __construct()
    {
        parent::__construct();
        $this->load->model('M_admin','admin');
        is_logged_in();
        // if($this->session->userdata('HakAksesID') <> 3):
        //     redirect(404);
        // endif;
    }
    public function index(){
        $data['page'] = 'backend/admin/dashboard';
        $this->load->view('backend/index',$data);
    }

    public function list_data(){
        $data['page'] = 'backend/admin/list_data';
        $data['data'] = $this->admin->getlist();
        $this->load->view('backend/index',$data);
    }
}