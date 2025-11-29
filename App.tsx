import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";
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
      <View style={styles.content}>
        {children}
      </View>
      {showFooter && <FooterNavigation />}
    </View>
  );
}

const WorkoutScreenWithFooter = ({ route, navigation }: any) => (
  <ScreenWrapper showFooter={true}>
    <WorkoutScreen route={route} navigation={navigation} />
  </ScreenWrapper>
);
const HomeScreenWithFooter = () => (
  <ScreenWrapper showFooter={true}>
    <HomeScreen />
  </ScreenWrapper>
);

const CalorieScreenWithFooter = ({ route, navigation }: any) => (
  <ScreenWrapper showFooter={true}>
    <CalorieScreen route={route} navigation={navigation} />
  </ScreenWrapper>
);

const AccountScreenWithFooter = ({ route, navigation }: any) => (
  <ScreenWrapper showFooter={true}>
    <AccountScreen route={route} navigation={navigation} />
  </ScreenWrapper>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreenWithFooter} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreenWithFooter} />
        <Stack.Screen name="CalorieScreen" component={CalorieScreenWithFooter} />
        <Stack.Screen name="AccountScreen" component={AccountScreenWithFooter} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});