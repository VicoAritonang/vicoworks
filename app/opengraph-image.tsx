import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { PROFILE_PHOTO } from '@/content/home';

/* The share card: what LinkedIn, WhatsApp, X and Slack show for every link
   to vicoworks.com. Name, role and face – the three things that make someone
   recognise a person in a feed. */

export const alt = 'Vico Aritonang – AI Engineer in Indonesia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const photo = await readFile(path.join(process.cwd(), 'public', PROFILE_PHOTO));
  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000',
          color: '#fafafa',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* colourful glow */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            bottom: -200,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(240,0,204,0.35) 0%, rgba(0,68,255,0.25) 40%, transparent 70%)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', flex: 1 }}>
          <div style={{ display: 'flex', fontSize: 22, letterSpacing: 6, color: '#a1a1a1', fontFamily: 'monospace' }}>
            VICOWORKS.COM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 92, lineHeight: 1, letterSpacing: -2 }}>Vico Aritonang</div>
            <div
              style={{
                display: 'flex',
                marginTop: 18,
                fontSize: 64,
                fontStyle: 'italic',
                backgroundImage: 'linear-gradient(90deg, #04f, #f0c, #ff8000)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              AI engineer
            </div>
            <div style={{ display: 'flex', marginTop: 28, fontSize: 28, color: '#d4d4d4', fontFamily: 'sans-serif' }}>
              Agentic AI · RAG · Go · Cloud
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 18, color: '#737373', fontFamily: 'monospace', letterSpacing: 2 }}>
            JAKARTA, INDONESIA · CO-FOUNDER @ AVAGENC
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingRight: 72 }}>
          <div
            style={{
              display: 'flex',
              padding: 10,
              borderRadius: 32,
              border: '1px solid #262626',
              transform: 'rotate(4deg)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoSrc} alt="" width={330} height={440} style={{ borderRadius: 22, objectFit: 'cover', objectPosition: 'top' }} />
          </div>
        </div>
      </div>
    ),
    size
  );
}
