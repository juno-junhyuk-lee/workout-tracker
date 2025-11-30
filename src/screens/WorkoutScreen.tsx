import { useState, useEffect } from "react";
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
} from "react-native";

import {
  getExercises,
  createWorkout,
  addPerformedExercise,
  addSet,
  getTodaysWorkout,
  getWorkoutHistory,
  deleteSet,
  deletePerformedExercise,
  deleteWorkout,
<<<<<<< Updated upstream
} from '../services/api';
=======
} from "../services/api";
>>>>>>> Stashed changes
import { useAuth } from "../context/AuthContext";

interface Exercise {
  Exercises_ID: number;
  Exercises_Name: string;
  Muscle_Group: string | null;
}

interface WorkoutSet {
  Sets_ID: number;
  Sets_Weight: number;
  Sets_Rep: number;
}

interface PerformedExercise {
  PerformedExercises_ID: number;
  Exercises_ID: number;
  Exercises_Name: string;
  sets: WorkoutSet[];
}

interface Workout {
  Workouts_ID: number;
  Workouts_Name: string;
  Workouts_Date: string;
  exercises: PerformedExercise[];
  exercise_count?: number;
}

export default function WorkoutScreen({ route }: any) {
  const { user } = useAuth();
  const currentUserId = user?.id ?? 0;

  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [todaysWorkout, setTodaysWorkout] = useState<Workout | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<number>>(
    new Set()
  );

  // Modal states
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Add set modal
  const [showAddSetModal, setShowAddSetModal] = useState(false);
  const [currentPerformedExerciseId, setCurrentPerformedExerciseId] = useState<
    number | null
  >(null);
  const [setWeight, setSetWeight] = useState("");
  const [setReps, setSetReps] = useState("");

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    loadData();
  }, [activeTab, currentUserId]);

  const loadData = async () => {
    if (!currentUserId) {
      console.log("No currentUserId in WorkoutScreen, skipping loadData");
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "today") {
        const workout = await getTodaysWorkout(currentUserId, todayDate);
        setTodaysWorkout(workout);
      } else {
        const history = await getWorkoutHistory(currentUserId);
        setWorkoutHistory(history);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkoutExpanded = (workoutId: number) => {
    setExpandedWorkouts((prev: Set<number>) => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      return newSet;
    });
  };

  const handleAddTodaysWorkout = async () => {
    const workoutName = `Workout ${new Date().toLocaleDateString()}`;
    const workoutId = await createWorkout(
      currentUserId,
      workoutName,
      todayDate
    );

    if (workoutId) {
      Alert.alert("Success", "Workout created!");
      loadData();
    } else {
      Alert.alert("Error", "Failed to create workout. Check server logs.");
    }
  };

  const handleAddExercise = async () => {
    const allExercises = await getExercises();
    setExercises(allExercises);
    setShowExerciseModal(true);
  };

  const handleSelectExercise = async (exercise: Exercise) => {
    if (!todaysWorkout) {
      Alert.alert("Error", "Please create a workout first");
      return;
    }

    const performedExerciseId = await addPerformedExercise(
      todaysWorkout.Workouts_ID,
      exercise.Exercises_ID
    );

    if (performedExerciseId) {
      setShowExerciseModal(false);
      loadData();
      Alert.alert("Success", `${exercise.Exercises_Name} added!`);
    }
  };

  const handleAddSetClick = (performedExerciseId: number) => {
    setCurrentPerformedExerciseId(performedExerciseId);
    setSetWeight("");
    setSetReps("");
    setShowAddSetModal(true);
  };

  const handleSaveSet = async () => {
    if (!currentPerformedExerciseId || !setWeight || !setReps) {
      Alert.alert("Error", "Please enter weight and reps");
      return;
    }

    const weight = parseFloat(setWeight);
    const reps = parseInt(setReps);

    // Frontend validation (optional, but provides better UX)
    if (reps <= 0) {
      Alert.alert("Error", "Reps must be greater than 0");
      return;
    }

    if (weight < 0) {
      Alert.alert("Error", "Weight cannot be negative");
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
      Alert.alert("Success", "Set added!");
    }
  };

  // DELETE HANDLERS
  const handleDeleteSet = (setId: number) => {
    Alert.alert("Delete Set", "Are you sure you want to delete this set?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteSet(setId);
          if (success) {
            Alert.alert("Success", "Set deleted!");
            loadData();
          } else {
            Alert.alert("Error", "Failed to delete set");
          }
        },
      },
    ]);
  };

  const handleDeletePerformedExercise = (
    performedExerciseId: number,
    exerciseName: string
  ) => {
    Alert.alert(
      "Delete Exercise",
      `Are you sure you want to delete ${exerciseName} and all its sets?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deletePerformedExercise(performedExerciseId);
            if (success) {
              Alert.alert("Success", "Exercise deleted!");
              loadData();
            } else {
              Alert.alert("Error", "Failed to delete exercise");
            }
          },
        },
      ]
    );
  };

  const handleDeleteWorkout = (workoutId: number) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this entire workout? This will remove all exercises and sets.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteWorkout(workoutId);
            if (success) {
              Alert.alert("Success", "Workout deleted!");
              loadData();
            } else {
              Alert.alert("Error", "Failed to delete workout");
            }
          },
        },
      ]
    );
  };

  const renderTodaysWorkout = () => {
    if (loading) {
      return (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      );
    }

    if (!todaysWorkout) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No workout for today</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleAddTodaysWorkout}
          >
            <Text style={styles.createButtonText}>Create Today's Workout</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.workoutContent}>
        <View style={styles.workoutHeader}>
          <View>
            <Text style={styles.workoutTitle}>Today's Workout</Text>
            <Text style={styles.workoutDate}>
              {todaysWorkout.Workouts_Date}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteWorkoutButton}
            onPress={() => handleDeleteWorkout(todaysWorkout.Workouts_ID)}
          >
            <Text style={styles.deleteWorkoutButtonText}>Delete Workout</Text>
          </TouchableOpacity>
        </View>

        {todaysWorkout.exercises.map((exercise) => (
          <View
            key={exercise.PerformedExercises_ID}
            style={styles.exerciseCard}
          >
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.Exercises_Name}</Text>
              <TouchableOpacity
                style={styles.deleteExerciseButtonSmall}
                onPress={() =>
                  handleDeletePerformedExercise(
                    exercise.PerformedExercises_ID,
                    exercise.Exercises_Name
                  )
                }
              >
                <Text style={styles.deleteExerciseButtonText}>
                  Delete Exercise
                </Text>
              </TouchableOpacity>
            </View>

            {exercise.sets.map((set, index) => (
              <View key={set.Sets_ID} style={styles.setRow}>
                <Text style={styles.setText}>Set {index + 1}:</Text>
                <Text style={styles.setText}>{set.Sets_Weight} lbs</Text>
                <Text style={styles.setText}>{set.Sets_Rep} reps</Text>
                <TouchableOpacity
                  style={styles.deleteSetButtonSmall}
                  onPress={() => handleDeleteSet(set.Sets_ID)}
                >
                  <Text style={styles.deleteSetButtonText}>Delete Set</Text>
                </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={handleAddExercise}
        >
          <Text style={styles.addExerciseButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderHistory = () => {
    if (loading) {
      return (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      );
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
        {workoutHistory.map((workout) => {
          const isExpanded = expandedWorkouts.has(workout.Workouts_ID);
          const totalSets = workout.exercises.reduce(
            (sum, ex) => sum + ex.sets.length,
            0
          );

          return (
            <View key={workout.Workouts_ID} style={styles.historyCard}>
              <TouchableOpacity
                style={styles.historyCardHeader}
                onPress={() => toggleWorkoutExpanded(workout.Workouts_ID)}
                activeOpacity={0.7}
              >
                <View style={styles.historyHeaderLeft}>
                  <Text style={styles.historyDate}>
                    📅 {workout.Workouts_Date}
                  </Text>
                  <Text style={styles.historyDetail}>
                    {workout.exercises.length} exercise
                    {workout.exercises.length !== 1 ? "s" : ""} • {totalSets}{" "}
                    set{totalSets !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.historyHeaderRight}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => toggleWorkoutExpanded(workout.Workouts_ID)}
                  >
                    <Text style={styles.viewButtonText}>
                      {isExpanded ? "Hide" : "View"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout.Workouts_ID);
                    }}
                    style={styles.deleteHistoryButtonSmall}
                  >
                    <Text style={styles.deleteHistoryButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.historyExpandedContent}>
                  {workout.exercises.map((exercise) => (
                    <View
                      key={exercise.PerformedExercises_ID}
                      style={styles.historyExerciseCard}
                    >
                      <Text style={styles.historyExerciseName}>
                        {exercise.Exercises_Name}
                      </Text>
                      {exercise.sets.map((set, index) => (
                        <View key={set.Sets_ID} style={styles.historySetRow}>
                          <Text style={styles.historySetText}>
                            Set {index + 1}: {set.Sets_Weight} lbs ×{" "}
                            {set.Sets_Rep} reps
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Tracker</Text>
        {!todaysWorkout && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleAddTodaysWorkout}
          >
            <Text style={styles.headerButtonText}>
              + Add Today&apos;s Workout
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "today" && styles.activeTab]}
          onPress={() => setActiveTab("today")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "today" && styles.activeTabText,
            ]}
          >
            Today's Workout
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            Workout History
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "today" ? renderTodaysWorkout() : renderHistory()}

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
                  <Text style={styles.exerciseOptionName}>
                    {exercise.Exercises_Name}
                  </Text>
                  {exercise.Muscle_Group && (
                    <Text style={styles.exerciseOptionMuscle}>
                      {exercise.Muscle_Group}
                    </Text>
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
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveSet}
              >
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerButton: {
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 20,
  },
  headerButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  workoutContent: {
    flex: 1,
    padding: 20,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: "#666",
  },
  deleteWorkoutButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  deleteWorkoutButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
  },
  deleteExerciseButtonSmall: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteExerciseButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  setText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  deleteSetButtonSmall: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteSetButtonText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "600",
  },
  addSetButton: {
    marginTop: 12,
    paddingVertical: 8,
  },
  addSetButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  addExerciseButton: {
    backgroundColor: "#000",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  addExerciseButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  historyContent: {
    flex: 1,
    padding: 20,
  },
  historyCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  historyHeaderLeft: {
    flex: 1,
  },
  historyHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyDetail: {
    fontSize: 14,
    color: "#666",
  },
  viewButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteHistoryButtonSmall: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteHistoryButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  historyExpandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  historyExerciseCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  historyExerciseName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  historySetRow: {
    paddingVertical: 4,
  },
  historySetText: {
    fontSize: 14,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  exerciseList: {
    maxHeight: 400,
  },
  exerciseOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: "500",
  },
  exerciseOptionMuscle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 8,
    marginLeft: 8,
  },
  modalSaveButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});
