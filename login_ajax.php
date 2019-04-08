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

// select the users database to authenticate password
$stmt = $mysqli->prepare("select password from users where username = ?");
if(!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $username);

$stmt->execute();

$stmt->bind_result($pwd_hash);
$stmt->fetch();

if(password_verify($password, $pwd_hash)) {
    // Login Succeeded!
    // HTTP-Only Cookies
    ini_set("session.cookie_httponly", 1);
    session_start();
    $_SESSION['username'] = $username;
    // Create CSRF token
    $_SESSION['token'] = bin2hex(random_bytes(32));

    echo json_encode(array(
        "success" => true,
        "username" => htmlentities($username),
        "token" => $_SESSION['token'],
        "message" => "Login success!"
    ));
    exit;
}
else {
    // Login Failed!
    echo json_encode(array(
        "success" => false,
        "message" => "Login failed!"
    ));
    exit;
}

?>