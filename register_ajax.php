<?php
require "database.php";

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];
$password = $json_obj['password'];

// Input Check
if(empty($username) || empty($password)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Please check your input!"
    ));
    exit;
}

// check if the user already registered
$flag = true; // boolean type to check whether the username exists
// select the users database to check whether the username is a duplicate
$stmt = $mysqli->prepare("select username from users");
if(!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->execute();

$stmt->bind_result($names);

while($stmt->fetch()){
    if($username == $names) {
        $flag = false;
        break;
    }
    else {
        $flag = true;
    }
}

$stmt->close();

if($flag) {
    // valid username
    // HTTP-Only Cookies
    ini_set("session.cookie_httponly", 1);
    session_start();
    $_SESSION['username'] = $username;
    // create CSRF token
    $_SESSION['token'] = bin2hex(random_bytes(32));

    // insert new user info into database
    $pwd_hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('ss', $username, $pwd_hash);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
        "username" => htmlentities($username),
        "token" => $_SESSION['token'],
        "message" => "Register success, now log in!"
    ));
    exit;
}
else {
    // Duplicate username, register failed
    echo json_encode(array(
        "success" => false,
        "message" => "Username already registered!"
    ));
    exit;
}
?>