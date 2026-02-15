import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Initialize Redis client
// These variables are automatically provided when you link the Upstash integration in Vercel
const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const payload = {
      temperature: body.temperature,
      humidity: body.humidity,
      mq135_raw: body.mq135_raw,
      mq7_raw: body.mq7_raw,
      device: body.device || "ESP32_EcoAir",
      lastUpdated: new Date().toISOString(),
    };

    // Store in Redis - "latest" key for instant access
    await redis.set('ecoair_latest', payload);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Redis POST Error:", error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const data = await redis.get('ecoair_latest');

    if (!data) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}