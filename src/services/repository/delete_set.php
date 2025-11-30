<?php
require "config.php";
require "utils.php";
allow_cors();

$data = get_json();

$setsId = $data["sets_id"] ?? null;

if (!$setsId) {
    echo json_encode(["status" => "error", "message" => "Missing sets_id"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM Sets WHERE Sets_ID = ?");
$stmt->bind_param("i", $setsId);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Set deleted successfully"
    ]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>