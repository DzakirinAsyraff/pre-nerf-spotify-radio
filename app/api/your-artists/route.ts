
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const access_token = req.headers.get('Authorization');

  if (!access_token) {
    return NextResponse.json({ error: 'No access token provided' }, { status: 400 });
  }

  try {
    // console.log('Fetching top artists with token:', access_token);
    const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log('Top artists:', response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Failed to fetch top artists:', error);
    return NextResponse.json({ error: 'Failed to fetch top artists' }, { status: 500 });
  }
}
