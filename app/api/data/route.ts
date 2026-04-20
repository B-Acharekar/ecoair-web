import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const redis = Redis.fromEnv();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    // 1. Check if the request is actually JSON
    const body = await request.json().catch(() => null);
    
    if (!body) {
      console.error("Empty or invalid JSON body received");
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 2. Logging incoming data for debugging
    console.log("Inbound from ESP32:", body);

    // 3. Parallel Execution: Save to Redis and Fetch Command simultaneously
    // This reduces the time the ESP32 has to wait!
    const payload = {
      temperature: body.temperature ?? 0,
      humidity: body.humidity ?? 0,
      mq135_raw: body.mq135_raw ?? 0,
      mq7_raw: body.mq7_raw ?? 0,
      device: body.device || "ESP32_EcoAir",
      lastUpdated: new Date().toISOString(),
    };

    const [cmdDoc] = await Promise.all([
      getDoc(doc(db, "commands", "purifier")),
      redis.set('ecoair_latest', payload)
    ]);

    const isForcedOn = cmdDoc.exists() ? cmdDoc.data().active : false;

    // 4. Send response back to ESP32
    return NextResponse.json({ 
      success: true, 
      command: isForcedOn ? "RELAY_ON" : "RELAY_OFF",
      cmd: isForcedOn ? 1 : 0,
      timestamp: new Date().toISOString()
    }, { status: 200 });
    
  } catch (error: any) {
    // This will show up in your Vercel Runtime Logs
    console.error("CRITICAL API ERROR:", error.message);
    return NextResponse.json({ error: 'Sync failed', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Use Promise.all to fetch everything at once
    const [latest, target] = await Promise.all([
      redis.get('ecoair_latest'),
      redis.get('ecoair_target')
    ]);

    if (!latest) {
      // Return 200 with empty state instead of 404 to prevent frontend crashing
      return NextResponse.json({ 
        temperature: 0, 
        humidity: 0, 
        msg: "Wait for ESP32 to send data..." 
      }, { status: 200 });
    }

    return NextResponse.json({
      ...(latest as object),
      target: target || { purifierOn: false, fanSpeed: 0, mode: "AUTO" }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: 'Connection failed' }, { status: 500 });
  }
}