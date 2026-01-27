import { NextRequest, NextResponse } from 'next/server';
import { withApiSecurity, validatePagination } from '@/lib/api/security';

// Generate mock history data
function generateMockHistory() {
  const entries = [];
  const now = new Date();

  // Food items with emojis
  const meals = [
    { name: 'Pizza Lunch', emoji: '🍕', description: '2 slices pepperoni pizza, side salad', impact: 50 },
    { name: 'Oatmeal Breakfast', emoji: '🥣', description: 'Oatmeal with berries, honey, and almonds', impact: 30 },
    { name: 'Chicken Salad', emoji: '🥗', description: 'Grilled chicken with mixed greens', impact: 20 },
    { name: 'Pasta Dinner', emoji: '🍝', description: 'Spaghetti with marinara sauce', impact: 55 },
    { name: 'Turkey Sandwich', emoji: '🥪', description: 'Whole wheat bread with turkey and vegetables', impact: 35 },
    { name: 'Greek Yogurt', emoji: '🥛', description: 'Low-fat yogurt with granola', impact: 25 },
    { name: 'Stir Fry', emoji: '🍜', description: 'Vegetable stir fry with brown rice', impact: 40 },
    { name: 'Apple Snack', emoji: '🍎', description: 'Medium apple with peanut butter', impact: 20 },
    { name: 'Burger Meal', emoji: '🍔', description: 'Burger with sweet potato fries', impact: 60 },
    { name: 'Smoothie Bowl', emoji: '🥤', description: 'Berry smoothie with toppings', impact: 35 },
  ];

  // Exercise activities
  const exercises = [
    { activity: 'Morning Run', emoji: '🏃', duration: 30, intensity: 'moderate', impact: -20 },
    { activity: 'Yoga Session', emoji: '🧘', duration: 45, intensity: 'light', impact: -10 },
    { activity: 'Weight Training', emoji: '🏋️', duration: 40, intensity: 'high', impact: -25 },
    { activity: 'Evening Walk', emoji: '🚶', duration: 25, intensity: 'light', impact: -15 },
    { activity: 'Cycling', emoji: '🚴', duration: 50, intensity: 'moderate', impact: -30 },
    { activity: 'Swimming', emoji: '🏊', duration: 35, intensity: 'moderate', impact: -20 },
    { activity: 'Tennis Match', emoji: '🎾', duration: 60, intensity: 'high', impact: -35 },
  ];

  // Insulin types
  const insulinTypes = ['Humalog', 'Novolog', 'Lantus', 'Fiasp', 'Tresiba'];

  // Glucose contexts
  const glucoseContexts = [
    { note: 'After lunch spike, within target range', status: 'Healthy' },
    { note: 'Before lunch, stable reading', status: 'Healthy' },
    { note: 'Morning reading, excellent control', status: 'Healthy' },
    { note: 'Pre-dinner check, slightly elevated', status: 'Elevated' },
    { note: 'Post-exercise, in good range', status: 'Healthy' },
    { note: 'Fasting reading, optimal level', status: 'Healthy' },
  ];

  // Generate 150 entries over the last 7-14 days
  const daysBack = 10;
  let entryId = 1;

  for (let day = 0; day < daysBack; day++) {
    const date = new Date(now);
    date.setDate(date.getDate() - day);

    // Generate 12-18 entries per day
    const entriesPerDay = Math.floor(Math.random() * 7) + 12;

    for (let i = 0; i < entriesPerDay; i++) {
      const entryDate = new Date(date);
      entryDate.setHours(Math.floor(Math.random() * 24));
      entryDate.setMinutes(Math.floor(Math.random() * 60));

      // Randomly choose entry type (weighted: more glucose and meals)
      const rand = Math.random();
      let type: 'meal' | 'glucose' | 'insulin' | 'exercise';

      if (rand < 0.35) {
        type = 'glucose';
      } else if (rand < 0.65) {
        type = 'meal';
      } else if (rand < 0.85) {
        type = 'insulin';
      } else {
        type = 'exercise';
      }

      let data: any = {};

      switch (type) {
        case 'meal':
          const meal = meals[Math.floor(Math.random() * meals.length)];
          data = {
            name: meal.name,
            emoji: meal.emoji,
            description: meal.description,
            impact: meal.impact + Math.floor(Math.random() * 10) - 5,
            carbs: Math.floor(meal.impact / 1.5) + Math.floor(Math.random() * 10)
          };
          break;

        case 'glucose':
          const context = glucoseContexts[Math.floor(Math.random() * glucoseContexts.length)];
          const value = Math.floor(Math.random() * 100) + 80; // 80-180 mg/dL
          data = {
            value,
            unit: 'mg/dL',
            note: context.note,
            status: value > 160 ? 'Elevated' : value < 90 ? 'Low' : context.status,
            source: 'Dexcom'
          };
          break;

        case 'insulin':
          data = {
            amount: Math.floor(Math.random() * 8) + 2, // 2-10 units
            insulinType: insulinTypes[Math.floor(Math.random() * insulinTypes.length)],
            delivery: Math.random() > 0.3 ? 'bolus' : 'basal',
            note: 'Meal bolus'
          };
          break;

        case 'exercise':
          const exercise = exercises[Math.floor(Math.random() * exercises.length)];
          data = {
            activity: exercise.activity,
            emoji: exercise.emoji,
            duration: exercise.duration + Math.floor(Math.random() * 10) - 5,
            intensity: exercise.intensity,
            impact: exercise.impact + Math.floor(Math.random() * 10) - 5
          };
          break;
      }

      entries.push({
        id: `entry-${entryId++}`,
        type,
        timestamp: entryDate.toISOString(),
        data
      });
    }
  }

  // Sort by timestamp descending (most recent first)
  entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return entries;
}

async function handler(request: NextRequest, _context: { user?: { userId: string; email: string } }) {
  // Note: user available via _context.user for filtering by userId in production
  try {
    const searchParams = request.nextUrl.searchParams;
    const typeParam = searchParams.get('type') || 'meals';

    // Validate pagination with bounds (max 100 entries)
    const { limit, offset } = validatePagination(
      searchParams.get('limit'),
      searchParams.get('offset'),
      100
    );

    // Generate mock data - in production, fetch from database using user.userId
    let allEntries = generateMockHistory();

    // Filter by type (handle plural forms from frontend)
    if (typeParam !== 'all') {
      // Convert plural to singular for filtering
      const typeMap: Record<string, string> = {
        'meals': 'meal',
        'glucose': 'glucose',
        'exercise': 'exercise',
        'insulin': 'insulin'
      };
      const type = typeMap[typeParam] || typeParam;
      allEntries = allEntries.filter(entry => entry.type === type);
    }

    // Apply pagination
    const paginatedEntries = allEntries.slice(offset, offset + limit);
    const hasMore = offset + limit < allEntries.length;

    return NextResponse.json({
      entries: paginatedEntries,
      total: allEntries.length,
      hasMore,
      offset,
      limit
    });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export const GET = withApiSecurity(handler, { requireAuth: true });
