<?php
require "config.php";
require "utils.php";
allow_cors();

header("Content-Type: application/json");

$userId = isset($_GET['userId']) ? intval($_GET['userId']) : null;

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "userId is required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT Users_ID, Daily_Goal, Breakfast, Lunch, Dinner, Snacks 
    FROM UserCalorieGoals 
    WHERE Users_ID = ?
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "success",
        "userId" => $userId,
        "dailyGoal" => 2000,
        "breakfast" => 600,
        "lunch" => 600,
        "dinner" => 600,
        "snacks" => 200
    ]);
    exit;
}

$row = $result->fetch_assoc();

echo json_encode([
    "status" => "success",
    "userId" => intval($row['Users_ID']),
    "dailyGoal" => intval($row['Daily_Goal']),
    "breakfast" => $row['Breakfast'] !== null ? intval($row['Breakfast']) : null,
    "lunch" => $row['Lunch'] !== null ? intval($row['Lunch']) : null,
    "dinner" => $row['Dinner'] !== null ? intval($row['Dinner']) : null,
    "snacks" => $row['Snacks'] !== null ? intval($row['Snacks']) : null
]);
?>
