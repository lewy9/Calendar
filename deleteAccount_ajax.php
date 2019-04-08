<?php
require "database.php";

header("Content-Type: application/json");

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$stmt = $mysqli->prepare("delete from events where username=?");
if(!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $username);

$stmt->execute();

$stmt->close();

$stmt = $mysqli->prepare("delete from users where username=?");
if(!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $username);

$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Account Deleted!"
));
exit;

?>