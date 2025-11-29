import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { registerUser } from "../services/api";

export default function SignupScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const response = await registerUser({
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      age: age ? Number(age) : null,
      gender: gender || null,
    });

    if (response.status === "success") {
      Alert.alert(
        "Success",
        `Account created!\nYour username: ${response.username}`
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAge("");
      setGender("");
    } else {
      Alert.alert("Error", response.message ?? "Signup failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Age (optional)"
        value={age}
        keyboardType="numeric"
        onChangeText={setAge}
      />

      <TextInput
        style={styles.input}
        placeholder="Gender (optional)"
        value={gender}
        onChangeText={setGender}
      />

      <Button title="Sign Up" onPress={handleSignup} />

      <View style={styles.backRow}>
        <Text style={styles.backLink} onPress={() => navigation.navigate("LoginScreen")}>
          Back to Login
        </Text>
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
  backRow: {
    marginTop: 20,
    alignItems: "center",
  },
  backLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
