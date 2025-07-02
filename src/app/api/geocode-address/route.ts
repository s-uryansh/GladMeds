import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address');
  if (!address) return NextResponse.json({ error: 'No address provided' }, { status: 400 });

  const apiKey = process.env.GEOAPIFY_API_KEY;
  const encoded = encodeURIComponent(address);
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encoded}&apiKey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const result = data?.features?.[0]?.geometry?.coordinates;
  if (!result) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 });
  }

  const [lng, lat] = result;
  return NextResponse.json({ lat, lng });
}
