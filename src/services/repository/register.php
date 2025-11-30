<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require "config.php";
require "utils.php";

allow_cors();

// Try reading normal way first
$data = get_json();

// If empty, force read raw input manually (required for Expo+iOS+ngrok)
if (!$data || empty($data)) {
    $raw = file_get_contents("php://input");

    // decode manually
    $data = json_decode($raw, true);

    // temporary debug print to browser
    file_put_contents(__DIR__ . "/debug_raw.txt", $raw);

    if (!$data) {
        $data = [];
    }
}


// Extract fields from JSON
$first = $data["first_name"] ?? "";
$last = $data["last_name"] ?? "";
$email = $data["email"] ?? "";
$rawPassword = $data["password"] ?? "";
$age = $data["age"] ?? null;
$gender = $data["gender"] ?? null;

// Validate required fields
if (!$first || !$last || !$email || !$rawPassword) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields: first_name, last_name, email, password"
    ]);
    exit;
}

// Generate username
$username = strtolower($first) . rand(1000, 9999);

// Hash password
$password = password_hash($rawPassword, PASSWORD_BCRYPT);

// Prepare SQL insert
$stmt = $conn->prepare("
    INSERT INTO Users (First_Name, Last_Name, Email, Username, Password, Age, Gender)
    VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssssis",
    $first,
    $last,
    $email,
    $username,
    $password,
    $age,
    $gender
);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "username" => $username
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}
?>
