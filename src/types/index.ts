// Database Food item (from Foods table)
export interface FoodDatabaseItem {
  Foods_ID: number;
  Foods_Name: string;
  Calories_Per_Serving: number;
  Foods_Category?: string;
}

// Food log entry (from FoodLog table with joined Food data)
export interface FoodLogItem {
  FoodLog_ID: number;
  Users_ID: number;
  Foods_ID: number;
  FoodLog_Date: string;
  Serving_Quantity: number;
  Foods_Name: string;
  Calories_Per_Serving: number;
  Foods_Category: string; 
}

// Local display item
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  portion: string;
  category: string;
}

export interface Meal {
  mealName: string;
  targetCalories: number;
  foods: FoodLogItem[];
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
