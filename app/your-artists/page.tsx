
import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image'

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

async function fetchTopArtists(accessToken: string): Promise<Artist[]> {
  try {
    const res = await fetch(`http://localhost:3000/api/your-artists`, {
      headers: {
        'Authorization': `${accessToken}`
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error fetching top artists: ${res.status} ${res.statusText} - ${text}`);
    }
    console.log('Top artists:', res);
    const data = await res.json();
    return data.items;
  } catch (error) {
    console.error('Failed to fetch top artists:', error);
    throw error;
  }
}

const YourArtists = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const allCookies = cookieStore.getAll();
  console.log('All cookies in artis page:', allCookies);


  if (!accessToken) {
    return <div>Error: No access token provided</div>;
  }

  try {
    const topArtists = await fetchTopArtists(accessToken);

    return (
      <div>
        <h1>Your Top Artists</h1>
        <ul>
          {topArtists.map((artist) => (
            <li key={artist.id}>
              <Link href={`/api/artist?id=${artist.id}`}>
              <Image
                  src={artist.images[0].url}
                  width={500}
                  height={500}
                  alt="Picture of the author"
                />
                <p>{artist.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return <div>Error: Failed to fetch top artists</div>;
  }
};

export default YourArtists;
