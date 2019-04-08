<?php
header("Content-Type: application/json");
session_start();
if(isset($_SESSION['username'])) {
    echo json_encode(array(
       "success" => true,
        "username" => htmlentities($_SESSION['username']),
        "message" => "Logged in"
    ));
    exit;
}
else {
    session_destroy();
    echo json_encode(array(
       "success" => false,
        "message" => "Not logged in"
    ));
    exit;
}
?>