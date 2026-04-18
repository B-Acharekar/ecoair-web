import { NextResponse } from 'next/server';

// Official EPA Formula to convert concentration to AQI Index
function calculateAQI(concentration: number, pollutant: 'pm25' | 'pm10') {
    const breakpoints = {
        pm25: [
            { clo: 0, chi: 12, ilo: 0, ihi: 50 },
            { clo: 12.1, chi: 35.4, ilo: 51, ihi: 100 },
            { clo: 35.5, chi: 55.4, ilo: 101, ihi: 150 },
            { clo: 55.5, chi: 150.4, ilo: 151, ihi: 200 },
            { clo: 150.5, chi: 250.4, ilo: 201, ihi: 300 },
            { clo: 250.5, chi: 500.4, ilo: 301, ihi: 500 }
        ],
        pm10: [
            { clo: 0, chi: 54, ilo: 0, ihi: 50 },
            { clo: 55, chi: 154, ilo: 51, ihi: 100 },
            { clo: 155, chi: 254, ilo: 101, ihi: 150 },
            { clo: 255, chi: 354, ilo: 151, ihi: 200 },
            { clo: 355, chi: 424, ilo: 201, ihi: 300 },
            { clo: 425, chi: 604, ilo: 301, ihi: 500 }
        ]
    };

    const bp = breakpoints[pollutant].find(b => concentration <= b.chi) || breakpoints[pollutant][5];
    
    // The AQI Formula: ((Ihi - Ilow) / (Chigh - Clow)) * (C - Clow) + Ilow
    return Math.round(((bp.ihi - bp.ilo) / (bp.chi - bp.clo)) * (concentration - bp.clo) + bp.ilo);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const token = process.env.WAQI_API_TOKEN;

    if (!city || !token) return NextResponse.json({ error: 'Config missing' }, { status: 400 });

    try {
        let response = await fetch(`https://api.waqi.info/feed/${city}/?token=${token}`);
        let data = await response.json();
        
        if (data.status !== 'ok' || !data.data) {
            const searchRes = await fetch(`https://api.waqi.info/search/?keyword=${city}&token=${token}`);
            const searchData = await searchRes.json();
            if (searchData.data?.length > 0) {
                const altRes = await fetch(`https://api.waqi.info/feed/@${searchData.data[0].uid}/?token=${token}`);
                data = await altRes.json();
            }
        }

        if (data.status !== 'ok' || !data.data) {
            return NextResponse.json({ error: 'Station Unavailable' }, { status: 404 });
        }

        const iaqi = data.data.iaqi;
        const rawPm25 = iaqi?.pm25?.v || 0;
        const rawPm10 = iaqi?.pm10?.v || 0;

        const aqiPm25 = calculateAQI(rawPm25, 'pm25');
        const aqiPm10 = calculateAQI(rawPm10, 'pm10');
        
        const finalTrueAQI = Math.max(aqiPm25, aqiPm10, data.data.aqi || 0);

        // SAFE PROPERTY ACCESS:
        // Some stations put geo in data.data.city.geo, others in data.data.geo
        const coordinates = data.data.city?.geo || data.data.geo || [0, 0];

        return NextResponse.json({
            aqi: finalTrueAQI,
            city: data.data.city?.name || "Unknown Station",
            dominentpol: aqiPm25 > aqiPm10 ? "pm2.5" : "pm10",
            geo: coordinates, // Return the safe coordinates
            status: "ok"
        });
    } catch (error) {
        console.error("AQI API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}