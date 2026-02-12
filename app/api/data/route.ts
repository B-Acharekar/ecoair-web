import { NextResponse } from 'next/server';

// Temporary in-memory storage (clears if server restarts)
let latestSensorData = {
  temp: 0,
  hum: 0,
  mq135: 0,
  mq7: 0,
  lastUpdated: new Date().toISOString()
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    latestSensorData = { ...data, lastUpdated: new Date().toISOString() };
    console.log(">>> ESP32 Data Received:", latestSensorData);
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json(latestSensorData);
}