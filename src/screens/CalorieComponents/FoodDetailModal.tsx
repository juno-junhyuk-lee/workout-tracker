import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodDatabaseItem } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FoodDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodDatabaseItem, servings: number) => void;
  food: FoodDatabaseItem | null;
}

export function FoodDetailModal({ isOpen, onClose, onAdd, food }: FoodDetailModalProps) {
  const [servings, setServings] = useState(1);

  if (!food) return null;

  const multipliedCalories = Math.round(food.Calories_Per_Serving * servings);

  const handleAdd = () => {
    onAdd(food, servings);
    setServings(1);
  };

  const handleClose = () => {
    onClose();
    setServings(1);
  };

  const incrementServings = () => setServings(prev => Math.min(prev + 0.5, 20));
  const decrementServings = () => setServings(prev => Math.max(prev - 0.5, 0.5));

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Food Details</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1d1d1f" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Food Name */}
          <View style={styles.foodNameSection}>
            <Text style={styles.foodName}>{food.Foods_Name}</Text>
            <Text style={styles.foodPortion}>{food.Foods_Category || 'Uncategorized'}</Text>
          </View>

          {/* Calorie Display */}
          <View style={styles.calorieCard}>
            <Text style={styles.calorieValue}>{multipliedCalories}</Text>
            <Text style={styles.calorieLabel}>calories</Text>
          </View>

          {/* Serving Size Control */}
          <View style={styles.servingSection}>
            <Text style={styles.servingLabel}>Serving Size</Text>
            <View style={styles.servingControls}>
              <TouchableOpacity
                onPress={decrementServings}
                disabled={servings <= 0.5}
                style={[styles.servingButton, servings <= 0.5 && styles.servingButtonDisabled]}
              >
                <Ionicons name="remove" size={24} color="#1d1d1f" />
              </TouchableOpacity>
              <View style={styles.servingValueContainer}>
                <Text style={styles.servingValue}>{servings}</Text>
                <Text style={styles.servingText}>
                  {servings === 1 ? 'serving' : 'servings'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={incrementServings}
                disabled={servings >= 20}
                style={[styles.servingButton, servings >= 20 && styles.servingButtonDisabled]}
              >
                <Ionicons name="add" size={24} color="#1d1d1f" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Section */}
          <View style={styles.macroSection}>
            <Text style={styles.macroTitle}>Nutrition Info</Text>
            <View style={styles.macroCard}>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Calories per serving</Text>
                <Text style={styles.macroValue}>{food.Calories_Per_Serving}</Text>
              </View>
            </View>
            <View style={styles.macroCard}>
              <View style={styles.macroRow}>
                <Text style={styles.macroLabel}>Total for {servings} serving(s)</Text>
                <Text style={styles.macroValue}>{multipliedCalories} cal</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer with Add Button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Meal</Text>
          </TouchableOpacity>
        </View>
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
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  foodNameSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  foodName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1d1d1f',
    textAlign: 'center',
  },
  foodPortion: {
    fontSize: 16,
    color: '#6e6e73',
    marginTop: 12,
  },
  calorieCard: {
    backgroundColor: '#f5f5f7',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  calorieLabel: {
    fontSize: 16,
    color: '#6e6e73',
  },
  servingSection: {
    marginBottom: 32,
  },
  servingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
    textAlign: 'center',
    marginBottom: 12,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  servingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingButtonDisabled: {
    opacity: 0.4,
  },
  servingValueContainer: {
    minWidth: 100,
    alignItems: 'center',
  },
  servingValue: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  servingText: {
    fontSize: 14,
    color: '#6e6e73',
    marginTop: 4,
  },
  macroSection: {},
  macroTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 16,
  },
  macroCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 16,
    color: '#1d1d1f',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e7',
  },
  addButton: {
    backgroundColor: '#1d1d1f',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});