import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Initialize Redis client
const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validation: Ensure we have data
    if (!body.temperature) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    // 2. Fetch the command state from Firestore
    let isForcedOn = false;
    try {
      const cmdDoc = await getDoc(doc(db, "commands", "purifier"));
      isForcedOn = cmdDoc.exists() ? cmdDoc.data().active : false;
    } catch (fireErr) {
      console.error("Firestore Error:", fireErr);
      // Fallback to false if Firestore is down so the API doesn't crash
    }

    // 3. Log to Redis
    const payload = {
      temperature: body.temperature,
      humidity: body.humidity,
      mq135_raw: body.mq135_raw,
      mq7_raw: body.mq7_raw,
      device: body.device || "ESP32_EcoAir",
      lastUpdated: new Date().toISOString(),
    };

    // Use a timeout or a simple try/catch for Redis
    try {
      await redis.set('ecoair_latest', payload);
    } catch (redisErr) {
      console.error("Redis Write Error:", redisErr);
      // We continue anyway so the ESP32 gets its RELAY command even if Redis logging fails
    }

    return NextResponse.json({ 
      success: true, 
      command: isForcedOn ? "RELAY_ON" : "RELAY_OFF",
      cmd: isForcedOn ? 1 : 0
    }, { status: 200 });
    
  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const latest = await redis.get('ecoair_latest');
    
    if (!latest) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json(latest, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Redis Connection Failed' }, { status: 500 });
  }
}