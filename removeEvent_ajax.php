<?php
require "database.php";

header("Content-Type: application/json");

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$id = $json_obj['eventId'];
$token = $json_obj['token'];

// CSRF token validate
if(!hash_equals($_SESSION['token'], $token)){
    die("Request forgery detected");
}

$stmt = $mysqli->prepare("delete from events where id=?");
if(!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('i', $id);

$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event removed!"
));
exit;

?>