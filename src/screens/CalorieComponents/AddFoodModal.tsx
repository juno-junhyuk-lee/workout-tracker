import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodDatabaseItem } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFood: (food: FoodDatabaseItem) => void;
  mealName: string;
}

const FOOD_DATABASE: FoodDatabaseItem[] = [
  // Breakfast items
  { id: 'f1', name: 'Oatmeal with berries', calories: 320, protein: 12, carbs: 54, fat: 6, portion: '1 bowl', category: 'Breakfast' },
  { id: 'f2', name: 'Greek yogurt', calories: 150, protein: 17, carbs: 11, fat: 4, portion: '170g', category: 'Breakfast' },
  { id: 'f3', name: 'Scrambled eggs', calories: 180, protein: 13, carbs: 2, fat: 14, portion: '2 eggs', category: 'Breakfast' },
  { id: 'f4', name: 'Whole wheat toast', calories: 140, protein: 6, carbs: 24, fat: 2, portion: '2 slices', category: 'Breakfast' },
  { id: 'f5', name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0, portion: '1 medium', category: 'Breakfast' },
  { id: 'f6', name: 'Coffee with milk', calories: 35, protein: 2, carbs: 4, fat: 1, portion: '1 cup', category: 'Breakfast' },
  
  // Lunch items
  { id: 'f7', name: 'Grilled chicken salad', calories: 425, protein: 42, carbs: 18, fat: 20, portion: '350g', category: 'Lunch' },
  { id: 'f8', name: 'Turkey sandwich', calories: 380, protein: 28, carbs: 42, fat: 10, portion: '1 sandwich', category: 'Lunch' },
  { id: 'f9', name: 'Quinoa bowl', calories: 420, protein: 15, carbs: 65, fat: 12, portion: '1 bowl', category: 'Lunch' },
  { id: 'f10', name: 'Whole grain bread', calories: 140, protein: 6, carbs: 24, fat: 2, portion: '2 slices', category: 'Lunch' },
  { id: 'f11', name: 'Chicken breast', calories: 284, protein: 53, carbs: 0, fat: 6, portion: '200g', category: 'Lunch' },
  
  // Dinner items
  { id: 'f12', name: 'Salmon fillet', calories: 380, protein: 40, carbs: 0, fat: 24, portion: '200g', category: 'Dinner' },
  { id: 'f13', name: 'Brown rice', calories: 215, protein: 5, carbs: 45, fat: 2, portion: '1 cup', category: 'Dinner' },
  { id: 'f14', name: 'Steamed broccoli', calories: 55, protein: 4, carbs: 11, fat: 1, portion: '150g', category: 'Dinner' },
  { id: 'f15', name: 'Grilled steak', calories: 456, protein: 48, carbs: 0, fat: 28, portion: '200g', category: 'Dinner' },
  { id: 'f16', name: 'Sweet potato', calories: 180, protein: 4, carbs: 41, fat: 0, portion: '1 medium', category: 'Dinner' },
  { id: 'f17', name: 'Roasted chicken thigh', calories: 275, protein: 26, carbs: 0, fat: 18, portion: '150g', category: 'Dinner' },
  
  // Snacks
  { id: 'f18', name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0, portion: '1 medium', category: 'Snacks' },
  { id: 'f19', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, portion: '28g', category: 'Snacks' },
  { id: 'f20', name: 'Protein bar', calories: 200, protein: 20, carbs: 22, fat: 7, portion: '1 bar', category: 'Snacks' },
  { id: 'f21', name: 'Hummus with carrots', calories: 150, protein: 6, carbs: 18, fat: 6, portion: '100g', category: 'Snacks' },
  { id: 'f22', name: 'Mixed berries', calories: 85, protein: 1, carbs: 21, fat: 0, portion: '1 cup', category: 'Snacks' },
  { id: 'f23', name: 'Cheese stick', calories: 80, protein: 6, carbs: 1, fat: 6, portion: '1 piece', category: 'Snacks' },
  { id: 'f24', name: 'Dark chocolate', calories: 170, protein: 2, carbs: 13, fat: 12, portion: '30g', category: 'Snacks' },
];

export function AddFoodModal({ isOpen, onClose, onSelectFood, mealName }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: FoodDatabaseItem) => {
    onSelectFood(food);
    setSearchQuery('');
  };

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Add to {mealName}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1d1d1f" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#86868b" style={styles.searchIcon} />
            <TextInput
              placeholder="Search foods..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="#86868b"
            />
          </View>
        </View>

        {/* Food list */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {filteredFoods.length > 0 ? (
            <View style={styles.foodList}>
              {filteredFoods.map((food, index) => (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => handleSelectFood(food)}
                  style={[
                    styles.foodItem,
                    index !== filteredFoods.length - 1 && styles.foodItemBorder,
                  ]}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodPortion}>{food.portion}</Text>
                    <View style={styles.macrosRow}>
                      <Text style={styles.macroText}>P: {food.protein}g</Text>
                      <Text style={styles.macroText}>C: {food.carbs}g</Text>
                      <Text style={styles.macroText}>F: {food.fat}g</Text>
                    </View>
                  </View>
                  <Text style={styles.foodCalories}>{food.calories}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No foods found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e7',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1d1d1f',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
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
    paddingVertical: 16,
  },
  foodItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
  },
  foodPortion: {
    fontSize: 14,
    color: '#6e6e73',
    marginTop: 2,
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  macroText: {
    fontSize: 12,
    color: '#86868b',
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
    marginLeft: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#86868b',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#86868b',
    marginTop: 4,
  },
});