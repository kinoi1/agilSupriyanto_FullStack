<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_api extends CI_Model {

    public function get_user($username) {
        $query = $this->db->get_where('ut_user', array('username' => $username));
        return $query->row_array();
    }

    public function create_user($data) {
        return $this->db->insert('ut_user', $data);
    }
}