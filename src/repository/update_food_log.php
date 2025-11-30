<?php
require "config.php";
require "utils.php";
allow_cors();



$FoodLog_ID = $_POST['FoodLog_ID'] ?? null;
$Users_ID = $_POST['Users_ID'] ?? null;
$Foods_ID = $_POST['Foods_ID'] ?? null;
$FoodLog_Date = $_POST['FoodLog_Date'] ?? null;
$Serving_Quantity = $_POST['Serving_Quantity'] ?? null;

if (!$FoodLog_ID || !$Users_ID || !$Foods_ID || !$FoodLog_Date || !$Serving_Quantity) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE FoodLog
    SET Users_ID = ?, Foods_ID = ?, FoodLog_Date = ?, Serving_Quantity = ?
    WHERE FoodLog_ID = ?
");

$stmt->bind_param("iisdi", $Users_ID, $Foods_ID, $FoodLog_Date, $Serving_Quantity, $FoodLog_ID);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Food log updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $conn->error
    ]);
}
?>
