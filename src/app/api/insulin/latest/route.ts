import { NextResponse } from 'next/server';

export async function GET() {
  // Mock insulin data
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
