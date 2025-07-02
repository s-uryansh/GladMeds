import { NextRequest, NextResponse } from 'next/server';

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Missing coordinates' }, { status: 400 });
  }

  const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${lng},${lat},20000&bias=proximity:${lng},${lat}&limit=20&apiKey=${GEOAPIFY_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const hospitals = data.features.map((feature: any) => ({
      id: feature.properties.place_id,
      name: feature.properties.name || 'Unnamed Hospital',
      phone: feature.properties.phone || null,
      location: feature.properties.address_line1 || '',
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
      distance: feature.properties.distance || null,
    }));

    return NextResponse.json(hospitals);
  } catch (err) {
    console.error('Geoapify fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch nearby hospitals' }, { status: 500 });
  }
}
