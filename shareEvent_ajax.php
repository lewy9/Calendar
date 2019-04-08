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
$friend = $json_obj['friend'];

// We need to check "friend" is an existed user.
$flag = false; // A boolean flag to check this "friend" is an existed user

foreach ($friend as $name) {
    $stmt = $mysqli->prepare("select username from users where username=?");
    if(!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('s', $name);

    $stmt->execute();

    $stmt->bind_result($res);

    $stmt->fetch();

    $stmt->close();

    if($res != $name || $name == $username) {
        $flag = false;
        break;
    }
    else {
        $flag = true;
    }
}

if(!$flag) {
    echo json_encode(array(
       "success" => false,
       "message" => "Please check your friends' names. It may not exist."
    ));
    exit;
}
else {
    foreach ($friend as $name) {
        $stmt = $mysqli->prepare("insert into events (username, title, date, time, tag) values (?, ?, ?, ?, ?)");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }

        $stmt->bind_param('sssss', $name, $title, $date, $time, $tag);

        $stmt->execute();

        $stmt->close();
    }

    echo json_encode(array(
        "success" => true,
        "message" => "Share Events success!"
    ));
    exit;
}

?>