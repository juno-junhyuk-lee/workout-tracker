export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  portion: string;
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  category: string;
}

export interface Meal {
  mealName: string;
  targetCalories: number;
  foods: FoodItem[];
}

export interface MacroData {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export interface CalorieData {
  consumed: number;
  goal: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}
