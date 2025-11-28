import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    const response = await loginUser(email, password);

    if (response.status === "success") {
      const userId = response.user.id;
      Alert.alert(
        "Welcome!",
        `Logged in as ${response.user.first_name} ${response.user.last_name} (ID: ${userId})`
      );

      console.log("User data:", response.user);
      
      navigation.navigate("WorkoutScreen", { userId: userId });
      // TODO: navigate to homepage
      // navigation.navigate("Home", { user: response.user });
    } else {
      Alert.alert("Login Failed", response.message ?? "Invalid credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Log In" onPress={handleLogin} />

      <View style={styles.skipSection}>
        <Text style={styles.skipTitle}>Quick Navigation (Dev)</Text>
        <View style={styles.skipButton}>
          <Button title="→ Home" onPress={() => navigation.navigate("HomeScreen")} />
        </View>
        {/* <View style={styles.skipButton}>
          <Button title="→ Workout" onPress={() => navigation.navigate("WorkoutScreen", { userId: 1 })} />
        </View> */}
        <View style={styles.skipButton}>
          <Button title="→ Calories" onPress={() => navigation.navigate("CalorieScreen")} />
        </View>
        <View style={styles.skipButton}>
          <Button title="→ Account" onPress={() => navigation.navigate("AccountScreen")} />
        </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
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
});