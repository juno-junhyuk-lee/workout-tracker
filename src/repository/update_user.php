<?php
require "config.php";
require "utils.php";

allow_cors();

$data = get_json();

$user_id = $data["user_id"] ?? null;

if (!$user_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing user_id"
    ]);
    exit;
}

/*
 If frontend doesn't send a field,
 send NULL → procedure won't update it
*/
$first_name = $data["first_name"] ?? null;
$last_name  = $data["last_name"] ?? null;
$email      = $data["email"] ?? null;
$username   = $data["username"] ?? null;
$age        = $data["age"] ?? null;
$gender     = $data["gender"] ?? null;

$stmt = $conn->prepare("CALL UpdateUserInfo(?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param(
    "issssis",
    $user_id,
    $first_name,
    $last_name,
    $email,
    $username,
    $age,
    $gender
);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    echo json_encode([
        "status" => $row["Success"] ? "success" : "error",
        "message" => $row["Message"]
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => $stmt->error
    ]);
}
