<?php
require "config.php";
require "utils.php";
allow_cors();

$Users_ID = $_POST['Users_ID'] ?? null;
$Foods_ID = $_POST['Foods_ID'] ?? null;
$FoodLog_Date = $_POST['FoodLog_Date'] ?? null;
$Serving_Quantity = $_POST['Serving_Quantity'] ?? null;
$Meal_Type = $_POST['Meal_Type'] ?? 'Snacks';

if (!$Users_ID || !$Foods_ID || !$FoodLog_Date || !$Serving_Quantity) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO FoodLog (Users_ID, Foods_ID, FoodLog_Date, Serving_Quantity, Meal_Type)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("iisds", $Users_ID, $Foods_ID, $FoodLog_Date, $Serving_Quantity, $Meal_Type);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
