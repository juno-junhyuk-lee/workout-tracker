import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Tab {
  name: string;
  label: string;
  icon: string;
}

export default function FooterNavigation() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  const tabs: Tab[] = [
    { name: 'HomeScreen', label: 'Home', icon: '🏠' },
    { name: 'WorkoutScreen', label: 'Workout', icon: '💪' },
    { name: 'CalorieScreen', label: 'Calories', icon: '🍽️' },
    { name: 'AccountScreen', label: 'Account', icon: '👤' }
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => navigation.navigate(tab.name)}
        >
          <Text style={[
            styles.icon,
            route.name === tab.name && styles.activeIcon
          ]}>
            {tab.icon}
          </Text>
          <Text style={[
            styles.label,
            route.name === tab.name && styles.activeLabel
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#000',
    fontWeight: '600',
  },
});