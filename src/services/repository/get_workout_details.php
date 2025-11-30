<?php
require "config.php";
require "utils.php";
allow_cors();

$usersId = $_GET["users_id"] ?? null;
$date = $_GET["date"] ?? date('Y-m-d');

if (!$usersId) {
    echo json_encode(["status" => "error", "message" => "Missing users_id"]);
    exit;
}

// Get workout for this date
$stmt = $conn->prepare("SELECT Workouts_ID, Workouts_Name, Workouts_Date FROM Workouts WHERE Users_ID = ? AND Workouts_Date = ?");
$stmt->bind_param("is", $usersId, $date);
$stmt->execute();
$result = $stmt->get_result();
$workout = $result->fetch_assoc();

if (!$workout) {
    echo json_encode(["status" => "success", "workout" => null]);
    exit;
}

// Get performed exercises
$stmt2 = $conn->prepare("
    SELECT pe.PerformedExercises_ID, pe.Exercises_ID, e.Exercises_Name
    FROM PerformedExercises pe
    JOIN Exercises e ON pe.Exercises_ID = e.Exercises_ID
    WHERE pe.Workouts_ID = ?
");
$stmt2->bind_param("i", $workout['Workouts_ID']);
$stmt2->execute();
$result2 = $stmt2->get_result();

$exercises = [];
while ($row = $result2->fetch_assoc()) {
    // Get sets for this exercise
    $stmt3 = $conn->prepare("SELECT Sets_ID, Sets_Weight, Sets_Rep FROM Sets WHERE PerformedExercises_ID = ?");
    $stmt3->bind_param("i", $row['PerformedExercises_ID']);
    $stmt3->execute();
    $result3 = $stmt3->get_result();
    
    $sets = [];
    while ($set = $result3->fetch_assoc()) {
        $sets[] = $set;
    }
    
    $row['sets'] = $sets;
    $exercises[] = $row;
}

$workout['exercises'] = $exercises;

echo json_encode([
    "status" => "success",
    "workout" => $workout
]);
?>