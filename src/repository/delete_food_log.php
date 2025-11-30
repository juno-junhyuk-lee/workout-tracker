<?php
require "config.php";
require "utils.php";
allow_cors();

$FoodLog_ID = $_POST['FoodLog_ID'] ?? null;

if (!$FoodLog_ID) {
    echo json_encode(["status" => "error", "message" => "FoodLog_ID required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM FoodLog WHERE FoodLog_ID = ?");
$stmt->bind_param("i", $FoodLog_ID);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
