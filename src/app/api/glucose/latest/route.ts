import { NextResponse } from 'next/server';

export async function GET() {
  // Mock glucose data
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
