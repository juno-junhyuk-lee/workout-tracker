<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$workoutsId = $data["workouts_id"] ?? null;
$exercisesId = $data["exercises_id"] ?? null;

if (!$workoutsId || !$exercisesId) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO PerformedExercises (Workouts_ID, Exercises_ID) VALUES (?, ?)");
$stmt->bind_param("ii", $workoutsId, $exercisesId);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "performedexercises_id" => $conn->insert_id
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>