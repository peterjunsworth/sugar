import { NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/api/security';

async function handler(_request: NextRequest, _context: { user?: { userId: string; email: string } }) {
  // Note: user available via _context.user for filtering by userId in production
  // Mock meal data - in production, fetch from database using user.userId
  const meals = [
    { name: 'Pizza', carbs: 60, impact: 45 },
    { name: 'Salad', carbs: 15, impact: 20 },
    { name: 'Pasta', carbs: 55, impact: 50 },
    { name: 'Chicken & Rice', carbs: 40, impact: 35 },
    { name: 'Sandwich', carbs: 35, impact: 30 },
  ];

  const randomMeal = meals[Math.floor(Math.random() * meals.length)];
  const hoursAgo = Math.floor(Math.random() * 4) + 1;

  const timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - hoursAgo);

  return NextResponse.json({
    name: randomMeal.name,
    carbs: randomMeal.carbs,
    impact: randomMeal.impact,
    timestamp,
    hoursAgo,
  });
}

export const GET = withApiSecurity(handler, { requireAuth: true });
