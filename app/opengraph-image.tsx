import { ImageResponse } from 'next/og';
import { profile } from '@/content/profile';

/* The metadata used to point at /og-image.jpg, which was never in public/.
   Every time this link was pasted into LinkedIn or WhatsApp the preview came
   back blank — the first impression, missing, on the one channel that matters
   for a job search. Generated at build time instead. */

export const alt = 'Vico Aritonang — AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0d0f12',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              backgroundColor: '#d4744a',
              transform: 'rotate(45deg)',
            }}
          />
          <div style={{ color: '#8b8d91', fontSize: 24, letterSpacing: 2 }}>{profile.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              color: '#e7e5e2',
              fontSize: 68,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 900,
            }}
          >
            {profile.claim}
          </div>
          <div
            style={{
              marginTop: 32,
              width: 160,
              height: 3,
              backgroundColor: '#d4744a',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 28, color: '#62666b', fontSize: 22 }}>
          {profile.proof.map((item) => (
            <div key={item} style={{ display: 'flex' }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
