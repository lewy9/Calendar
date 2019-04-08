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

// Input Check
if(empty($title) || empty($date) || empty($time) || empty($tag)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Please check your input!"
    ));
    exit;
}
else {
    $stmt = $mysqli->prepare("insert into events (username, title, date, time, tag) values (?, ?, ?, ?, ?)");
    if(!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('sssss', $username, $title, $date, $time, $tag);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "message" => "Event Added!"
    ));
    exit;
}

?>