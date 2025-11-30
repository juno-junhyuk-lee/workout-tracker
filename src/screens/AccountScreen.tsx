import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { updateUserInfo, changeEmail, changeUsername } from "../services/api";

export default function AccountScreen() {
  const { user, logout, updateUser } = useAuth();
  const navigation = useNavigation<any>();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Not logged in</Text>
      </View>
    );
  }

  const initials =
    user.first_name.charAt(0).toUpperCase() +
    user.last_name.charAt(0).toUpperCase();

  const handleChangeEmail = () => {
    Alert.prompt("Change Email", "Enter your new email", async (newEmail) => {
      if (!newEmail || !user) return;

      const res = await changeEmail(user.id, newEmail);

      if (res.status === "success") {
        updateUser({ email: newEmail }); // ✅ REALTIME UPDATE
        Alert.alert("Success", res.message);
      } else {
        Alert.alert("Error", res.message ?? "Failed to update email");
      }
    });
  };

  const handleChangeUsername = () => {
    Alert.prompt("Change Username", "Enter new username", async (username) => {
      if (!username) return;

      const res = await changeUsername(user.id, username);

      if (res.status === "success") {
        Alert.alert("Success", res.message);
      } else {
        Alert.alert("Error", res.message);
      }
    });
  };

  const handleUpdateProfile = () => {
    Alert.prompt(
      "Update Profile",
      "Enter: FirstName,LastName,Age,Gender",
      async (input) => {
        if (!input) return;

        const [first_name, last_name, age, gender] = input.split(",");

        const res = await updateUserInfo({
          user_id: user.id,
          first_name: first_name?.trim() || null,
          last_name: last_name?.trim() || null,
          age: age ? Number(age) : null,
          gender: gender?.trim() || null,
        });

        if (res.status === "success") {
          updateUser({
            first_name: first_name?.trim(),
            last_name: last_name?.trim(),
            age: age ? Number(age) : undefined,
            gender: gender?.trim(),
          });
          Alert.alert("Success", res.message);
        } else {
          Alert.alert("Error", res.message);
        }
      }
    );
  };

  const handleLogout = () => {
    logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "AuthScreen" }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.headerTitle}>Account</Text>
        <Text style={styles.subtitle}>Manage your profile and settings</Text>

        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>

            <View>
              <Text style={styles.userName}>
                {user.first_name} {user.last_name}
              </Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Profile Section */}
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.rowButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.rowText}>Update Personal Info</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.rowButton}
            onPress={handleChangeEmail}
          >
            <Text style={styles.rowText}>Change Email</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.rowButton}
            onPress={handleChangeUsername}
          >
            <Text style={styles.rowText}>Change Username</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>FitTrack v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F3F4F6",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },

  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },

  errorText: {
    fontSize: 13,
    color: "#D32F2F",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "600",
  },

  userName: {
    fontSize: 18,
    fontWeight: "600",
  },

  userEmail: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },

  sectionLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 6,
  },

  rowButton: {
    paddingVertical: 14,
  },

  rowText: {
    fontSize: 15,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
  },

  logoutButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 28,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});
