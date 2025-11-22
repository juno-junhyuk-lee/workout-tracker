import axios from "axios";

const BASE_URL =
  "https://holocrine-shantae-prestricken.ngrok-free.dev/workout-tracker-api";

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
