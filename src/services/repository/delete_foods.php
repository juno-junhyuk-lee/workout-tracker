<?php
require "config.php";
require "utils.php";
allow_cors();

$Foods_ID = $_POST['Foods_ID'] ?? null;

if (!$Foods_ID) {
    echo json_encode(["status" => "error", "message" => "Foods_ID required"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM Foods WHERE Foods_ID = ?");
$stmt->bind_param("i", $Foods_ID);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
