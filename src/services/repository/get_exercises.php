<?php
require "config.php";
require "utils.php";
allow_cors();

$stmt = $conn->prepare("SELECT Exercises_ID, Exercises_Name, Muscle_Group FROM Exercises ORDER BY Exercises_Name");
$stmt->execute();
$result = $stmt->get_result();

$exercises = [];
while ($row = $result->fetch_assoc()) {
    $exercises[] = $row;
}

echo json_encode([
    "status" => "success",
    "exercises" => $exercises
]);
?>