import { StyleSheet, Text, View } from "react-native";

export default function CalorieScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Screen</Text>
      <Text style={styles.subtitle}>Track your daily nutrition</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});