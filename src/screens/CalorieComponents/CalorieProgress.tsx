import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CalorieProgressProps {
  consumed: number;
  goal: number;
}

export function CalorieProgress({ consumed, goal }: CalorieProgressProps) {
  const percentage = Math.min((consumed / goal) * 100, 100);
  const remaining = Math.max(goal - consumed, 0);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Svg width={176} height={176} viewBox="0 0 160 160" style={styles.svg}>
          {/* Background circle */}
          <Circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#f2f2f7"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <Circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#1d1d1f"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin="80, 80"
          />
        </Svg>
        <View style={styles.centerContent}>
          <Text style={styles.consumedText}>{consumed.toLocaleString()}</Text>
          <Text style={styles.caloriesLabel}>calories</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.remainingText}>
          {remaining > 0 ? `${remaining.toLocaleString()} remaining` : 'Goal reached!'}
        </Text>
        <Text style={styles.goalText}>of {goal.toLocaleString()} goal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  progressContainer: {
    width: 176,
    height: 176,
    position: 'relative',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consumedText: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#6e6e73',
    marginTop: 4,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  remainingText: {
    fontSize: 16,
    color: '#6e6e73',
  },
  goalText: {
    fontSize: 14,
    color: '#86868b',
    marginTop: 4,
  },
});
