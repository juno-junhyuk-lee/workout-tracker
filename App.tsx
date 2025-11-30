import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";

import AuthScreen from "./src/screens/AuthScreen";
import WorkoutScreen from "./src/screens/WorkoutScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalorieScreen from "./src/screens/CalorieScreen";
import AccountScreen from "./src/screens/AccountScreen";
import FooterNavigation from "./src/components/FooterNavigation";

const Stack = createNativeStackNavigator();

function ScreenWrapper({ children, showFooter }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {showFooter && <FooterNavigation />}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          <Stack.Screen name="HomeScreen">
            {() => (
              <ScreenWrapper showFooter>
                <HomeScreen />
              </ScreenWrapper>
            )}
          </Stack.Screen>
          <Stack.Screen name="WorkoutScreen">
            {() => (
              <ScreenWrapper showFooter>
                <WorkoutScreen />
              </ScreenWrapper>
            )}
          </Stack.Screen>
          <Stack.Screen name="CalorieScreen">
            {() => (
              <ScreenWrapper showFooter>
                <CalorieScreen />
              </ScreenWrapper>
            )}
          </Stack.Screen>
          <Stack.Screen name="AccountScreen">
            {() => (
              <ScreenWrapper showFooter>
                <AccountScreen />
              </ScreenWrapper>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
