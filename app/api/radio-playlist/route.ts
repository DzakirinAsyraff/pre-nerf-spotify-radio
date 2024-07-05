import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';
// https://api.spotify.com/v1/artists/${artistId}/top-tracks

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get('artistId');
  const access_token = req.headers.get('Authorization');
  //   list of related artist
  let relatedArtist: string[] = [];
  let radioPlaylist: any[] = [];
//   let radioPlaylist: { [key: string]: any }[] = []; // Explicitly typed as an array of objects


 
  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        market: 'US',
      },
    }).then((response) => {
        relatedArtist = response.data.artists.map((artist: any) => artist.id);
        return response;
        });
    
    // for each related artist, get 3 top tracks
    for (const artist of relatedArtist) {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artist}/top-tracks`, {
        headers: {
            Authorization: `Bearer ${access_token}`,
            },
        params: {
            market: 'US',
            },
        });
        // Generate a random number between 0 and 1
        const randomNumber = Math.random();
        // Set a threshold for adding tracks, e.g., 0.5 for a 50% chance
        const threshold = 0.6;
        // Only push tracks if randomNumber is greater than or equal to threshold
        if (randomNumber >= threshold) {
            radioPlaylist.push(...response.data.tracks);
        }
    }
    // shuffle the playlist
    radioPlaylist.sort(() => Math.random() - 0.5);
    const obj = {
        "play": radioPlaylist
    };
    


    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 });
  }
}
