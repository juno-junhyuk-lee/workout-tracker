<?php
// Load db_config.php if it exists, otherwise use defaults
$configFile = __DIR__ . '/db_config.php';
if (file_exists($configFile)) {
    $config = require $configFile;
} else {
    // Default values for local development
    $config = [
        'host' => 'localhost',
        'user' => 'root',
        'pass' => '',
        'db'   => 'workout_tracker',
    ];
}

$host = $config['host'] ?? 'localhost';
$user = $config['user'] ?? 'root';
$pass = $config['pass'] ?? '';
$db   = $config['db'] ?? 'workout_tracker';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        "status" => "error",
        "message" => "Database connection failed: " . $conn->connect_error
    ]));
}
?>
