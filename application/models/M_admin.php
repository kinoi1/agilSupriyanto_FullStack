<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_admin extends CI_Model {

    public function getlist(){
        $query = $this->db->get('ut_user');
        return $query->result();
    }
}