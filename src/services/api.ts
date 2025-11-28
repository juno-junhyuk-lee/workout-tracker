import axios from "axios";

const BASE_URL =
  "https://sulfitic-hypermetaphoric-legend.ngrok-free.dev/workout-tracker-api";

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