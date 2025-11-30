<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$performedExercisesId = $data["performedexercises_id"] ?? null;
$setsWeight = $data["sets_weight"] ?? null;
$setsRep = $data["sets_rep"] ?? null;

if (!$performedExercisesId || !$setsWeight || !$setsRep) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Sets (PerformedExercises_ID, Sets_Weight, Sets_Rep) VALUES (?, ?, ?)");
$stmt->bind_param("idi", $performedExercisesId, $setsWeight, $setsRep);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "sets_id" => $conn->insert_id
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>