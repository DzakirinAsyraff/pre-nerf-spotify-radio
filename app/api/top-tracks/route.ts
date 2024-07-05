import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artistId');
  const cookieStore = cookies();
  const access_token = cookieStore.get('access_token')?.value;
  // const access_token = req.nextUrl.searchParams.get('access_token');
  // const access_token = 'BQBp-gBvEQxmQORiJhhBq_pDrvTgwugpd0-lj_tdSL0QK9idjFEJlkJ_cqBfQMEU6E0GcCl1VWaKYp3aQYXrZCLbyJ98dTUqBkc5fplrYh_GP6B-jAotiMGE3Y_yDY0vVcGUG-hZXRYUynhriozduKdDnLmj7oa762pDRTRjKe_zG5uFAnXx09od'

  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        market: 'US',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 });
  }
}
