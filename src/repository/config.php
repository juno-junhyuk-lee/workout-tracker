<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "workout_tracker";  // FIXED

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>
