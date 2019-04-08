<?php
require "database.php";

header("Content-Type: application/json");

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();
$username = $_SESSION['username'];

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$title = $json_obj['title'];
$date = $json_obj['date'];
$time = $json_obj['time'];
$tag = $json_obj['tag'];
$id = $json_obj['eventId'];
$token = $json_obj['token'];

// Input Check
if(empty($title) || empty($date) || empty($time) || empty($tag)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Please check your input!"
    ));
    exit;
}
else {
    // CSRF token validate
    if(!hash_equals($_SESSION['token'], $token)){
        die("Request forgery detected");
    }

    $stmt = $mysqli->prepare("update events set title=? , date=? , time=? , tag=? where id=?");
    if(!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('ssssi', $title, $date, $time, $tag, $id);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Event Edited!"
    ));
    exit;
}

?>