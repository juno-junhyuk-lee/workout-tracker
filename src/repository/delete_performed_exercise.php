<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$performedExercisesId = $data["performedexercises_id"] ?? null;

if (!$performedExercisesId) {
    echo json_encode(["status" => "error", "message" => "Missing performedexercises_id"]);
    exit;
}

// Delete all sets associated with this performed exercise first
$stmt = $conn->prepare("DELETE FROM Sets WHERE PerformedExercises_ID = ?");
$stmt->bind_param("i", $performedExercisesId);
$stmt->execute();

// Then delete the performed exercise
$stmt = $conn->prepare("DELETE FROM PerformedExercises WHERE PerformedExercises_ID = ?");
$stmt->bind_param("i", $performedExercisesId);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Exercise deleted successfully"
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>