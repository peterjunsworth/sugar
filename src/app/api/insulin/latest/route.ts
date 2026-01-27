import { NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/api/security';

async function handler(_request: NextRequest, _context: { user?: { userId: string; email: string } }) {
  // Note: user available via _context.user for filtering by userId in production
  // Mock insulin data - in production, fetch from database using user.userId
  const types = ['Humalog', 'Novolog', 'Lantus', 'Fiasp'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const amount = Math.floor(Math.random() * 10) + 2; // 2-12 units
  const hoursAgo = Math.random() * 5; // 0-5 hours ago

  const timestamp = new Date();
  timestamp.setHours(timestamp.getHours() - Math.floor(hoursAgo));
  timestamp.setMinutes(timestamp.getMinutes() - Math.floor((hoursAgo % 1) * 60));

  return NextResponse.json({
    amount,
    type: randomType,
    delivery: 'bolus',
    timestamp,
    hoursAgo: hoursAgo.toFixed(1),
  });
}

export const GET = withApiSecurity(handler, { requireAuth: true });
