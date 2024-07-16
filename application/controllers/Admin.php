<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admin extends CI_Controller {


    public function index(){
        $data['page'] = 'backend/admin/dashboard';
        $this->load->view('backend/index',$data);
    }
}