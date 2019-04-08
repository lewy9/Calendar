<?php
require "database.php";

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$title = $json_obj['title'];
$date = $json_obj['date'];
$time = $json_obj['time'];
$tag = $json_obj['tag'];

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();

if(isset($_SESSION['username'])) {
    $username = $_SESSION['username'];

    // Retrieve events info from mysql
    $stmt = $mysqli->prepare("select id from events where username=? and title=? and date=? and time=? and tag=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('sssss', $username, $title, $date, $time, $tag);
    $stmt->execute();
    $stmt->bind_result($id);

    $stmt->fetch();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "eventId" => $id
    ));
    exit;
}
else {
    echo json_encode(array(
        "success" => false
    ));
}

?>