import { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalorieProgress } from './CalorieComponents/CalorieProgress';
import { MacroCard } from './CalorieComponents/MacroCard';
import { MealSection } from './CalorieComponents/MealSection';
import { AddFoodModal } from './CalorieComponents/AddFoodModal';
import { FoodDetailModal } from './CalorieComponents/FoodDetailModal';
import type { FoodItem, FoodDatabaseItem, Meal, MacroData } from '../types';


export function CalorieTracker() {
  const [activeTab, setActiveTab] = useState('calories');
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isFoodDetailModalOpen, setIsFoodDetailModalOpen] = useState(false);
  const [selectedMealIndex, setSelectedMealIndex] = useState<number | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);

  const calorieData = {
    consumed: 1842,
    goal: 2200,
  };

  const macros: MacroData[] = [
    { label: 'Protein', current: 78, goal: 165, unit: 'g', color: '#ff6b6b' },
    { label: 'Carbs', current: 142, goal: 220, unit: 'g', color: '#4ecdc4' },
    { label: 'Fat', current: 58, goal: 73, unit: 'g', color: '#ffd93d' },
  ];

  const [meals, setMeals] = useState<Meal[]>([
    {
      mealName: 'Breakfast',
      targetCalories: 550,
      foods: [
        { id: '1', name: 'Oatmeal with berries', calories: 320, portion: '1 bowl' },
        { id: '2', name: 'Greek yogurt', calories: 150, portion: '170g' },
        { id: '3', name: 'Coffee with milk', calories: 35, portion: '1 cup' },
      ],
    },
    {
      mealName: 'Lunch',
      targetCalories: 700,
      foods: [
        { id: '4', name: 'Grilled chicken salad', calories: 425, portion: '350g' },
        { id: '5', name: 'Whole grain bread', calories: 140, portion: '2 slices' },
      ],
    },
    {
      mealName: 'Dinner',
      targetCalories: 700,
      foods: [
        { id: '6', name: 'Salmon fillet', calories: 380, portion: '200g' },
        { id: '7', name: 'Brown rice', calories: 215, portion: '1 cup' },
        { id: '8', name: 'Steamed broccoli', calories: 55, portion: '150g' },
      ],
    },
    {
      mealName: 'Snacks',
      targetCalories: 250,
      foods: [
        { id: '9', name: 'Apple', calories: 95, portion: '1 medium' },
        { id: '10', name: 'Almonds', calories: 164, portion: '28g' },
      ],
    },
  ]);

  const handleOpenAddFood = (mealIndex: number) => {
    setSelectedMealIndex(mealIndex);
    setIsAddFoodModalOpen(true);
  };

  const handleSelectFood = (food: FoodDatabaseItem) => {
    setSelectedFood(food);
    setIsFoodDetailModalOpen(true);
  };

  const handleAddFood = (food: FoodDatabaseItem, servings: number) => {
    if (selectedMealIndex === null) return;

    const newFood: FoodItem = {
      id: `${Date.now()}`,
      name: food.name,
      calories: Math.round(food.calories * servings),
      portion: servings === 1 ? food.portion : `${servings} × ${food.portion}`,
    };

    setMeals(prevMeals => {
      const updatedMeals = [...prevMeals];
      updatedMeals[selectedMealIndex] = {
        ...updatedMeals[selectedMealIndex],
        foods: [...updatedMeals[selectedMealIndex].foods, newFood],
      };
      return updatedMeals;
    });

    // Close both modals
    setIsFoodDetailModalOpen(false);
    setIsAddFoodModalOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Calories</Text>
          <Text style={styles.subtitle}>Sunday, October 12</Text>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <CalorieProgress consumed={calorieData.consumed} goal={calorieData.goal} />
        </View>

        <View style={styles.macrosSection}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <View style={styles.macrosContainer}>
            {macros.map((macro) => (
              <MacroCard
                key={macro.label}
                label={macro.label}
                current={macro.current}
                goal={macro.goal}
                unit={macro.unit}
                color={macro.color}
              />
            ))}
          </View>
        </View>


        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Meals</Text>
          {meals.map((meal, index) => (
            <MealSection
              key={meal.mealName}
              mealName={meal.mealName}
              targetCalories={meal.targetCalories}
              foods={meal.foods}
              onAddClick={() => handleOpenAddFood(index)}
            />
          ))}
        </View>

      </ScrollView>

      <AddFoodModal
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
        onSelectFood={handleSelectFood}
        mealName={selectedMealIndex !== null ? meals[selectedMealIndex].mealName : ''}
      />

      <FoodDetailModal
        isOpen={isFoodDetailModalOpen}
        onClose={() => setIsFoodDetailModalOpen(false)}
        onAdd={handleAddFood}
        food={selectedFood}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1d1d1f',
  },
  subtitle: {
    fontSize: 16,
    color: '#6e6e73',
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  macrosSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  mealsSection: {},
});

export default CalorieTracker;