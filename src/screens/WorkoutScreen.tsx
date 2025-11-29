import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { 
  getExercises, 
  createWorkout,
  addPerformedExercise,
  addSet,
  getTodaysWorkout,
  getWorkoutHistory
} from '../services/api';

interface Exercise {
  Exercises_ID: number;
  Exercises_Name: string;
  Muscle_Group: string | null;
}

interface Set {
  Sets_ID: number;
  Sets_Weight: number;
  Sets_Rep: number;
}

interface PerformedExercise {
  PerformedExercises_ID: number;
  Exercises_ID: number;
  Exercises_Name: string;
  sets: Set[];
}

interface Workout {
  Workouts_ID: number;
  Workouts_Name: string;
  Workouts_Date: string;
  exercises: PerformedExercise[];
}

interface WorkoutHistoryItem {
  Workouts_ID: number;
  Workouts_Date: string;
  exercise_count: number;
}

export default function WorkoutScreen({ route }: any) {
  

  const currentUserId = route?.params?.userId || 1;

  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [todaysWorkout, setTodaysWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  
  // Add set modal
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [currentPerformedExerciseId, setCurrentPerformedExerciseId] = useState<number | null>(null);
  const [setWeight, setSetWeight] = useState('');
  const [setReps, setSetReps] = useState('');

  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadData();
  }, [activeTab, currentUserId]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === 'today') {
      const workout = await getTodaysWorkout(currentUserId, todayDate);
      setTodaysWorkout(workout);
    } else {
      const history = await getWorkoutHistory(currentUserId);
      setWorkoutHistory(history);
    }
    setLoading(false);
  };

  // WorkoutScreen.js (CORRECTION)
const handleAddTodaysWorkout = async () => {
    const workoutName = `Workout ${new Date().toLocaleDateString()}`;
    
    // CHANGE 1: Use createWorkout, which takes Users_ID, Name, and Date
    const workoutId = await createWorkout(currentUserId, workoutName, todayDate); 
    
    if (workoutId) {
        loadData();
    }
    // Handle error case if createWorkout returns null
    else {
        Alert.alert('Error', 'Failed to create workout. Check server logs.');
    }
};

  const handleAddExercise = async () => {
    const allExercises = await getExercises();
    setExercises(allExercises);
    setShowExerciseModal(true);
  };

  const handleSelectExercise = async (exercise: Exercise) => {
    if (!todaysWorkout) {
      Alert.alert('Error', 'Please create a workout first');
      return;
    }

    const performedExerciseId = await addPerformedExercise(
      todaysWorkout.Workouts_ID,
      exercise.Exercises_ID
    );

    if (performedExerciseId) {
      setShowExerciseModal(false);
      loadData();
    }
  };

  const handleAddSetClick = (performedExerciseId: number) => {
    setCurrentPerformedExerciseId(performedExerciseId);
    setSetWeight('');
    setSetReps('');
    setShowAddSetModal(true);
  };

  const handleSaveSet = async () => {
    if (!currentPerformedExerciseId || !setWeight || !setReps) {
      Alert.alert('Error', 'Please enter weight and reps');
      return;
    }

    const success = await addSet(
      currentPerformedExerciseId,
      parseFloat(setWeight),
      parseInt(setReps)
    );

    if (success) {
      setShowAddSetModal(false);
      loadData();
    }
  };

  const renderTodaysWorkout = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
    }

    if (!todaysWorkout) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No workout for today</Text>
          <TouchableOpacity style={styles.createButton} onPress={handleAddTodaysWorkout}>
            <Text style={styles.createButtonText}>Create Today's Workout</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.workoutContent}>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutTitle}>Today's Workout</Text>
          <Text style={styles.workoutDate}>{todaysWorkout.Workouts_Date}</Text>
        </View>

        {todaysWorkout.exercises.map((exercise) => (
          <View key={exercise.PerformedExercises_ID} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{exercise.Exercises_Name}</Text>
            
            {exercise.sets.map((set, index) => (
              <View key={set.Sets_ID} style={styles.setRow}>
                <Text style={styles.setText}>Set {index + 1}:</Text>
                <Text style={styles.setText}>{set.Sets_Weight} lbs</Text>
                <Text style={styles.setText}>{set.Sets_Rep} reps</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addSetButton}
              onPress={() => handleAddSetClick(exercise.PerformedExercises_ID)}
            >
              <Text style={styles.addSetButtonText}>+ Add Set</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
          <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderHistory = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#000" style={styles.loader} />;
    }

    if (workoutHistory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No workout history yet</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.historyContent}>
        {workoutHistory.map((item) => (
          <View key={item.Workouts_ID} style={styles.historyCard}>
            <Text style={styles.historyDate}>📅 {item.Workouts_Date}</Text>
            <Text style={styles.historyDetail}>
              {item.exercise_count} exercise{item.exercise_count !== 1 ? 's' : ''} completed
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Tracker</Text>
        {}
        {!todaysWorkout && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddTodaysWorkout}
          >
            <Text style={styles.headerButtonText}>+ Add Today&apos;s Workout</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
            Today's Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            Workout History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'today' ? renderTodaysWorkout() : renderHistory()}

      {/* Exercise Selection Modal */}
      <Modal visible={showExerciseModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <ScrollView style={styles.exerciseList}>
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.Exercises_ID}
                  style={styles.exerciseOption}
                  onPress={() => handleSelectExercise(exercise)}
                >
                  <Text style={styles.exerciseOptionName}>{exercise.Exercises_Name}</Text>
                  {exercise.Muscle_Group && (
                    <Text style={styles.exerciseOptionMuscle}>{exercise.Muscle_Group}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowExerciseModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Set Modal */}
      <Modal visible={showAddSetModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Set</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Weight (lbs)"
              keyboardType="decimal-pad"
              value={setWeight}
              onChangeText={setSetWeight}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Reps"
              keyboardType="number-pad"
              value={setReps}
              onChangeText={setSetReps}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddSetModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveSet}>
                <Text style={styles.modalSaveButtonText}>Save Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButton: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
  },
  headerButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  workoutContent: {
    flex: 1,
    padding: 20,
  },
  workoutHeader: {
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
  exerciseCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  setText: {
    fontSize: 14,
    color: '#333',
  },
  addSetButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  addSetButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addExerciseButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  addExerciseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContent: {
    flex: 1,
    padding: 20,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDetail: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseOptionMuscle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    marginLeft: 8,
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});