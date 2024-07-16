<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class M_pasien extends CI_Model {

 public function getlist(){
    $this->db->where('HakAksesID', 1);
     $query = $this->db->get('ut_user');
     return $query->result();
 
    }

 public function save($data){
    if($this->db->insert('ps_pasien', $data)):
        return $this->db->insert_id();
    else:
        return FALSE;
    endif;
 }

 public function list_data(){
    $this->db->select("
    b.nama,b.alamat,a.Antrian,
    a.Status,a.PasienID,a.keluhan
    ");
    $this->db->from("ps_pasien as a");
    $this->db->join("ut_user as b","a.UserID = b.UserID","left");
    $this->db->where("b.HakAksesID",1);
    if($this->session->HakAksesID == 1):
        $this->db->where("a.UserID",$this->session->UserID);
    endif;
    $query = $this->db->get();
    return $query->result();
 }

 public function get_by_id($id){
    $this->db->select("
    b.nama,b.alamat,a.Antrian,
    a.Status,a.PasienID,a.DokterID,a.keluhan,b.UserID,c.nama as nama_dokter,a.PasienID
    ");
    $this->db->from("ps_pasien as a");
    $this->db->join("ut_user as b","a.UserID = b.UserID","left");
    $this->db->join("ps_dokter as c","a.DokterID = c.DokterID","left");
    $this->db->where("a.PasienID",$id);
    $query = $this->db->get();
    return $query->row();
 }

 public function update($id,$data){
    $this->db->where('PasienID',$id);
    if($this->db->update('ps_pasien', $data)):
        return TRUE;
    else:
        return FALSE;
    endif;
 }

 public function delete($id){
    $this->db->where('PasienID',$id);
    if($this->db->delete('ps_pasien')):
        return TRUE;
    else:
        return FALSE;
    endif;
 }
}