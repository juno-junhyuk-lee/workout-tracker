import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet } from "react-native";
import AuthScreen from "./src/screens/AuthScreen";
import WorkoutScreen from "./src/screens/WorkoutScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalorieScreen from "./src/screens/CalorieScreen";
import AccountScreen from "./src/screens/AccountScreen";
import FooterNavigation from "./src/components/FooterNavigation";

const Stack = createNativeStackNavigator();

interface ScreenWrapperProps {
  children: React.ReactNode;
  showFooter: boolean;
}

function ScreenWrapper({ children, showFooter }: ScreenWrapperProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      {showFooter && <FooterNavigation />}
    </View>
  );
}

const HomeScreenWithFooter = () => (
  <ScreenWrapper showFooter={true}>
    <HomeScreen />
  </ScreenWrapper>
);
const WorkoutScreenWithFooter = () => (
  <ScreenWrapper showFooter={true}>
    <WorkoutScreen />
  </ScreenWrapper>
);
const CalorieScreenWithFooter = () => (
  <ScreenWrapper showFooter={true}>
    <CalorieScreen />
  </ScreenWrapper>
);
const AccountScreenWithFooter = () => (
  <ScreenWrapper showFooter={true}>
    <AccountScreen />
  </ScreenWrapper>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthScreen" component={AuthScreen} />

        <Stack.Screen name="HomeScreen" component={HomeScreenWithFooter} />
        <Stack.Screen
          name="WorkoutScreen"
          component={WorkoutScreenWithFooter}
        />
        <Stack.Screen
          name="CalorieScreen"
          component={CalorieScreenWithFooter}
        />
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreenWithFooter}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
