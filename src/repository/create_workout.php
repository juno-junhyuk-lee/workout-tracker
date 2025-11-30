<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$usersId = $data["users_id"] ?? null;
$workoutsName = $data["workouts_name"] ?? "";
$workoutsDate = $data["workouts_date"] ?? date('Y-m-d');

if (!$usersId) {
    echo json_encode(["status" => "error", "message" => "Missing users_id"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO Workouts (Users_ID, Workouts_Name, Workouts_Date) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $usersId, $workoutsName, $workoutsDate);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "workouts_id" => $conn->insert_id
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>