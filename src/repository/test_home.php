<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "Step 1: PHP works\n";

// Test config
require "config.php";
echo "Step 2: Config loaded\n";

if ($conn->connect_error) {
    echo "Step 3: DB connection FAILED: " . $conn->connect_error . "\n";
} else {
    echo "Step 3: DB connected\n";
}

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
echo "Step 4: user_id = $user_id\n";

// Test a simple query
$sql = "SELECT COUNT(*) as cnt FROM Workouts WHERE Users_ID = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo "Step 5: Prepare FAILED: " . $conn->error . "\n";
} else {
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    echo "Step 5: Workouts count = " . $row['cnt'] . "\n";
}

echo "Done!\n";
?>
