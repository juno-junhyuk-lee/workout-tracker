<?php
require "config.php";
require "utils.php";
allow_cors();

$sql = <<<SQL
CREATE FUNCTION IF NOT EXISTS GetDailyCalories(userId INT, date DATE)
RETURNS INT
DETERMINISTIC
BEGIN
  DECLARE total INT;
  SELECT SUM(Calories) INTO total
  FROM FoodLog
  WHERE Users_ID = userId AND DATE(Date) = date;
  RETURN IFNULL(total, 0);
END
SQL;

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Function created"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
