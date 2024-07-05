import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code') || null;

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      code: code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  try {
    console.log('Requesting token with code:', code);
    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });

    const { access_token, refresh_token } = response.data;
    console.log('Tokens received:', { access_token, refresh_token });

    // const responseCookie = new NextResponse(null, { status: 302 });

    // responseCookie.cookies.set('access_token', access_token, { path: '/', httpOnly: true, secure: true });
    // responseCookie.cookies.set('refresh_token', refresh_token, { path: '/', httpOnly: true, secure: true });
    // cookies().set('access_token', access_token);
    // cookies().set('refresh_token', refresh_token);
    // responseCookie.headers.set('Location', '/your-artists');
    // return responseCookie;
    cookies().getAll().forEach((cookie) => {
      console.log('Cookie in callback:', cookie);
    });
    // return NextResponse.redirect(`${req.nextUrl.origin}/your-artists`);
    const result = NextResponse.redirect(`${req.nextUrl.origin}/your-artists`);
    
    result.cookies.set('access_token', access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
  
    // result.cookies.set('refresh_token', refresh_token, {
    //   path: '/',
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'Strict'
    // });

return result;
  } catch (error: any) {
    console.error('Failed to authenticate:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
