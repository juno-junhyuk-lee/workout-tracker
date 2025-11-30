<?php
require "config.php";
require "utils.php";
allow_cors();

$Users_ID = $_GET['Users_ID'] ?? null;

if (!$Users_ID) {
    echo json_encode(["status" => "error", "message" => "Users_ID required"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT fl.*, f.Foods_Name, f.Calories_Per_Serving, f.Foods_Category
    FROM FoodLog fl
    JOIN Foods f ON fl.Foods_ID = f.Foods_ID
    WHERE fl.Users_ID = ?
");
$stmt->bind_param("i", $Users_ID);
$stmt->execute();
$result = $stmt->get_result();

$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = $row;
}

echo json_encode([
    "status" => "success",
    "foodLog" => $logs
]);
?>
