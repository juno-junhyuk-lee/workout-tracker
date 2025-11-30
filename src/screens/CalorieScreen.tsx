import { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalorieProgress } from './CalorieComponents/CalorieProgress';
import { MacroCard } from './CalorieComponents/MacroCard';
import { MealSection } from './CalorieComponents/MealSection';
import { AddFoodModal } from './CalorieComponents/AddFoodModal';
import { FoodDetailModal } from './CalorieComponents/FoodDetailModal';
import { getFoods, getFoodLog, insertFoodLog, deleteFoodLog } from '../services/api';
import type { FoodDatabaseItem, FoodLogItem, MacroData } from '../types';


// TODO: Get this from user context/auth
const CURRENT_USER_ID = 1;

export function CalorieTracker() {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isFoodDetailModalOpen, setIsFoodDetailModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);
  const [foodLog, setFoodLog] = useState<FoodLogItem[]>([]);
  const [foods, setFoods] = useState<FoodDatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Fetch foods and food log on mount
  useEffect(() => {
    loadData();
  }, []);

  // Open FoodDetailModal when a food is selected
  useEffect(() => {
    if (selectedFood) {
      setIsFoodDetailModalOpen(true);
    }
  }, [selectedFood]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodsData, foodLogData] = await Promise.all([
        getFoods(),
        getFoodLog(CURRENT_USER_ID)
      ]);
      setFoods(foodsData);
      // Filter food log for today
      const todayLog = foodLogData.filter((item: FoodLogItem) => 
        item.FoodLog_Date === today
      );
      setFoodLog(todayLog);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals from food log
  const totalCalories = foodLog.reduce((sum, item) => 
    sum + (item.Calories_Per_Serving * item.Serving_Quantity), 0
  );

  const calorieGoal = 2200; //TODO: Get From user settings 

  const macros: MacroData[] = [
    { label: 'Protein', current: 0, goal: 165, unit: 'g', color: '#ff6b6b' },
    { label: 'Carbs', current: 0, goal: 220, unit: 'g', color: '#4ecdc4' },
    { label: 'Fat', current: 0, goal: 73, unit: 'g', color: '#ffd93d' },
  ];

  //Todo: Add groupings depednant on settings
  const meals = [
    { mealName: 'Breakfast', targetCalories: 550, foods: foodLog },
    { mealName: 'Lunch', targetCalories: 700, foods: [] as FoodLogItem[] },
    { mealName: 'Dinner', targetCalories: 700, foods: [] as FoodLogItem[] },
    { mealName: 'Snacks', targetCalories: 250, foods: [] as FoodLogItem[] },
  ];

  const handleOpenAddFood = (mealIndex: number) => {
    setSelectedMealType(meals[mealIndex].mealName);
    setIsAddFoodModalOpen(true);
  };

  const handleSelectFood = (food: FoodDatabaseItem) => {
    setIsAddFoodModalOpen(false);
    setSelectedFood(food); 
  };

  const handleAddFood = async (food: FoodDatabaseItem, servings: number) => {
    try {
      const success = await insertFoodLog(
        CURRENT_USER_ID,
        food.Foods_ID,
        today,
        servings
      );
      if (success) {
        // Reload food log
        await loadData();
      }
    } catch (error) {
      console.error('Error adding food:', error);
    }

    // Close both modals and clear selection
    setIsFoodDetailModalOpen(false);
    setIsAddFoodModalOpen(false);
    setSelectedFood(null);
  };

  const handleCloseFoodDetail = () => {
    setIsFoodDetailModalOpen(false);
    setSelectedFood(null);
  };

  const handleDeleteFood = async (foodLogId: number) => {
    try {
      const success = await deleteFoodLog(foodLogId);
      if (success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

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
          <CalorieProgress consumed={totalCalories} goal={calorieGoal} />
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
        mealName={selectedMealType}
        foods={foods}
      />

      <FoodDetailModal
        isOpen={isFoodDetailModalOpen}
        onClose={handleCloseFoodDetail}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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