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

$sql = "
    INSERT INTO UserCalorieGoals (userId, dailyGoal, breakfast, lunch, dinner, snacks) 
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
        dailyGoal = VALUES(dailyGoal),
        breakfast = VALUES(breakfast),
        lunch = VALUES(lunch),
        dinner = VALUES(dinner),
        snacks = VALUES(snacks)
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
