import React from 'react';
import { cookies } from 'next/headers';
import Image from 'next/image';

interface Artist {
  id: string;
  name: string;
}

interface Track {
  id: string;
  name: string;
}

async function fetchRadioPlaylist(artistId: string, accessToken: string): Promise<any> {
  try {
    const res = await fetch(`http://localhost:3000/api/radio-playlist?artistId=${artistId}`, {
      headers: {
        'Authorization': `${accessToken}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error fetching radio playlist: ${res.status} ${res.statusText} - ${text}`);
    }

    const data = await res.json();
    return data.play;
  } catch (error) {
    console.error('Failed to get radio playlist:', error);
    throw error;
  }
}


const ArtistPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  // const accessToken = cookieStore.get('access_token')?.value;
  // const accessToken = 'BQBp-gBvEQxmQORiJhhBq_pDrvTgwugpd0-lj_tdSL0QK9idjFEJlkJ_cqBfQMEU6E0GcCl1VWaKYp3aQYXrZCLbyJ98dTUqBkc5fplrYh_GP6B-jAotiMGE3Y_yDY0vVcGUG-hZXRYUynhriozduKdDnLmj7oa762pDRTRjKe_zG5uFAnXx09od'

  if (!accessToken) {
    return <div>Error: No access token provided</div>;
  }

  try {
    const artistId = params.id;
    // const relatedArtists = await fetchRelatedArtists(artistId, accessToken);
    // const topTracks = await fetchTopTracks(artistId, accessToken);
    const radioPlaylist = await fetchRadioPlaylist(artistId, accessToken);
    // console.log('Radio playlist:', radioPlaylist);

    return (
      <div>
        {/* <h1>Related Artists and Their Top Tracks</h1>
        <h2>Related Artists</h2>
        <ul>
          {relatedArtists.map((artist) => (
            <li key={artist.id}>{artist.name}</li>
          ))}
        </ul> */}
        <h2>{`Radio Playlist (${radioPlaylist.length} tracks)`}</h2>
        <ul>
      {radioPlaylist.map((track: any) => (
        <li key={track.id}>
          <Image src={track.album.images[0].url} alt={`Album cover for ${track.name}`} width={300} height={300}  />
          <div>{track.name}</div>
          <div>Artists: {track.artists.map((artist: any) => artist.name).join(', ')}</div>
        </li>
      ))}
    </ul>
      </div>
    );
  } catch (error) {
    return <div>Error: Failed to fetch data for artist</div>;
  }
};

export default ArtistPage;
