<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$workoutsId = $data["workouts_id"] ?? null;

if (!$workoutsId) {
    echo json_encode(["status" => "error", "message" => "Missing workouts_id"]);
    exit;
}

// Get all performed exercises for this workout
$stmt = $conn->prepare("SELECT PerformedExercises_ID FROM PerformedExercises WHERE Workouts_ID = ?");
$stmt->bind_param("i", $workoutsId);
$stmt->execute();
$result = $stmt->get_result();

// Delete all sets for each performed exercise
while ($row = $result->fetch_assoc()) {
    $delSets = $conn->prepare("DELETE FROM Sets WHERE PerformedExercises_ID = ?");
    $delSets->bind_param("i", $row['PerformedExercises_ID']);
    $delSets->execute();
}

// Delete all performed exercises
$stmt = $conn->prepare("DELETE FROM PerformedExercises WHERE Workouts_ID = ?");
$stmt->bind_param("i", $workoutsId);
$stmt->execute();

// Finally delete the workout
$stmt = $conn->prepare("DELETE FROM Workouts WHERE Workouts_ID = ?");
$stmt->bind_param("i", $workoutsId);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Workout deleted successfully"
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>