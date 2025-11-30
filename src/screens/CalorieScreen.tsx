import { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CalorieProgress } from './CalorieComponents/CalorieProgress';
import { MealSection } from './CalorieComponents/MealSection';
import { AddFoodModal } from './CalorieComponents/AddFoodModal';
import { FoodDetailModal } from './CalorieComponents/FoodDetailModal';
import { CalorieSettingsModal } from './CalorieComponents/CalorieSettingsModal';
import { getFoods, getFoodLog, insertFoodLog, deleteFoodLog, updateFoodLog, getCalorieGoals, updateCalorieGoals, getDailyCalories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { FoodDatabaseItem, FoodLogItem, MacroData } from '../types';

// Calorie goals type
interface CalorieGoals {
  userId: number;
  dailyGoal: number;
  breakfast: number | null;
  lunch: number | null;
  dinner: number | null;
  snacks: number | null;
}

export function CalorieTracker() {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;

  // Default goals
  const DEFAULT_GOALS: CalorieGoals = {
    userId: currentUserId,
    dailyGoal: 2000,
    breakfast: 600,
    lunch: 600,
    dinner: 600,
    snacks: 200,
  };

  // Dictionary mapping meal type to list of foods
  type MealFoodsMap = Record<string, FoodLogItem[]>;

  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isFoodDetailModalOpen, setIsFoodDetailModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodDatabaseItem | null>(null);
  const [selectedFoodLog, setSelectedFoodLog] = useState<FoodLogItem | null>(null);
  const [foods, setFoods] = useState<FoodDatabaseItem[]>([]);
  const [calorieGoals, setCalorieGoals] = useState<CalorieGoals>(DEFAULT_GOALS);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Dictionary: { "Breakfast": [...foods], "Lunch": [...foods], etc. }
  const [mealFoods, setMealFoods] = useState<MealFoodsMap>({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
  });

  const today = new Date().toISOString().split('T')[0];

  // Fetch foods and food log on mount or when user changes
  useEffect(() => {
    loadData();
  }, [currentUserId]);

  // Open FoodDetailModal when a food is selected
  useEffect(() => {
    if (selectedFood) {
      setIsFoodDetailModalOpen(true);
    }
  }, [selectedFood]);

  // Open FoodDetailModal when editing a food log
  useEffect(() => {
    if (selectedFoodLog) {
      setIsFoodDetailModalOpen(true);
    }
  }, [selectedFoodLog]);

  // Refresh total calories from database using GetDailyCalories SQL function
  const refreshTotalCalories = async () => {
    if (!currentUserId) return;
    try {
      const calories = await getDailyCalories(currentUserId, today);
      setTotalCalories(calories);
    } catch (error) {
      console.error('Error refreshing calories:', error);
    }
  };

  const loadData = async (showLoading = true) => {
    if (!currentUserId) return;
    if (showLoading) setLoading(true);
    try {
      const [foodsData, foodLogData, goalsData] = await Promise.all([
        getFoods(),
        getFoodLog(currentUserId),
        getCalorieGoals(currentUserId)
      ]);
      setFoods(foodsData);
      
      // Filter food log for today and organize by meal
      const todayLog = foodLogData.filter((item: FoodLogItem) => 
        item.FoodLog_Date === today
      );
      
      //FallBack
      const calculatedCalories = todayLog.reduce((sum: number, item: FoodLogItem) => 
        sum + (item.Calories_Per_Serving * item.Serving_Quantity), 0
      );
      
      // Try to get from database function, fallback to calculated
      try {
        const dailyCalories = await getDailyCalories(currentUserId, today);
        setTotalCalories(dailyCalories);
      } catch {
        setTotalCalories(calculatedCalories);
      }
      
      // Organize foods into dictionary by meal type
      const organized: MealFoodsMap = {
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        Snacks: [],
      };
      todayLog.forEach((item: FoodLogItem) => {
        const mealType = item.Meal_Type || 'Snacks'; // Default to Snacks if no meal type
        if (organized[mealType]) {
          organized[mealType].push(item);
        } else {
          organized.Snacks.push(item);
        }
      });
      setMealFoods(organized);
      if (goalsData) {
        setCalorieGoals(goalsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use goals from database for meal targets (null == disabled)
  const allMeals = [
    { mealName: 'Breakfast', targetCalories: calorieGoals.breakfast ?? 0, foods: mealFoods.Breakfast },
    { mealName: 'Lunch', targetCalories: calorieGoals.lunch ?? 0, foods: mealFoods.Lunch },
    { mealName: 'Dinner', targetCalories: calorieGoals.dinner ?? 0, foods: mealFoods.Dinner },
    { mealName: 'Snacks', targetCalories: calorieGoals.snacks ?? 0, foods: mealFoods.Snacks },
  ];
  
  // Only show meals that have a goal
  const meals = allMeals.filter((meal, index) => {
    const goalValues = [calorieGoals.breakfast, calorieGoals.lunch, calorieGoals.dinner, calorieGoals.snacks];
    return goalValues[index] != null && goalValues[index]! > 0;
  });

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
        currentUserId,
        food.Foods_ID,
        today,
        servings,
        selectedMealType // Pass the meal type
      );
      if (success) {
        // Reload food log without showing loading spinner
        await loadData(false);
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
    setSelectedFoodLog(null);
  };

  const handleDeleteFood = async (foodLogId: number) => {
    try {
      const success = await deleteFoodLog(foodLogId);
      if (success) {
        await loadData(false);
      }
    } catch (error) {
      console.error('Error deleting food:', error);
    }
    setIsFoodDetailModalOpen(false);
    setSelectedFoodLog(null);
  };

  const handleEditFood = (foodLogItem: FoodLogItem) => {
    setSelectedFoodLog(foodLogItem);
  };

  const handleUpdateFoodLog = async (foodLogItem: FoodLogItem, newServings: number) => {
    try {
      const success = await updateFoodLog(
        foodLogItem.FoodLog_ID,
        currentUserId,
        foodLogItem.Foods_ID,
        foodLogItem.FoodLog_Date,
        newServings
      );
      if (success) {
        await loadData(false);
      }
    } catch (error) {
      console.error('Error updating food log:', error);
    }
    setIsFoodDetailModalOpen(false);
    setSelectedFoodLog(null);
  };

  const handleSaveSettings = async (goals: CalorieGoals) => {
    try {
      const success = await updateCalorieGoals(
        goals.userId,
        goals.dailyGoal,
        goals.breakfast,
        goals.lunch,
        goals.dinner,
        goals.snacks
      );
      if (success) {
        setCalorieGoals(goals);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setIsSettingsModalOpen(false);
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
          <View>
            <Text style={styles.title}>Calories</Text>
            <Text style={styles.subtitle}>Sunday, October 12</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setIsSettingsModalOpen(true)}
          >
            <Ionicons name="settings-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <CalorieProgress consumed={totalCalories} goal={calorieGoals.dailyGoal} />
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
              onDeleteFood={handleDeleteFood}
              onEditFood={handleEditFood}
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
        onUpdate={handleUpdateFoodLog}
        onDelete={handleDeleteFood}
        food={selectedFood}
        foodLogItem={selectedFoodLog}
      />

      <CalorieSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
        currentGoals={calorieGoals}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  settingsButton: {
    padding: 8,
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