import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import { registerUser, loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { login } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length >= 5;
  };

  const isValidPassword = (
    password: string
  ): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }
    return { valid: true };
  };

  const handleLogin = async () => {
    // Trim whitespace
    const email = loginEmail.trim();
    const password = loginPassword.trim();

    // Validate fields
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Proceed with login
    const res = await loginUser(email, password);

    if (res.status === "success") {
      await login(res.user);
      navigation.replace("HomeScreen");
    } else {
      Alert.alert("Login Failed", res.message || "Invalid credentials");
    }
  };

  const handleSignup = async () => {
    // Trim whitespace
    const email = signupEmail.trim();
    const password = signupPassword.trim();
    const fName = firstName.trim();
    const lName = lastName.trim();

    // Validate required fields are not empty
    if (!fName || !lName || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    // Validate first and last name length
    if (fName.length < 2) {
      Alert.alert("Invalid Name", "First name must be at least 2 characters.");
      return;
    }

    if (lName.length < 2) {
      Alert.alert("Invalid Name", "Last name must be at least 2 characters.");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid email address (e.g., user@example.com)."
      );
      return;
    }

    // Validate password strength
    const passwordCheck = isValidPassword(password);
    if (!passwordCheck.valid) {
      Alert.alert(
        "Weak Password",
        passwordCheck.message ||
          "Password must be at least 8 characters with uppercase, lowercase, and number."
      );
      return;
    }

    // Validate age if provided
    const ageNum = age ? Number(age) : null;
    if (age && (isNaN(ageNum!) || ageNum! < 13 || ageNum! > 120)) {
      Alert.alert(
        "Invalid Age",
        "Please enter a valid age between 13 and 120."
      );
      return;
    }

    const res = await registerUser({
      first_name: fName,
      last_name: lName,
      email: email,
      password: password,
      age: ageNum,
      gender: gender.trim() || null,
    });

    if (res.status === "success") {
      Alert.alert("Success", "Account created! Please log in.", [
        { text: "OK", onPress: () => setActiveTab("login") },
      ]);
      // Clear signup form
      setFirstName("");
      setLastName("");
      setSignupEmail("");
      setSignupPassword("");
      setAge("");
      setGender("");
    } else {
      Alert.alert("Signup Failed", res.message || "Could not create account");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.title}>FitTrack</Text>
        <Text style={styles.subtitle}>Your personal fitness companion</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.activeTab]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.activeTabText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "signup" && styles.activeTab]}
            onPress={() => setActiveTab("signup")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "signup" && styles.activeTabText,
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login */}
        {activeTab === "login" && (
          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={setLoginEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={loginPassword}
              onChangeText={setLoginPassword}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.skipSection}>
              <Text style={styles.skipTitle}>Quick Navigation (Dev)</Text>
              <View style={styles.skipButton}>
                <Button
                  title="→ Home"
                  onPress={() => navigation.navigate("HomeScreen")}
                />
              </View>
              <View style={styles.skipButton}>
                <Button
                  title="→ Workout"
                  onPress={() => navigation.navigate("WorkoutScreen")}
                />
              </View>
              <View style={styles.skipButton}>
                <Button
                  title="→ Calories"
                  onPress={() => navigation.navigate("CalorieScreen")}
                />
              </View>
              <View style={styles.skipButton}>
                <Button
                  title="→ Account"
                  onPress={() => navigation.navigate("AccountScreen")}
                />
              </View>
            </View>
          </View>
        )}

        {/* Signup */}
        {activeTab === "signup" && (
          <View style={styles.form}>
            <Text style={styles.label}>First Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
              maxLength={50}
            />

            <Text style={styles.label}>Last Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              value={lastName}
              onChangeText={setLastName}
              maxLength={50}
            />

            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={signupEmail}
              onChangeText={setSignupEmail}
              maxLength={100}
            />

            <Text style={styles.label}>Password *</Text>
            <Text style={styles.passwordHint}>
              Min 8 chars, uppercase, lowercase, number
            </Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={signupPassword}
              onChangeText={setSignupPassword}
            />

            <Text style={styles.label}>Age (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              maxLength={3}
            />

            <Text style={styles.label}>Gender (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Male / Female / Other"
              value={gender}
              onChangeText={setGender}
              maxLength={20}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSignup}
            >
              <Text style={styles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  skipSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  skipTitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 12,
  },
  skipButton: {
    marginBottom: 8,
  },
  screen: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#eee",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
  form: {
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  passwordHint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});