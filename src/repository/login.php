<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require "config.php";
require "utils.php";

allow_cors();

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

// Basic validation
$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

if (!$email || !$password) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing email or password"
    ]);
    exit;
}

// Prepare query
$stmt = $conn->prepare("SELECT Users_ID, Password, First_Name, Last_Name, Username FROM Users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email not found"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user["Password"])) {
    echo json_encode([
        "status" => "error",
        "message" => "Incorrect password"
    ]);
    exit;
}

// SUCCESS — return user info (no password)
echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "user" => [
        "id" => $user["Users_ID"],
        "first_name" => $user["First_Name"],
        "last_name" => $user["Last_Name"],
        "username" => $user["Username"],
        "email" => $email
    ]
]);
?>
