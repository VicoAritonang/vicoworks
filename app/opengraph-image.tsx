import { ImageResponse } from 'next/og';
import { LOCATION } from '@/lib/seo';

/* The old metadata pointed at /og-image.jpg, which was never committed to
   public/. Every LinkedIn, WhatsApp and Twitter share of vicoworks.com
   rendered a blank card — and a share with no card is a link nobody clicks,
   which is a backlink that never earns its ranking value. */

export const alt = 'Vico Aritonang — AI Engineer in Indonesia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0a0a0c',
          backgroundImage:
            'radial-gradient(circle at 78% 22%, rgba(34,211,238,0.20) 0%, transparent 55%)',
          padding: '72px 80px',
          color: '#eef0f1',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 6,
            color: '#22d3ee',
            fontWeight: 700,
          }}
        >
          VICOWORKS.COM
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: -2,
            }}
          >
            Vico Aritonang
          </div>
          {/* Satori requires one text child per node unless the node is
              explicitly flex — hence the template literal rather than
              interpolating mid-sentence. */}
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, color: '#22d3ee' }}>
            {`AI Engineer · ${LOCATION.country}`}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 27,
              color: '#a7abb2',
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            {'Agentic AI & LLM orchestration, automation systems, Go microservices, and cloud infrastructure on GCP and AWS.'}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 14,
            fontSize: 21,
            color: '#8d929b',
            borderTop: '1px solid rgba(255,255,255,0.14)',
            paddingTop: 26,
          }}
        >
          <span>Agentic AI</span>
          <span style={{ color: '#3a3e45' }}>/</span>
          <span>RAG</span>
          <span style={{ color: '#3a3e45' }}>/</span>
          <span>Go</span>
          <span style={{ color: '#3a3e45' }}>/</span>
          <span>GCP · AWS</span>
          <span style={{ color: '#3a3e45' }}>/</span>
          <span>{LOCATION.label}</span>
        </div>
      </div>
    ),
    size,
  );
}
