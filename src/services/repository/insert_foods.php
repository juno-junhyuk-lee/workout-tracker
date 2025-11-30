<?php
require "config.php";
require "utils.php";
allow_cors();

$Foods_Name = $_POST['Foods_Name'] ?? null;
$Calories = $_POST['Calories_Per_Serving'] ?? null;
$Category = $_POST['Foods_Category'] ?? null;

if (!$Foods_Name || !$Calories) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("
    INSERT INTO Foods (Foods_Name, Calories_Per_Serving, Foods_Category)
    VALUES (?, ?, ?)
");
$stmt->bind_param("sds", $Foods_Name, $Calories, $Category);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
