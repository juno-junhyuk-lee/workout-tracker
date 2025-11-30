import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroCardProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export function MacroCard({ label, current, goal, unit, color }: MacroCardProps) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {current}
        <Text style={styles.goalText}>/{goal}{unit}</Text>
      </Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    borderRadius: 16,
    padding: 12,
  },
  label: {
    fontSize: 12,
    color: '#6e6e73',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  goalText: {
    color: '#86868b',
    fontWeight: '400',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'white',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
