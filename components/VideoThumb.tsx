import Link from 'next/link';
import { Play } from 'lucide-react';
import type { ProjectVideo } from '@/content/types';

/* The still, not the player. Used anywhere a project is listed rather than
   read: it links through to the case study, where the real embed lives.

   Deliberately a server component — there is no state here, so a card grid
   should not be shipping the facade's click handler to the browser. */

export function VideoThumb({
  video,
  href,
  label = 'Watch the walkthrough',
  className = '',
}: {
  video: ProjectVideo;
  href: string;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={`${label}: ${video.title}`}
      className={`group/thumb relative block aspect-video w-full overflow-hidden rounded-lg border border-line bg-panel ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${video.youtubeId}/hq720.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-500 group-hover/thumb:scale-[1.02] group-hover/thumb:opacity-90"
      />
      <span
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.6),rgba(0,0,0,0.1)_55%)]"
        aria-hidden="true"
      />

      <span
        className="absolute right-3 bottom-3 flex items-center gap-2 rounded-full border border-white/20 bg-black/50 py-1.5 pr-3 pl-2 backdrop-blur-md transition-colors group-hover/thumb:border-accent group-hover/thumb:bg-accent"
        aria-hidden="true"
      >
        <Play
          size={11}
          className="fill-white text-white transition-colors group-hover/thumb:fill-[var(--accent-fg)] group-hover/thumb:text-[var(--accent-fg)]"
        />
        <span className="font-mono text-[10px] tracking-[0.16em] text-white uppercase transition-colors group-hover/thumb:text-[var(--accent-fg)]">
          {label}
        </span>
      </span>
    </Link>
  );
}
