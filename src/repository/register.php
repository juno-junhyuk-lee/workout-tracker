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

// Start transaction
$conn->begin_transaction();

try {
    // Insert user
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

    if (!$stmt->execute()) {
        throw new Exception("Failed to create user: " . $stmt->error);
    }

    $userId = $conn->insert_id;

    // Initialize default calorie goals: 2000 daily (600+600+600+200)
    // Column names match your table structure: Users_ID, Daily_Goal, Breakfast, Lunch, Dinner, Snacks
    $stmtGoals = $conn->prepare("
        INSERT INTO UserCalorieGoals (Users_ID, Daily_Goal, Breakfast, Lunch, Dinner, Snacks)
        VALUES (?, 2000, 600, 600, 600, 200)
    ");
    
    $stmtGoals->bind_param("i", $userId);
    
    if (!$stmtGoals->execute()) {
        throw new Exception("Failed to initialize calorie goals: " . $stmtGoals->error);
    }

    // Commit transaction
    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => "User registered successfully",
        "username" => $username,
        "userId" => $userId
    ]);

} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>
