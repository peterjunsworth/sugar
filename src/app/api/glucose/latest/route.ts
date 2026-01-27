import { NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/api/security';

async function handler(_request: NextRequest, _context: { user?: { userId: string; email: string } }) {
  // Note: user available via _context.user for filtering by userId in production
  // Mock glucose data - in production, fetch from database using user.userId
  const glucoseValue = 70 + Math.random() * 110; // Random value between 70-180 mg/dL
  const trends = ['up', 'down', 'stable'];
  const trend = trends[Math.floor(Math.random() * trends.length)];

  let status = "You're in healthy range";
  if (glucoseValue < 70) {
    status = "Low glucose - take action";
  } else if (glucoseValue > 180) {
    status = "High glucose - check insulin";
  }

  return NextResponse.json({
    value: glucoseValue,
    unit: 'mg/dL',
    status,
    trend,
    timestamp: new Date(),
    source: 'dexcom',
  });
}

export const GET = withApiSecurity(handler, { requireAuth: true });
