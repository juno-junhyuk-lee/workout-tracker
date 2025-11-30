import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  LayoutChangeEvent,
  ActivityIndicator,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import {
  fetchHomeScreenData,
  HomeScreenData,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth - 72;      // frame width
const barChartWidth = chartWidth + 80;    // inner drawing width for bars
const lineChartWidth = chartWidth - 24;   // inner width for line chart
const chartFrameWidth = screenWidth - 72;
const chartInnerPadding = 8;

// Chart design
const baseChartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientToOpacity: 0,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
  propsForBackgroundLines: {
    strokeWidth: 0,
  },
  propsForDots: {
    r: "4",
    strokeWidth: "0",
  },
};

const workoutChartConfig = {
  ...baseChartConfig,
  formatYLabel: (y: string) => {
    const n = Number(y);
    const snapped = Math.round(n / 15) * 15;
    return `${snapped}`;
  },
  yAxisSuffix: " min",
  fillShadowGradient: "#000000",
  fillShadowGradientFrom: "#000000",
  fillShadowGradientTo: "#000000",
  fillShadowGradientOpacity: 1,
};

const calorieChartConfig = {
  ...baseChartConfig,
  yAxisSuffix: " cal",
};

const HomeScreen: React.FC = () => {
  const [homeData, setHomeData] = React.useState<HomeScreenData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigation = useNavigation<any>();

  // Get current user from session
  const { user } = useAuth();
  const userId = user?.id ?? 0;
  const userName = user
  ? `${user.first_name} ${user.last_name}`
  : "User";

  const [range, setRange] = React.useState<"weekly" | "monthly">("weekly");
  const [segmentWidth, setSegmentWidth] = React.useState(0);
  const thumbAnim = React.useRef(new Animated.Value(0)).current;

  const [calorieTooltip, setCalorieTooltip] = React.useState({
    visible: false,
    x: 0,
    y: 0,
    label: "",
    value: 0,
    unit: "cal",
  });

  const handleSegmentLayout = (e: LayoutChangeEvent) => {
    setSegmentWidth(e.nativeEvent.layout.width);
  };

  const switchRange = (next: "weekly" | "monthly") => {
    setRange(next);
    Animated.timing(thumbAnim, {
      toValue: next === "weekly" ? 0 : 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  const thumbTranslateX =
    segmentWidth === 0
      ? 0
      : thumbAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [2, segmentWidth / 2 - 2],
        });

  // Data extraction with defaults
  const workoutSummary = homeData?.todayWorkout ?? {
    exercises: 0,
    totalSets: 0,
    durationMinutes: 0,
    completed: false,
  };

  const calorieSummary = homeData?.todayCalories ?? {
    consumed: 0,
    goal: 0,
  };

  const weeklyStats = homeData?.weeklyStats ?? {
    workoutsCompleted: 0,
    workoutsTarget: 7,
    avgCalories: 0,
  };

  const dayStats =
    homeData?.dailyStats ?? [
      { label: "Mon", workoutMinutes: 0, calories: 0 },
      { label: "Tue", workoutMinutes: 0, calories: 0 },
      { label: "Wed", workoutMinutes: 0, calories: 0 },
      { label: "Thu", workoutMinutes: 0, calories: 0 },
      { label: "Fri", workoutMinutes: 0, calories: 0 },
      { label: "Sat", workoutMinutes: 0, calories: 0 },
      { label: "Sun", workoutMinutes: 0, calories: 0 },
    ];

  const remainingCalories =
    calorieSummary.goal - calorieSummary.consumed > 0
      ? calorieSummary.goal - calorieSummary.consumed
      : 0;

  const monthlyStats =
    homeData?.monthlyStats ?? [
      { label: "Jan", totalSets: 0 },
      { label: "Feb", totalSets: 0 },
      { label: "Mar", totalSets: 0 },
      { label: "Apr", totalSets: 0 },
      { label: "May", totalSets: 0 },
      { label: "Jun", totalSets: 0 },
      { label: "Jul", totalSets: 0 },
    ];

  // Chart data preparation
  const MINUTES_PER_SET = 5;
  const weeklyWorkoutData = {
    labels: dayStats.map((d) => d.label),
    datasets: [{ data: dayStats.map((d) => d.workoutMinutes / MINUTES_PER_SET) }],
  };

  const monthlyWorkoutData = {
    labels: monthlyStats.map((m: any) => m.label),
    datasets: [{ data: monthlyStats.map((m: any) => m.totalSets) }],
  };

  const calorieData = {
    labels: dayStats.map((d) => d.label),
    datasets: [{ data: dayStats.map((d) => d.calories) }],
  };

  const workoutData =
    range === "weekly" ? weeklyWorkoutData : monthlyWorkoutData;

  // Data loading on focus
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const load = async () => {
        try {
          if (!userId) return;

          setLoading(true);
          setError(null);

          console.log("Loading home data for userId:", userId);
          const data = await fetchHomeScreenData(userId);

          if (!isActive) return;
          console.log("Home API response:", data);
          setHomeData(data);
        } catch (e: any) {
          console.log("Failed to load home data:", e?.message ?? e);
          if (isActive) {
            setError("Could not load latest stats. Showing zeros instead.");
            setHomeData(null);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [userId])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.welcomeText}>Welcome Back, {userName}</Text>
        <Text style={styles.subtitle}>Here&apos;s your today&apos;s progress</Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#000"
            style={{ marginBottom: 8 }}
          />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* WORKOUT CARD */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("WorkoutScreen")}
        >
          <Text style={styles.cardTitle}>Today&apos;s Workout</Text>

          <View style={styles.workoutStatsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Exercises</Text>
              <Text style={styles.statValue}>{workoutSummary.exercises}</Text>
            </View>

            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>Total Sets</Text>
              <Text style={styles.statValue}>{workoutSummary.totalSets}</Text>
            </View>
          </View>

          <View style={styles.progressLine} />

          <Text
            style={[
              styles.workoutStatus,
              workoutSummary.completed && styles.workoutCompleted,
            ]}
          >
            {workoutSummary.completed
              ? "Workout Completed!"
              : "Workout not completed yet"}
          </Text>
        </TouchableOpacity>

        {/* CALORIE CARD */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => navigation.replace("CalorieScreen")}
        >
          <Text style={styles.cardTitle}>Calorie Intake</Text>

          <View style={styles.calorieRow}>
            <Text style={styles.calorieConsumedLabel}>Consumed</Text>
            <Text style={styles.calorieConsumedValue}>
              {calorieSummary.consumed} / {calorieSummary.goal} cal
            </Text>
          </View>

          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  flex:
                    calorieSummary.goal > 0
                      ? calorieSummary.consumed /
                        Math.max(calorieSummary.goal, 1)
                      : 0,
                },
              ]}
            />
            <View
              style={{
                flex:
                  calorieSummary.goal > 0
                    ? 1 -
                      calorieSummary.consumed /
                        Math.max(calorieSummary.goal, 1)
                    : 1,
              }}
            />
          </View>

          <View style={styles.calorieBottomRow}>
            <View style={styles.smallInfoBox}>
              <Text style={styles.smallInfoLabel}>Goal</Text>
              <Text style={styles.smallInfoValue}>{calorieSummary.goal}</Text>
            </View>
            <View style={styles.smallInfoBox}>
              <Text style={styles.smallInfoLabel}>Remaining</Text>
              <Text style={styles.smallInfoValue}>{remainingCalories}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Weekly Workouts + Avg Calories */}
        <View style={styles.summaryRow}>
          <View style={[styles.card, styles.smallCard]}>
            <Text style={styles.smallCardLabel}>Weekly Sets</Text>
            <Text style={styles.smallCardValue}>
              {weeklyStats.workoutsCompleted} sets
            </Text>
          </View>
          <View style={[styles.card, styles.smallCard]}>
            <Text style={styles.smallCardLabel}>Avg Calories</Text>
            <Text style={styles.smallCardValue}>
              {weeklyStats.avgCalories.toLocaleString()} cal
            </Text>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.card}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.cardTitle}>Progress Overview</Text>

            <View
              style={styles.segmentedControl}
              onLayout={handleSegmentLayout}
            >
              {segmentWidth > 0 && (
                <Animated.View
                  style={[
                    styles.segmentThumb,
                    { transform: [{ translateX: thumbTranslateX }] },
                  ]}
                />
              )}

              <TouchableOpacity
                style={styles.segmentButton}
                onPress={() => switchRange("weekly")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    range === "weekly" && styles.segmentTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.segmentButton}
                onPress={() => switchRange("monthly")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentText,
                    range === "monthly" && styles.segmentTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Work Duration Bar Chart */}
          <Text style={styles.sectionLabel}>Total Sets</Text>
          <View style={styles.chartWrapper}>
            {/* @ts-ignore */}
            <BarChart
              data={workoutData}
              width={barChartWidth}
              height={200}
              fromZero
              segments={4}
              chartConfig={workoutChartConfig}
              style={{
                ...styles.chart,
                backgroundColor: "transparent",
                marginLeft: -85,
                marginBottom: -10,
              }}
              // @ts-ignore
              barPercentage={0.3}
              showValuesOnTopOfBars={true}
              withInnerLines={false}
              withHorizontalLabels={false}
              xLabelsOffset={-10}
              yLabelsOffset={-10}
            />
          </View>

          {/* Daily Calories Line Chart */}
          <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
            Daily Calories
          </Text>
          <View style={styles.chartWrapper}>
            {calorieTooltip.visible && (
              <View
                pointerEvents="none"
                style={[
                  styles.tooltip,
                  {
                    left: calorieTooltip.x - 100,
                    top: calorieTooltip.y - 30,
                  },
                ]}
              >
                <Text style={styles.tooltipText}>
                  {calorieTooltip.label}: {calorieTooltip.value}{" "}
                  {calorieTooltip.unit}
                </Text>
              </View>
            )}
            {/* @ts-ignore */}
            <LineChart
              data={calorieData}
              width={lineChartWidth + 110}
              height={200}
              yAxisInterval={1}
              chartConfig={calorieChartConfig}
              bezier
              style={{
                ...styles.chart,
                marginLeft: -55,
                marginBottom: -10,
              }}
              withHorizontalLabels={false}
              xLabelsOffset={-5}
              // @ts-ignore
              onDataPointClick={({ value, index, x, y }) => {
                const d = dayStats[index];
                setCalorieTooltip({
                  visible: true,
                  x,
                  y,
                  label: d.label,
                  value,
                  unit: "cal",
                });
                setTimeout(() => {
                  setCalorieTooltip((prev) => ({ ...prev, visible: false }));
                }, 1750);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  container: {
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#D32F2F",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 12,
  },
  workoutStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 2,
  },
  progressLine: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 10,
  },
  workoutStatus: {
    fontSize: 13,
    fontWeight: "500",
  },
  workoutCompleted: {
    color: "#18A558",
  },
  calorieRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  calorieConsumedLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  calorieConsumedValue: {
    fontSize: 15,
    fontWeight: "600",
  },
  progressBarBackground: {
    flexDirection: "row",
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E5E5EA",
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: {
    backgroundColor: "#000",
  },
  calorieBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  smallInfoBox: {
    flex: 1,
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  smallInfoLabel: {
    fontSize: 11,
    color: "#8E8E93",
  },
  smallInfoValue: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  smallCard: {
    flex: 1,
  },
  smallCardLabel: {
    fontSize: 13,
    color: "#8E8E93",
  },
  smallCardValue: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#E5E5EA",
    borderRadius: 999,
    padding: 2,
    width: 160,
    position: "relative",
    overflow: "hidden",
  },
  segmentThumb: {
    position: "absolute",
    top: 2,
    bottom: 2,
    width: "50%",
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  segmentText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  segmentTextActive: {
    color: "#000",
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 12,
    marginBottom: 6,
  },
  chartWrapper: {
    marginTop: 4,
    height: 200,
    justifyContent: "center",
    alignItems: "flex-start",
    position: "relative",
    borderColor: "#000",
    borderRadius: 16,
    overflow: "visible",
    width: chartFrameWidth,
    alignSelf: "center",
    paddingHorizontal: chartInnerPadding,
  },
  chart: {
    borderRadius: 16,
  },
  tooltip: {
    position: "absolute",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#111827",
    borderRadius: 12,
    zIndex: 10,
  },
  tooltipText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "500",
  },
});
