<?php
require "config.php";
require "utils.php";

ini_set('display_errors', 0);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
$today   = date('Y-m-d');

$todayWorkout = [
    'exercises'       => 0,
    'totalSets'       => 0,
    'durationMinutes' => 0,
    'completed'       => false,
];

$todayCalories = [
    'consumed' => 0,
    'goal'     => 0,
];

$weeklyStats = [
    'workoutsCompleted' => 0,
    'workoutsTarget'    => 7,
    'avgCalories'       => 0,
];

$dailyStats = [];

$start   = date('Y-m-d', strtotime('-6 days', strtotime($today)));
$startTs = strtotime($start);
$todayTs = strtotime($today);

for ($ts = $startTs; $ts <= $todayTs; $ts = strtotime('+1 day', $ts)) {
    $date  = date('Y-m-d', $ts);
    $label = date('D', $ts);

    $dailyStats[$date] = [
        'label'          => $label,
        'workoutMinutes' => 0,
        'calories'       => 0,
        'sets'           => 0,
        'exercises'      => 0,
    ];
}

// Workout stats per day
$sql = "SELECT 
            w.Workouts_Date,
            COUNT(DISTINCT pe.PerformedExercises_ID) AS exercises,
            COUNT(s.Sets_ID) AS total_sets
        FROM workouts w
        LEFT JOIN performedexercises pe ON pe.Workouts_ID = w.Workouts_ID
        LEFT JOIN sets s ON s.PerformedExercises_ID = pe.PerformedExercises_ID
        WHERE w.Users_ID = ? AND w.Workouts_Date BETWEEN ? AND ?
        GROUP BY w.Workouts_Date
        ORDER BY w.Workouts_Date ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $start, $today);
$stmt->execute();
$res = $stmt->get_result();

$mostRecentDateWithSets = null;

while ($row = $res->fetch_assoc()) {
    $date  = $row['Workouts_Date'];
    $sets  = (int)$row['total_sets'];
    $exers = (int)$row['exercises'];

    if (!isset($dailyStats[$date])) {
        continue;
    }

    $minutes = $sets * 5;

    $dailyStats[$date]['sets']           = $sets;
    $dailyStats[$date]['exercises']      = $exers;
    $dailyStats[$date]['workoutMinutes'] = $minutes;

    if ($sets > 0) {
        $mostRecentDateWithSets = $date;
    }
}

// Calories per day
$totalWeekCalories = 0;

$calSql = "SELECT 
              fl.FoodLog_Date,
              SUM(f.Calories_Per_Serving * fl.Serving_Quantity) AS total_calories
           FROM FoodLog fl
           INNER JOIN Foods f ON f.Foods_ID = fl.Foods_ID
           WHERE fl.Users_ID = ? AND fl.FoodLog_Date BETWEEN ? AND ?
           GROUP BY fl.FoodLog_Date
           ORDER BY fl.FoodLog_Date ASC";
$stmt = $conn->prepare($calSql);
$stmt->bind_param("iss", $user_id, $start, $today);
$stmt->execute();
$calRes = $stmt->get_result();

while ($row = $calRes->fetch_assoc()) {
    $date  = $row['FoodLog_Date'];
    $cals  = (float)$row['total_calories'];

    if (!isset($dailyStats[$date])) {
        continue;
    }

    $dailyStats[$date]['calories'] = $cals;
    $totalWeekCalories += $cals;
}

// Weekly stats calculations
$workoutDays     = 0;
$weeklyTotalSets = 0;

foreach ($dailyStats as $info) {
    if ($info['sets'] > 0) {
        $workoutDays++;
    }
    $weeklyTotalSets += $info['sets'];
}

$weeklyStats['workoutsCompleted'] = $weeklyTotalSets;  
$weeklyStats['workoutDays']       = $workoutDays;

// average calories over the 7-day window
$weeklyStats['avgCalories'] = $totalWeekCalories > 0
    ? (int) round($totalWeekCalories / 7)
    : 0;

// Today's calorie info
if (isset($dailyStats[$today])) {
    $todayCalories['consumed'] = (int) round($dailyStats[$today]['calories']);
}

// daily goal from UserCalorieGoals 
$goalSql = "SELECT Daily_Goal FROM UserCalorieGoals WHERE Users_ID = ? LIMIT 1";
$stmt = $conn->prepare($goalSql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$goalRes = $stmt->get_result();

if ($goalRow = $goalRes->fetch_assoc()) {
    $todayCalories['goal'] = (int)$goalRow['Daily_Goal'];
} else {
    $todayCalories['goal'] = 2000;
}

// Today's workout info
if (isset($dailyStats[$today]) && $dailyStats[$today]['sets'] > 0) {
    $info = $dailyStats[$today];
    $todayWorkout['exercises']       = $info['exercises'];
    $todayWorkout['totalSets']       = $info['sets'];
    $todayWorkout['durationMinutes'] = $info['workoutMinutes'];
    $todayWorkout['completed']       = $info['exercises'] > 0;
} elseif ($mostRecentDateWithSets !== null) {
    $info = $dailyStats[$mostRecentDateWithSets];
    $todayWorkout['exercises']       = $info['exercises'];
    $todayWorkout['totalSets']       = $info['sets'];
    $todayWorkout['durationMinutes'] = $info['workoutMinutes'];
    $todayWorkout['completed']       = $info['exercises'] > 0;
}

$dailyStatsArray = [];
foreach ($dailyStats as $date => $info) {
    $dailyStatsArray[] = [
        'label'          => $info['label'],
        'workoutMinutes' => $info['workoutMinutes'],
        'calories'       => $info['calories'],
    ];
}

$monthlyStats = [];

// first day of month 6 months ago
$monthStart = date('Y-m-01', strtotime('-6 months', strtotime($today)));
$monthEnd   = $today;

$monthTs        = strtotime($monthStart);
$currentMonthTs = strtotime(date('Y-m-01', strtotime($today)));

for ($ts = $monthTs; $ts <= $currentMonthTs; $ts = strtotime('+1 month', $ts)) {
    $key   = date('Y-m', $ts);
    $label = date('M', $ts);

    $monthlyStats[$key] = [
        'label'     => $label,
        'totalSets' => 0,
    ];
}

$sql = "SELECT 
            DATE_FORMAT(w.Workouts_Date, '%Y-%m') AS ym,
            COUNT(s.Sets_ID) AS total_sets
        FROM workouts w
        LEFT JOIN performedexercises pe ON pe.Workouts_ID = w.Workouts_ID
        LEFT JOIN sets s ON s.PerformedExercises_ID = pe.PerformedExercises_ID
        WHERE w.Users_ID = ? AND w.Workouts_Date BETWEEN ? AND ?
        GROUP BY ym
        ORDER BY ym ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $user_id, $monthStart, $monthEnd);
$stmt->execute();
$res = $stmt->get_result();

while ($row = $res->fetch_assoc()) {
    $key  = $row['ym'];
    $sets = (int)$row['total_sets'];

    if (!isset($monthlyStats[$key])) {
        continue;
    }
    $monthlyStats[$key]['totalSets'] = $sets;
}

$monthlyStatsArray = [];
foreach ($monthlyStats as $info) {
    $monthlyStatsArray[] = [
        'label'     => $info['label'],
        'totalSets' => $info['totalSets'],
    ];
}

echo json_encode([
    'todayWorkout'  => $todayWorkout,
    'todayCalories' => $todayCalories,
    'weeklyStats'   => $weeklyStats,
    'dailyStats'    => $dailyStatsArray,
    'monthlyStats'  => $monthlyStatsArray,
]);
