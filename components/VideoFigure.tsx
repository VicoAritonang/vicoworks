'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import type { ProjectVideo } from '@/content/types';

/* =========================================================================
   VIDEO FIGURE
   -------------------------------------------------------------------------
   A facade, not an embed. Until someone presses play this is a thumbnail and
   a button — no YouTube iframe, no player bundle, no third-party cookies set
   on a reader who only came for the writing. Pressing play swaps in the real
   player with `autoplay=1`, so the click that opens it is also the click that
   starts it.

   The thumbnail comes from i.ytimg.com and is allowed to fail: if it does,
   the panel underneath is already the right shape and colour, and the play
   button still sits on top of it.
   ========================================================================= */

function thumbnail(id: string) {
  // maxres does not exist for every upload; hq720 is generated for all of
  // them and is still sharp at the width this renders at.
  return `https://i.ytimg.com/vi/${id}/hq720.jpg`;
}

export function VideoFigure({ video, eager = false }: { video: ProjectVideo; eager?: boolean }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="group/vid">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-panel shadow-[var(--shadow-panel)]">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${video.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail(video.youtubeId)}
              alt=""
              loading={eager ? 'eager' : 'lazy'}
              className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all duration-500 group-hover/vid:scale-[1.015] group-hover/vid:opacity-95"
            />
            {/* Scrim: keeps the play control legible over any frame, and pulls
                the thumbnail towards the page's own palette. */}
            <span
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0.12)_45%,rgba(0,0,0,0.3))]"
              aria-hidden="true"
            />

            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/45 backdrop-blur-md transition-all duration-300 group-hover/vid:border-accent group-hover/vid:bg-accent sm:h-20 sm:w-20">
                <Play
                  size={22}
                  className="ml-0.5 fill-white text-white transition-colors group-hover/vid:fill-[var(--accent-fg)] group-hover/vid:text-[var(--accent-fg)]"
                />
              </span>
            </span>

            <span
              className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-left"
              aria-hidden="true"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase">
                Demo · walkthrough
              </span>
              {video.placeholder && process.env.NODE_ENV !== 'production' && (
                <span className="rounded border border-white/25 bg-black/50 px-2 py-1 font-mono text-[10px] tracking-wider text-white/80 uppercase">
                  Placeholder reel
                </span>
              )}
            </span>
          </button>
        )}
      </div>

      {video.caption && (
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">{video.caption}</figcaption>
      )}
    </figure>
  );
}
