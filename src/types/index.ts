import { ObjectId } from 'mongodb';

// User and Authentication Types
export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingCompleted?: boolean;
  cgmProvider?: 'dexcom' | 'libre' | 'eversense';
  cgmAccessToken?: string;
  cgmRefreshToken?: string;
}

// Blood Glucose Types
export interface BloodGlucoseReading {
  _id?: string;
  userId: string;
  timestamp: Date;
  value: number; // mg/dL
  trend?: 'rising' | 'falling' | 'stable' | 'rapidlyRising' | 'rapidlyFalling';
  source: 'cgm' | 'manual' | 'dexcom' | 'libre' | 'eversense';
  cgmProvider?: 'dexcom' | 'libre' | 'eversense';
}

// Insulin and Medication Types
export interface InsulinDose {
  _id?: string;
  userId: string;
  timestamp: Date;
  type: 'bolus' | 'basal';
  insulinType: string; // e.g., 'Humalog', 'NovoRapid', 'Lantus'
  units: number;
  notes?: string;
}

export interface Medication {
  _id?: string;
  userId: string;
  timestamp: Date;
  medicationType: string; // e.g., 'Metformin', 'GLP-1'
  dosage: string;
  notes?: string;
}

// Meal and Food Types
export interface FoodGroup {
  carbs: number; // grams
  fats: number; // grams
  proteins: number; // grams
  sugars: number; // grams
  fiber?: number; // grams
}

export interface Meal {
  _id?: string;
  userId: string;
  timestamp: Date;
  name: string; // e.g., 'Pizza', 'Salad'
  description?: string;
  foodGroups: FoodGroup;
  portionSize?: string;
  totalCarbs: number;
  glycemicIndex?: number;
  notes?: string;
}

// Activity and Lifestyle Types
export interface Exercise {
  _id?: string;
  userId: string;
  timestamp: Date;
  type: string; // e.g., 'running', 'walking', 'cycling'
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
}

export interface StressLevel {
  _id?: string;
  userId: string;
  timestamp: Date;
  level: number; // 1-10 scale
  notes?: string;
}

export interface SleepRecord {
  _id?: string;
  userId: string;
  timestamp: Date;
  duration: number; // hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

// Combined Event Type for Timeline
export interface HealthEvent {
  _id?: string;
  userId: string;
  timestamp: Date;
  type: 'glucose' | 'insulin' | 'medication' | 'meal' | 'exercise' | 'stress' | 'sleep';
  data: BloodGlucoseReading | InsulinDose | Medication | Meal | Exercise | StressLevel | SleepRecord;
}

// Pattern Analysis Types
export interface MealPattern {
  _id?: string;
  userId: string;
  mealName: string;
  foodGroups: FoodGroup;
  averageGlucoseImpact: number; // mg/dL change
  optimalInsulinDose?: number;
  optimalTiming?: number; // minutes before meal
  glucoseStability: number; // standard deviation of glucose readings after meal
  occurrences: number;
  lastOccurrence: Date;
  notes?: string;
}

export interface GlucosePattern {
  _id?: string;
  userId: string;
  timeOfDay: string; // e.g., 'morning', 'afternoon', 'evening', 'night'
  averageGlucose: number;
  standardDeviation: number;
  trend: 'rising' | 'falling' | 'stable';
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    extractedData?: {
      type: 'glucose' | 'insulin' | 'medication' | 'meal' | 'exercise' | 'stress' | 'sleep';
      data: any;
    };
  };
}

export interface ChatSession {
  _id?: ObjectId;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// CGM Integration Types
export interface CGMConfig {
  _id?: ObjectId;
  provider: 'dexcom' | 'libre' | 'eversense';
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  lastSync: Date;
}

// API Request/Response Types
export interface N8NWebhookRequest {
  userId: string;
  message: string;
  sessionId?: string;
  context?: {
    recentGlucose?: BloodGlucoseReading[];
    recentMeals?: Meal[];
    recentInsulin?: InsulinDose[];
  };
}

export interface N8NWebhookResponse {
  response: string;
  extractedData?: {
    type: string;
    data: any;
  };
  suggestions?: string[];
}
