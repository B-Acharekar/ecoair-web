import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Initialize Redis client
const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Fetch the command state from Firestore (The Mailbox)
    const cmdDoc = await getDoc(doc(db, "commands", "purifier"));
    const isForcedOn = cmdDoc.exists() ? cmdDoc.data().active : false;

    // 2. Standard sensor payload logging to Redis
    const payload = {
      temperature: body.temperature,
      humidity: body.humidity,
      mq135_raw: body.mq135_raw,
      mq7_raw: body.mq7_raw,
      device: body.device || "ESP32_EcoAir",
      lastUpdated: new Date().toISOString(),
    };

    await redis.set('ecoair_latest', payload);

    // 3. Construct the response for ESP32
    // We return both "command" for the snippet compatibility and "cmd" for user preference
    return NextResponse.json({ 
      success: true, 
      command: isForcedOn ? "RELAY_ON" : "RELAY_OFF",
      cmd: isForcedOn ? 1 : 0,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 400 });
  }
}

export async function GET() {
  try {
    const [latest, target] = await Promise.all([
      redis.get('ecoair_latest'),
      redis.get('ecoair_target')
    ]);

    if (!latest) {
      return NextResponse.json({ error: "No data found" }, { status: 404 });
    }

    return NextResponse.json({
      ...(latest as object),
      target: target || { purifierOn: false, fanSpeed: 0, mode: "AUTO" }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}