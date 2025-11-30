<?php
require "config.php";
require "utils.php";

allow_cors();

$data = get_json();

$user_id = $data["user_id"] ?? null;
$email = $data["email"] ?? null;

if (!$user_id || !$email) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing user_id or email"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("CALL ChangeEmail(?, ?)");
    $stmt->bind_param("is", $user_id, $email);
    $stmt->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Email updated"
    ]);
} catch (mysqli_sql_exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
