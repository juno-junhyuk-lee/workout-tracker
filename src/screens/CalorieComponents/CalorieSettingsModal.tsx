import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CalorieGoals {
  userId: number;
  dailyGoal: number;
  breakfast: number | null;
  lunch: number | null;
  dinner: number | null;
  snacks: number | null;
}

interface CalorieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: CalorieGoals) => void;
  currentGoals: CalorieGoals;
}

export function CalorieSettingsModal({
  isOpen,
  onClose,
  onSave,
  currentGoals,
}: CalorieSettingsModalProps) {
  const [dailyGoal, setDailyGoal] = useState('');
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [snacks, setSnacks] = useState('');
  const [breakfastEnabled, setBreakfastEnabled] = useState(true);
  const [lunchEnabled, setLunchEnabled] = useState(true);
  const [dinnerEnabled, setDinnerEnabled] = useState(true);
  const [snacksEnabled, setSnacksEnabled] = useState(true);

  // Initialize form with current goals when modal opens
  useEffect(() => {
    if (isOpen) {
      setDailyGoal(currentGoals.dailyGoal.toString());
      // If meal goal is null or 0, it's disabled
      setBreakfastEnabled(currentGoals.breakfast != null && currentGoals.breakfast > 0);
      setLunchEnabled(currentGoals.lunch != null && currentGoals.lunch > 0);
      setDinnerEnabled(currentGoals.dinner != null && currentGoals.dinner > 0);
      setSnacksEnabled(currentGoals.snacks != null && currentGoals.snacks > 0);
      // Set the values (use defaults if null/0)
      setBreakfast(currentGoals.breakfast ? currentGoals.breakfast.toString() : '500');
      setLunch(currentGoals.lunch ? currentGoals.lunch.toString() : '600');
      setDinner(currentGoals.dinner ? currentGoals.dinner.toString() : '600');
      setSnacks(currentGoals.snacks ? currentGoals.snacks.toString() : '200');
    }
  }, [isOpen, currentGoals]);

  const handleSave = () => {
    //at least one meal must be enabled
    if (!breakfastEnabled && !lunchEnabled && !dinnerEnabled && !snacksEnabled) {
      return; 
    }
    //meal totals must match daily goal
    if (mealTotal !== parseInt(dailyGoal)) {
      return; 
    }
    
    // If disabled, save as null (or 0)
    const goals: CalorieGoals = {
      userId: currentGoals.userId,
      dailyGoal: parseInt(dailyGoal) || 2000,
      breakfast: breakfastEnabled ? (parseInt(breakfast) || 500) : null,
      lunch: lunchEnabled ? (parseInt(lunch) || 600) : null,
      dinner: dinnerEnabled ? (parseInt(dinner) || 600) : null,
      snacks: snacksEnabled ? (parseInt(snacks) || 200) : null,
    };
    onSave(goals);
  };

  // Calculate total from enabled meal goals only
  const mealTotal = 
    (breakfastEnabled ? (parseInt(breakfast) || 0) : 0) + 
    (lunchEnabled ? (parseInt(lunch) || 0) : 0) + 
    (dinnerEnabled ? (parseInt(dinner) || 0) : 0) + 
    (snacksEnabled ? (parseInt(snacks) || 0) : 0);

  // Check if at least one meal is enabled
  const hasAtLeastOneMeal = breakfastEnabled || lunchEnabled || dinnerEnabled || snacksEnabled;
  
  // Check if totals match
  const totalsMatch = mealTotal === parseInt(dailyGoal);
  
  // Can save only if both conditions are met
  const canSave = hasAtLeastOneMeal && totalsMatch;

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Calorie Goals</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            style={styles.saveButton}
            disabled={!canSave}
          >
            <Text style={[styles.saveButtonText, !canSave && styles.saveButtonDisabled]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Daily Goal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Calorie Goal</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={dailyGoal}
                onChangeText={setDailyGoal}
                keyboardType="number-pad"
                placeholder="2000"
                placeholderTextColor="#999"
              />
              <Text style={styles.unitLabel}>cal</Text>
            </View>
          </View>

          {/* Meal Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Meal Goals</Text>
            <Text style={styles.sectionSubtitle}>
              Toggle meals on/off and set calorie targets
            </Text>

            {/* Breakfast */}
            <View style={[styles.mealRow, !breakfastEnabled && styles.mealRowDisabled]}>
              <View style={styles.mealLeftSection}>
                <Switch
                  value={breakfastEnabled}
                  onValueChange={setBreakfastEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#FF9500' }}
                  thumbColor="white"
                />
                <View style={[styles.mealDot, { backgroundColor: breakfastEnabled ? '#FF9500' : '#ccc' }]} />
                <Text style={[styles.mealLabel, !breakfastEnabled && styles.mealLabelDisabled]}>Breakfast</Text>
              </View>
              {breakfastEnabled && (
                <View style={styles.mealInputContainer}>
                  <TextInput
                    style={styles.mealInput}
                    value={breakfast}
                    onChangeText={setBreakfast}
                    keyboardType="number-pad"
                    placeholder="500"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.mealUnit}>cal</Text>
                </View>
              )}
            </View>

            {/* Lunch */}
            <View style={[styles.mealRow, !lunchEnabled && styles.mealRowDisabled]}>
              <View style={styles.mealLeftSection}>
                <Switch
                  value={lunchEnabled}
                  onValueChange={setLunchEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#34C759' }}
                  thumbColor="white"
                />
                <View style={[styles.mealDot, { backgroundColor: lunchEnabled ? '#34C759' : '#ccc' }]} />
                <Text style={[styles.mealLabel, !lunchEnabled && styles.mealLabelDisabled]}>Lunch</Text>
              </View>
              {lunchEnabled && (
                <View style={styles.mealInputContainer}>
                  <TextInput
                    style={styles.mealInput}
                    value={lunch}
                    onChangeText={setLunch}
                    keyboardType="number-pad"
                    placeholder="600"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.mealUnit}>cal</Text>
                </View>
              )}
            </View>

            {/* Dinner */}
            <View style={[styles.mealRow, !dinnerEnabled && styles.mealRowDisabled]}>
              <View style={styles.mealLeftSection}>
                <Switch
                  value={dinnerEnabled}
                  onValueChange={setDinnerEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#5856D6' }}
                  thumbColor="white"
                />
                <View style={[styles.mealDot, { backgroundColor: dinnerEnabled ? '#5856D6' : '#ccc' }]} />
                <Text style={[styles.mealLabel, !dinnerEnabled && styles.mealLabelDisabled]}>Dinner</Text>
              </View>
              {dinnerEnabled && (
                <View style={styles.mealInputContainer}>
                  <TextInput
                    style={styles.mealInput}
                    value={dinner}
                    onChangeText={setDinner}
                    keyboardType="number-pad"
                    placeholder="600"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.mealUnit}>cal</Text>
                </View>
              )}
            </View>

            {/* Snacks */}
            <View style={[styles.mealRow, !snacksEnabled && styles.mealRowDisabled]}>
              <View style={styles.mealLeftSection}>
                <Switch
                  value={snacksEnabled}
                  onValueChange={setSnacksEnabled}
                  trackColor={{ false: '#e0e0e0', true: '#FF2D55' }}
                  thumbColor="white"
                />
                <View style={[styles.mealDot, { backgroundColor: snacksEnabled ? '#FF2D55' : '#ccc' }]} />
                <Text style={[styles.mealLabel, !snacksEnabled && styles.mealLabelDisabled]}>Snacks</Text>
              </View>
              {snacksEnabled && (
                <View style={styles.mealInputContainer}>
                  <TextInput
                    style={styles.mealInput}
                    value={snacks}
                    onChangeText={setSnacks}
                    keyboardType="number-pad"
                    placeholder="200"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.mealUnit}>cal</Text>
                </View>
              )}
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Meal Total</Text>
              <Text style={[
                styles.totalValue,
                !totalsMatch && styles.totalMismatch
              ]}>
                {mealTotal} cal
              </Text>
            </View>
            {!totalsMatch && (
              <Text style={styles.mismatchWarning}>
                Meal totals must match your daily goal to save
              </Text>
            )}
            {!hasAtLeastOneMeal && (
              <Text style={styles.mismatchWarning}>
                At least one meal must be enabled
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  saveButtonDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1d1d1f',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6e6e73',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    color: '#1d1d1f',
    paddingVertical: 16,
  },
  unitLabel: {
    fontSize: 18,
    color: '#6e6e73',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealRowDisabled: {
    opacity: 0.6,
  },
  mealLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 12,
    marginRight: 12,
  },
  mealLabel: {
    fontSize: 16,
    color: '#1d1d1f',
  },
  mealLabelDisabled: {
    color: '#999',
  },
  mealInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mealInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1d1d1f',
    minWidth: 50,
    textAlign: 'right',
  },
  mealUnit: {
    fontSize: 14,
    color: '#6e6e73',
    marginLeft: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d1d1f',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34C759',
  },
  totalMismatch: {
    color: '#FF9500',
  },
  mismatchWarning: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 8,
    textAlign: 'center',
  },
});
