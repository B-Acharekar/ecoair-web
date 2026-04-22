// app/api/aqi/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city'); // This gets "mumbai" from ?city=mumbai
    const token = process.env.WAQI_API_TOKEN;

    if (!city) return NextResponse.json({ error: 'City is required' }, { status: 400 });

    try {
        const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
        const data = await res.json();
        
        if (data.status !== "ok") throw new Error("API Error");

        return NextResponse.json({
            aqi: data.data.aqi,
            city: data.data.city.name,
            status: "ok"
        });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}