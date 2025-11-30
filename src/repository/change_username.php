<?php
require "config.php";
require "utils.php";

allow_cors();

$data = get_json();

$user_id = $data["user_id"] ?? null;
$username = $data["username"] ?? null;

if (!$user_id || !$username) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing user_id or username"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("CALL ChangeUsername(?, ?)");
    $stmt->bind_param("is", $user_id, $username);
    $stmt->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Username updated"
    ]);
} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
