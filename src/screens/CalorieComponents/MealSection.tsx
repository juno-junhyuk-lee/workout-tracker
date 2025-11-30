import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodItem } from '../../types';

interface MealSectionProps {
  mealName: string;
  targetCalories: number;
  foods: FoodItem[];
  onAddClick: () => void;
}

export function MealSection({ mealName, targetCalories, foods, onAddClick }: MealSectionProps) {
  const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.mealName}>{mealName}</Text>
          <Text style={styles.calorieText}>
            {totalCalories} / {targetCalories} cal
          </Text>
        </View>
        <TouchableOpacity onPress={onAddClick} style={styles.addButton}>
          <Ionicons name="add" size={18} color="#1d1d1f" />
        </TouchableOpacity>
      </View>

      {foods.length > 0 ? (
        <View style={styles.foodList}>
          {foods.map((food, index) => (
            <View
              key={food.id}
              style={[
                styles.foodItem,
                index !== foods.length - 1 && styles.foodItemBorder,
              ]}
            >
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodPortion}>{food.portion}</Text>
              </View>
              <Text style={styles.foodCalories}>{food.calories}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No foods logged yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  calorieText: {
    fontSize: 14,
    color: '#6e6e73',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  foodItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  foodInfo: {},
  foodName: {
    fontSize: 16,
    color: '#1d1d1f',
  },
  foodPortion: {
    fontSize: 14,
    color: '#6e6e73',
    marginTop: 2,
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#86868b',
  },
});