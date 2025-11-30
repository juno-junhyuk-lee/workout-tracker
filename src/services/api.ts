import axios from "axios";

const BASE_URL ="https://minerva-unweakening-meteorically.ngrok-free.dev/workout-tracker-api";

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  age: number | null;
  gender: string | null;
}

export interface ApiResponse {
  status: "success" | "error";
  message?: string;
  username?: string;
}

export async function registerUser(payload: RegisterPayload) {
  try {
    const res = await axios.post(`${BASE_URL}/register.php`, payload, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.error("Signup error:", err);
    return { status: "error", message: "Server error" };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/login.php`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    return { status: "error", message: "Server error" };
  }
}

// GET all exercises from master database
export async function getExercises() {
  try {
    const response = await fetch(`${BASE_URL}/get_exercises.php`);
    const data = await response.json();
    if (data.status === 'success') {
      return data.exercises || [];
    }
    throw new Error(data.message || 'Failed to fetch exercises');
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
}

// POST create new workout
export async function createWorkout(usersId: number, workoutsName: string, workoutsDate: string) {
  try {
    const response = await fetch(`${BASE_URL}/create_workout.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users_id: usersId,
        workouts_name: workoutsName,
        workouts_date: workoutsDate,
      }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      return data.workouts_id;
    }
    throw new Error(data.message || 'Failed to create workout');
  } catch (error) {
    console.error('Error creating workout:', error);
    return null;
  }
}

// POST add exercise to workout
export async function addPerformedExercise(workoutsId: number, exercisesId: number) {
  try {
    const response = await fetch(`${BASE_URL}/add_performed_exercise.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workouts_id: workoutsId,
        exercises_id: exercisesId,
      }),
    });
    const data = await response.json();
    if (data.status === 'success') {
      return data.performedexercises_id;
    }
    throw new Error(data.message || 'Failed to add exercise');
  } catch (error) {
    console.error('Error adding exercise:', error);
    return null;
  }
}

// POST add set to performed exercise
export async function addSet(performedExercisesId: number, weight: number, reps: number) {
  try {
    const response = await fetch(`${BASE_URL}/add_set.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performedexercises_id: performedExercisesId,
        sets_weight: weight,
        sets_rep: reps,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Error adding set:', error);
    return false;
  }
}

// GET today's workout details
export async function getTodaysWorkout(usersId: number, date: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/get_workout_details.php?users_id=${usersId}&date=${date}`
    );
    const data = await response.json();
    if (data.status === 'success') {
      return data.workout || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching workout:', error);
    return null;
  }
}

// GET workout history
export async function getWorkoutHistory(usersId: number) {
  try {
    const response = await fetch(
      `${BASE_URL}/get_workout_history.php?users_id=${usersId}`
    );
    const data = await response.json();
    if (data.status === 'success') {
      return data.workouts || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

// DELETE set
export async function deleteSet(setsId: number) {
  try {
    const response = await fetch(`${BASE_URL}/delete_set.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sets_id: setsId,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Error deleting set:', error);
    return false;
  }
}

// DELETE performed exercise
export async function deletePerformedExercise(performedExercisesId: number) {
  try {
    const response = await fetch(`${BASE_URL}/delete_performed_exercise.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        performedexercises_id: performedExercisesId,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Error deleting performed exercise:', error);
    return false;
  }
}

// DELETE workout
export async function deleteWorkout(workoutsId: number) {
  try {
    const response = await fetch(`${BASE_URL}/delete_workout.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workouts_id: workoutsId,
      }),
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
}


//Get Foods 
export async function getFoods() {
  try {
    const response = await fetch(`${BASE_URL}/get_foods.php`);
    const data = await response.json();
    if (data.status === 'success') {
      return data.foods || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting all Foods", error);
    return [];
  }
}

// Get Food Log for a user
export async function getFoodLog(usersId: number) {
  try {
    const response = await fetch(`${BASE_URL}/get_food_log.php?Users_ID=${usersId}`);
    const data = await response.json();
    if (data.status === 'success') {
      return data.foodLog || [];
    }
    return [];
  } catch (error) {
    console.error("Error getting food log", error);
    return [];
  }
}

// Insert a new food item
export async function insertFood(foodsName: string, caloriesPerServing: number, foodsCategory?: string) {
  try {
    const formData = new FormData();
    formData.append('Foods_Name', foodsName);
    formData.append('Calories_Per_Serving', caloriesPerServing.toString());
    if (foodsCategory) formData.append('Foods_Category', foodsCategory);

    const response = await fetch(`${BASE_URL}/insert_foods.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error inserting food", error);
    return false;
  }
}

// Insert a food log entry
export async function insertFoodLog(usersId: number, foodsId: number, foodLogDate: string, servingQuantity: number) {
  try {
    const formData = new FormData();
    formData.append('Users_ID', usersId.toString());
    formData.append('Foods_ID', foodsId.toString());
    formData.append('FoodLog_Date', foodLogDate);
    formData.append('Serving_Quantity', servingQuantity.toString());

    const response = await fetch(`${BASE_URL}/insert_food_log.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error inserting food log", error);
    return false;
  }
}

// Delete a food item
export async function deleteFood(foodsId: number) {
  try {
    const formData = new FormData();
    formData.append('Foods_ID', foodsId.toString());

    const response = await fetch(`${BASE_URL}/delete_foods.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error deleting food", error);
    return false;
  }
}

// Delete a food log entry
export async function deleteFoodLog(foodLogId: number) {
  try {
    const formData = new FormData();
    formData.append('FoodLog_ID', foodLogId.toString());

    const response = await fetch(`${BASE_URL}/delete_food_log.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error deleting food log", error);
    return false;
  }
}

// Update a food item
export async function updateFood(foodsId: number, foodsName: string, caloriesPerServing: number, foodsCategory?: string) {
  try {
    const formData = new FormData();
    formData.append('Foods_ID', foodsId.toString());
    formData.append('Foods_Name', foodsName);
    formData.append('Calories_Per_Serving', caloriesPerServing.toString());
    if (foodsCategory) formData.append('Foods_Category', foodsCategory);

    const response = await fetch(`${BASE_URL}/update_foods.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error updating food", error);
    return false;
  }
}

// Update a food log entry
export async function updateFoodLog(foodLogId: number, usersId: number, foodsId: number, foodLogDate: string, servingQuantity: number) {
  try {
    const formData = new FormData();
    formData.append('FoodLog_ID', foodLogId.toString());
    formData.append('Users_ID', usersId.toString());
    formData.append('Foods_ID', foodsId.toString());
    formData.append('FoodLog_Date', foodLogDate);
    formData.append('Serving_Quantity', servingQuantity.toString());

    const response = await fetch(`${BASE_URL}/update_food_log.php`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error("Error updating food log", error);
    return false;
  }
}





