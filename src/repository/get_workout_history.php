<?php
require "config.php";
require "utils.php";
allow_cors();

$usersId = $_GET["users_id"] ?? null;

if (!$usersId) {
    echo json_encode(["status" => "error", "message" => "Missing users_id"]);
    exit;
}

// Get all workouts for the user
$stmt = $conn->prepare("
    SELECT 
        w.Workouts_ID,
        w.Workouts_Name,
        w.Workouts_Date
    FROM Workouts w
    WHERE w.Users_ID = ?
    ORDER BY w.Workouts_Date DESC
");
$stmt->bind_param("i", $usersId);
$stmt->execute();
$result = $stmt->get_result();

$workouts = [];
while ($row = $result->fetch_assoc()) {
    $workoutId = $row['Workouts_ID'];
    
    // Get exercises for this workout
    $exStmt = $conn->prepare("
        SELECT 
            pe.PerformedExercises_ID,
            pe.Exercises_ID,
            e.Exercises_Name
        FROM PerformedExercises pe
        JOIN Exercises e ON pe.Exercises_ID = e.Exercises_ID
        WHERE pe.Workouts_ID = ?
        ORDER BY pe.PerformedExercises_ID
    ");
    $exStmt->bind_param("i", $workoutId);
    $exStmt->execute();
    $exResult = $exStmt->get_result();
    
    $exercises = [];
    while ($exRow = $exResult->fetch_assoc()) {
        $performedExId = $exRow['PerformedExercises_ID'];
        
        // Get sets for this exercise
        $setStmt = $conn->prepare("
            SELECT 
                Sets_ID,
                Sets_Weight,
                Sets_Rep
            FROM Sets
            WHERE PerformedExercises_ID = ?
            ORDER BY Sets_ID
        ");
        $setStmt->bind_param("i", $performedExId);
        $setStmt->execute();
        $setResult = $setStmt->get_result();
        
        $sets = [];
        while ($setRow = $setResult->fetch_assoc()) {
            $sets[] = [
                'Sets_ID' => (int)$setRow['Sets_ID'],
                'Sets_Weight' => (float)$setRow['Sets_Weight'],
                'Sets_Rep' => (int)$setRow['Sets_Rep']
            ];
        }
        
        $exercises[] = [
            'PerformedExercises_ID' => (int)$exRow['PerformedExercises_ID'],
            'Exercises_ID' => (int)$exRow['Exercises_ID'],
            'Exercises_Name' => $exRow['Exercises_Name'],
            'sets' => $sets
        ];
    }
    
    $workouts[] = [
        'Workouts_ID' => (int)$row['Workouts_ID'],
        'Workouts_Name' => $row['Workouts_Name'],
        'Workouts_Date' => $row['Workouts_Date'],
        'exercises' => $exercises,
        'exercise_count' => count($exercises)
    ];
}

echo json_encode([
    "status" => "success",
    "workouts" => $workouts
]);
?>