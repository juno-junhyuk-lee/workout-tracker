<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

echo json_encode([
    "status" => "success",
    "message" => "Workout Tracker API is running",
    "endpoints" => [
        "POST /login.php" => "User login",
        "POST /register.php" => "User registration",
        "POST /change_email.php" => "Change user email",
        "POST /change_username.php" => "Change username",
        "POST /update_user.php" => "Update user profile",
        "POST /update_calorie_goals.php" => "Update calorie goals",
        "POST /insert_food_log.php" => "Add food log entry",
        "POST /delete_food_log.php" => "Delete food log entry",
        "POST /insert_foods.php" => "Add new food",
        "POST /update_foods.php" => "Update food",
        "POST /create_workout.php" => "Create workout",
        "POST /add_set.php" => "Add set to workout",
        "POST /delete_workout.php" => "Delete workout",
        "GET /get_foods.php" => "Get all foods",
        "GET /get_exercises.php" => "Get all exercises",
        "GET /get_food_log.php?Users_ID={id}" => "Get food log for user",
        "GET /get_workout_history.php?users_id={id}" => "Get workout history",
        "GET /get_workout_details.php?workout_id={id}" => "Get workout details",
        "GET /home_summary.php?user_id={id}" => "Get home summary stats"
    ]
]);
?>
