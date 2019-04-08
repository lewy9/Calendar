<?php
require "database.php";

header("Content-Type: application/json");

// HTTP-Only Cookies
ini_set("session.cookie_httponly", 1);
session_start();

if(isset($_SESSION['username'])) {
    $username = $_SESSION['username'];

    $titles = array();
    $dates = array();
    $times = array();
    $tags = array();

    // Retrieve events info from mysql
    $stmt = $mysqli->prepare("select title, date, time, tag from events where username=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($title, $date, $time, $tag);

    while($stmt->fetch()) {
        array_push($titles, htmlentities($title));
        array_push($dates, htmlentities($date));
        array_push($times, htmlentities($time));
        array_push($tags, htmlentities($tag));
    }

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "titles" => $titles,
        "dates" => $dates,
        "times" => $times,
        "tags" => $tags
    ));
    exit;
}
else {
    echo json_encode(array(
        "success" => false
    ));
}

?>