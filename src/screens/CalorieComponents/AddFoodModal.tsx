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
  foods: FoodDatabaseItem[];
}

export function AddFoodModal({ isOpen, onClose, onSelectFood, mealName, foods }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = foods.filter(food =>
    food.Foods_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (food.Foods_Category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const handleSelectFood = (food: FoodDatabaseItem) => {
    setSearchQuery('');
    // Small delay to ensure the touch event completes before modal transitions
    setTimeout(() => {
      onSelectFood(food);
    }, 50);
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
                  key={food.Foods_ID}
                  onPress={() => handleSelectFood(food)}
                  style={[
                    styles.foodItem,
                    index !== filteredFoods.length - 1 && styles.foodItemBorder,
                  ]}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.Foods_Name}</Text>
                    <Text style={styles.foodPortion}>{food.Foods_Category || 'Uncategorized'}</Text>
                  </View>
                  <Text style={styles.foodCalories}>{food.Calories_Per_Serving} cal</Text>
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