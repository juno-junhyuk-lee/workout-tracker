import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FoodDatabaseItem, FoodLogItem } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FoodDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: FoodDatabaseItem, servings: number) => void;
  onUpdate?: (foodLogItem: FoodLogItem, newServings: number) => void;
  onDelete?: (foodLogId: number) => void;
  food: FoodDatabaseItem | null;
  foodLogItem?: FoodLogItem | null; //If not null, then we are currently in edit mode
}

export function FoodDetailModal({ isOpen, onClose, onAdd, onUpdate, onDelete, food, foodLogItem }: FoodDetailModalProps) {
  const [servings, setServings] = useState(1);
  const [servingsText, setServingsText] = useState('1');
  
  const isEditMode = !!foodLogItem;
  
  // Get food data from either the food prop or foodLogItem
  const foodData = isEditMode ? {
    Foods_ID: foodLogItem!.Foods_ID,
    Foods_Name: foodLogItem!.Foods_Name,
    Calories_Per_Serving: foodLogItem!.Calories_Per_Serving,
    Foods_Category: foodLogItem!.Foods_Category,
  } : food;

  useEffect(() => {
    if (foodLogItem) {
      const qty = parseFloat(String(foodLogItem.Serving_Quantity));
      const validQty = isNaN(qty) ? 1 : qty;
      setServings(validQty);
      setServingsText(String(validQty));
    } else {
      setServings(1);
      setServingsText('1');
    }
  }, [foodLogItem, food]);

  if (!foodData) return null;

  const multipliedCalories = Math.round(foodData.Calories_Per_Serving * (isNaN(servings) ? 1 : servings));

  const handleAdd = () => {
    if (isEditMode && onUpdate && foodLogItem) {
      onUpdate(foodLogItem, servings);
    } else if (food) {
      onAdd(food, servings);
    }
    setServings(1);
    setServingsText('1');
  };

  const handleDelete = () => {
    if (isEditMode && onDelete && foodLogItem) {
      onDelete(foodLogItem.FoodLog_ID);
    }
  };

  const handleClose = () => {
    onClose();
    setServings(1);
    setServingsText('1');
  };

  const incrementServings = () => {
    const newVal = servings + 0.5;
    setServings(newVal);
    setServingsText(String(newVal));
  };
  
  const decrementServings = () => {
    const newVal = Math.max(servings - 0.5, 0);
    setServings(newVal);
    setServingsText(String(newVal));
  };

  const handleServingsChange = (text: string) => {
    setServingsText(text);
    const num = parseFloat(text);
    if (!isNaN(num) && num >= 0) {
      setServings(num);
    }
  };

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="fullScreen">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{isEditMode ? 'Edit Food Log' : 'Food Details'}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#1d1d1f" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Food Name */}
          <View style={styles.foodNameSection}>
            <Text style={styles.foodName}>{foodData.Foods_Name}</Text>
            <Text style={styles.foodPortion}>{foodData.Foods_Category || 'Uncategorized'}</Text>
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
                disabled={servings <= 0}
                style={[styles.servingButton, servings <= 0 && styles.servingButtonDisabled]}
              >
                <Ionicons name="remove" size={24} color="#1d1d1f" />
              </TouchableOpacity>
              <View style={styles.servingValueContainer}>
                <TextInput
                  style={styles.servingInput}
                  value={servingsText}
                  onChangeText={handleServingsChange}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <Text style={styles.servingText}>
                  {servings === 1 ? 'serving' : 'servings'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={incrementServings}
                style={styles.servingButton}
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
                <Text style={styles.macroValue}>{foodData.Calories_Per_Serving}</Text>
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

        {/* Footer */}
        <View style={styles.footer}>
          {isEditMode ? (
            <View style={styles.editFooter}>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.updateButton}>
                <Text style={styles.updateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add to Meal</Text>
            </TouchableOpacity>
          )}
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
  servingInput: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1d1d1f',
    textAlign: 'center',
    minWidth: 80,
    padding: 4,
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
  editFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff3b30',
    gap: 8,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#1d1d1f',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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