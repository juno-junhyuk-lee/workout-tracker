import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import { registerUser, loginUser } from "../services/api";
import { Alert } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const { login } = useAuth();

  // Signup state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSignup = async () => {
    if (!firstName || !lastName || !signupEmail || !signupPassword) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const res = await registerUser({
      first_name: firstName,
      last_name: lastName,
      email: signupEmail,
      password: signupPassword,
      age: age ? Number(age) : null,
      gender: gender || null,
    });

    if (res.status === "success") {
      Alert.alert("Success", `Account created!\nUsername: ${res.username}`);

      // Optional: auto-switch to login tab
      setActiveTab("login");

      // Optional: clear form
      setFirstName("");
      setLastName("");
      setSignupEmail("");
      setSignupPassword("");
      setAge("");
      setGender("");
    } else {
      Alert.alert("Signup Failed", res.message ?? "Unknown error");
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    const res = await loginUser(loginEmail, loginPassword);

    if (res.status === "success") {
      login(res.user); // ✅ SAVE USER CONTEXT
      navigation.navigate("HomeScreen");
    } else {
      Alert.alert("Login Failed", res.message ?? "Invalid credentials");
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
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={signupEmail}
              onChangeText={setSignupEmail}
            />

            <Text style={styles.label}>Password</Text>
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
            />

            <Text style={styles.label}>Gender (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Male / Female / Other"
              value={gender}
              onChangeText={setGender}
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
    backgroundColor: "#EEF2FF", // soft blue gradient substitute
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
<<<<<<< HEAD
});
=======
});
>>>>>>> homescreen_auth
