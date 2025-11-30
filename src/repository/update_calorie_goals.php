<?php
require "config.php";
require "utils.php";
allow_cors();

header("Content-Type: application/json");

$userId = isset($_POST['userId']) ? intval($_POST['userId']) : null;
$dailyGoal = isset($_POST['dailyGoal']) ? intval($_POST['dailyGoal']) : null;

// Empty string means disabled (null), otherwise parse as int
$breakfast = (isset($_POST['breakfast']) && $_POST['breakfast'] !== '') ? intval($_POST['breakfast']) : null;
$lunch = (isset($_POST['lunch']) && $_POST['lunch'] !== '') ? intval($_POST['lunch']) : null;
$dinner = (isset($_POST['dinner']) && $_POST['dinner'] !== '') ? intval($_POST['dinner']) : null;
$snacks = (isset($_POST['snacks']) && $_POST['snacks'] !== '') ? intval($_POST['snacks']) : null;

if (!$userId || !$dailyGoal) {
    echo json_encode(["status" => "error", "message" => "userId and dailyGoal are required"]);
    exit;
}

// Column names must match your table: Users_ID, Daily_Goal, Breakfast, Lunch, Dinner, Snacks
$sql = "
    INSERT INTO UserCalorieGoals (Users_ID, Daily_Goal, Breakfast, Lunch, Dinner, Snacks) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        Daily_Goal = VALUES(Daily_Goal),
        Breakfast = VALUES(Breakfast),
        Lunch = VALUES(Lunch),
        Dinner = VALUES(Dinner),
        Snacks = VALUES(Snacks)
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiiiii", $userId, $dailyGoal, $breakfast, $lunch, $dinner, $snacks);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Calorie goals updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to update calorie goals: " . $stmt->error
    ]);
}
?>
