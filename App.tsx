import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
import WorkoutScreen from "./src/screens/WorkoutScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalorieScreen from "./src/screens/CalorieScreen";
import AccountScreen from "./src/screens/AccountScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="CalorieScreen" component={CalorieScreen} />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}