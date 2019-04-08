<?php
require "database.php";
header("Content-Type: application/json");

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
if(isset($_SESSION['username'])) {
    session_destroy();
    echo json_encode(array(
        "success" => true,
        "message" => "Log out success"
    ));
    exit;
}
?>