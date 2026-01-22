import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db('diabetes-tracker');
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  GLUCOSE_READINGS: 'glucose_readings',
  INSULIN_DOSES: 'insulin_doses',
  MEDICATIONS: 'medications',
  MEALS: 'meals',
  EXERCISES: 'exercises',
  STRESS_LEVELS: 'stress_levels',
  SLEEP_RECORDS: 'sleep_records',
  MEAL_PATTERNS: 'meal_patterns',
  GLUCOSE_PATTERNS: 'glucose_patterns',
  CHAT_SESSIONS: 'chat_sessions',
  CGM_CONFIGS: 'cgm_configs',
} as const;
