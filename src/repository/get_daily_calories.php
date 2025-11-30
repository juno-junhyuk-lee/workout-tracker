<?php
require "config.php";
require "utils.php";
allow_cors();

$Users_ID = $_GET['Users_ID'] ?? null;
$Date = $_GET['Date'] ?? date('Y-m-d');

if (!$Users_ID) {
    echo json_encode(["status" => "error", "message" => "Users_ID required"]);
    exit;
}

$stmt = $conn->prepare("SELECT GetDailyCalories(?, ?) AS total_calories");
$stmt->bind_param("is", $Users_ID, $Date);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode([
    "status" => "success",
    "date" => $Date,
    "totalCalories" => floatval($row['total_calories'])
]);
?>
