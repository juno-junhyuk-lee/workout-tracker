<?php
require "config.php";
require "utils.php";
allow_cors();

$sql = "SELECT * FROM `Foods`;";
$result = $conn->query($sql);

$foods = [];
while ($row = $result->fetch_assoc()) {
    $foods[] = $row;
}

echo json_encode([
    "status" => "success",
    "foods" => $foods
]);
?>


