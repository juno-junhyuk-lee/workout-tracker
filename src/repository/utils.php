<?php
function allow_cors() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        exit();
    }
}

function get_json() {
    $raw = file_get_contents("php://input");
    return json_decode($raw, true);
}
?>
