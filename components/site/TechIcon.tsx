import {
  siAndroid,
  siArc,
  siFigma,
  siGhostty,
  siGmail,
  siGooglecalendar,
  siLinear,
  siSpotify,
  siZedindustries,
  siClaude,
  siDocker,
  siGithub,
  siGo,
  siGooglecloud,
  siGooglegemini,
  siN8n,
  siNextdotjs,
  siPostgresql,
  siPython,
  siReact,
  siSupabase,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from 'simple-icons';

const ICONS: Record<string, SimpleIcon> = {
  Android: siAndroid,
  Claude: siClaude,
  Docker: siDocker,
  GitHub: siGithub,
  Go: siGo,
  'Google Cloud': siGooglecloud,
  Gemini: siGooglegemini,
  n8n: siN8n,
  'Next.js': siNextdotjs,
  PostgreSQL: siPostgresql,
  Python: siPython,
  React: siReact,
  Supabase: siSupabase,
  'Tailwind CSS': siTailwindcss,
  TypeScript: siTypescript,
  Vercel: siVercel,
  Zed: siZedindustries,
  'Claude Code': siClaude,
  Ghostty: siGhostty,
  Arc: siArc,
  Linear: siLinear,
  Figma: siFigma,
  Gmail: siGmail,
  'Google Calendar': siGooglecalendar,
  Spotify: siSpotify,
};

/* Simple Icons has no AWS service marks, so those get a plain brand-orange tile. */
const FALLBACK_COLORS: Record<string, string> = {
  AWS: '#FF9900',
  Lambda: '#FF9900',
  'Step Functions': '#E7157B',
};

/** Brands whose official colour is black – they flip to white in dark mode. */
const MONO = new Set(['Next.js', 'Vercel', 'GitHub', 'Zed', 'Ghostty']);

interface TechIconProps {
  name: string;
  className?: string;
  /** Render in the brand colour instead of currentColor. */
  brand?: boolean;
}

export function TechIcon({ name, className = 'size-3.5', brand = true }: TechIconProps) {
  const icon = ICONS[name];

  if (!icon) {
    const color = FALLBACK_COLORS[name] ?? 'currentColor';
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" fill={color} />
        <text
          x="12"
          y="16.5"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          fill="#fff"
          fontFamily="system-ui, sans-serif"
        >
          {name[0]}
        </text>
      </svg>
    );
  }

  const mono = MONO.has(name);
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} ${brand && mono ? 'fill-black dark:fill-white' : ''}`}
      fill={brand && !mono ? `#${icon.hex}` : brand ? undefined : 'currentColor'}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}
