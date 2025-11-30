<?php
require "config.php";   // your DB connection
require "utils.php";    // allow_cors(), helpers
allow_cors();

header("Content-Type: application/json");

// If a userId is passed in the request, fetch that user's goals
$userId = isset($_GET['userId']) ? intval($_GET['userId']) : null;

if ($userId !== null) {
    $stmt = $conn->prepare("SELECT * FROM UserCalorieGoals WHERE userId = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "status" => "error",
            "message" => "No calorie goals found for this user."
        ]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "data" => $result->fetch_assoc()
    ]);
    exit;
}

// If no userId provided → return ALL rows
$sql = "SELECT * FROM UserCalorieGoals";
$result = $conn->query($sql);

$rows = [];
while ($row = $result->fetch_assoc()) {
    $rows[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $rows
]);
