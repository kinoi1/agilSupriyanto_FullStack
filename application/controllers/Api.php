<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use \Firebase\JWT\JWT;

class Api extends CI_Controller {

    private $secret_key = 'your_secret_key';

    public function __construct($config = "rest") {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding,Authorization");
        parent::__construct();
        $this->load->library('form_validation');
    }

    public function register() {
        $this->form_validation->set_rules('username', 'Username', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');

        if ($this->form_validation->run() == FALSE) {
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode(array('error' => validation_errors())));
            return;
        }

        $data = array(
            'username' => $this->input->post('username'),
            'password' => password_hash($this->input->post('password'), PASSWORD_BCRYPT),
            'HakAksesID' => 1 // pasien
        );

        if ($this->api->create_user($data)) {
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode(array('message' => 'User registered successfully')));
        } else {
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode(array('error' => 'Failed to register user')));
        }
    }

    public function login() {
        
        $this->form_validation->set_rules('username', 'Username', 'required');
        $this->form_validation->set_rules('password', 'Password', 'required');
        if ($this->form_validation->run() == FALSE) {
            $this->output
                 ->set_content_type('application/json')
                 ->set_output(json_encode(array('error' => validation_errors())));
            return;
        }

        $user = $this->api->get_user($this->input->post('username'));
        if ($user && password_verify($this->input->post('password'), $user['password'])) {
            $token = array(
                'id' => $user['UserID'],
                'username' => $user['username'],
                'iat' => time(),
                'exp' => time() + 3600 // Token expired dalam 1 jam
            );
            // print_r($this->authorization_token->generateToken($data));exit;
            $jwt =$this->authorization_token->generateToken($token);

            $data  = array(
                'UserID' => $user['UserID'],
                'username' => $user['username'],
                'nama' => $user['nama'],
                'HakAksesID' => $user['HakAksesID'],
                'token' => $jwt,
            );
            $this->session->set_userdata($data);
            
            // $this->output
            //      ->set_content_type('application/json')
            //      ->set_output(json_encode(array('token' => $jwt)));
            if($user['HakAksesID'] == 1){
                $redirect = base_url('pasien');
            }
            elseif($user['HakAksesID'] == 2){
                $redirect = base_url('admin');
            
            }elseif($user['HakAksesID'] == 3){
                $redirect = base_url('dokter');
            
            }
            $output = array('status'=>TRUE,'token' => $jwt,'message' => 'Login Berhasil','success' => TRUE ,'redirect'=> $redirect);
            echo json_encode($output);
        } else {
            // $this->output
            //      ->set_content_type('application/json')
            //      ->set_output(json_encode(array('error' => 'Invalid username or password')));
            $output = array('status'=>FALSE,'error' => 'Invalid username or password');
            echo json_encode($output);
        }
    }



}