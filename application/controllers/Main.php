<?php
defined('BASEPATH') OR exit('No direct script access allowed');


use \Firebase\JWT\JWT;

class Main extends CI_Controller {

    private $secret_key = 'your_secret_key';

    public function __construct() {
        parent::__construct();
        $this->load->library('form_validation');
    }

    public function index()
	{
		$this->main->cek_session("luar");
		$v["title"]		= "Sales Pro";
		$v["category"]	= "login";
		$this->load->view('backend/auth/login', $v);
	}

    public function register()
	{
		
		$this->load->view('backend/auth/register');
	}

	public function list_dokter(){
		$data['data'] = $this->main->getlist_dokter();
		echo json_encode($data);
	}

    
}
