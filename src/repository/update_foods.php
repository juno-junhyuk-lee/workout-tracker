<?php
require "config.php";
require "utils.php";
allow_cors();

/*
Required fields:
- Foods_ID
- Foods_Name
- Calories_Per_Serving
Optional:
- Foods_Category
*/

$Foods_ID = $_POST['Foods_ID'] ?? null;
$Foods_Name = $_POST['Foods_Name'] ?? null;
$Calories = $_POST['Calories_Per_Serving'] ?? null;
$Category = $_POST['Foods_Category'] ?? null;

if (!$Foods_ID || !$Foods_Name || !$Calories) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE Foods
    SET Foods_Name = ?, Calories_Per_Serving = ?, Foods_Category = ?
    WHERE Foods_ID = ?
");

$stmt->bind_param("sdsi", $Foods_Name, $Calories, $Category, $Foods_ID);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Food updated successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $conn->error
    ]);
}
?>
