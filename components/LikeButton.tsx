'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { getProjectLikes, likeProject } from '@/app/actions';

/* Kept, but demoted. It no longer decides what order the work appears in and
   there is no "most popular" ribbon — three projects ranked by clicks told a
   reader nothing except that the site was counting.

   The count loads after hydration so the page itself stays static, and the
   whole control disappears if the backing table is not reachable. */

const SEEN_KEY = 'vw-liked';

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;

    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[];
      // localStorage does not exist during the server render, so this cannot
      // move earlier without the two HTML trees disagreeing.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(seen.includes(slug));
    } catch {
      /* no storage — the button simply stays clickable */
    }

    getProjectLikes(slug).then((value) => {
      if (active && value !== null) setCount(value);
    });

    return () => {
      active = false;
    };
  }, [slug]);

  // No number and no way to get one: show nothing rather than a broken control.
  if (count === null) return null;

  const onClick = async () => {
    if (liked || pending) return;
    setPending(true);
    setCount((c) => (c ?? 0) + 1);
    setLiked(true);

    try {
      const seen = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]') as string[];
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, slug]));
    } catch {
      /* nothing to persist to */
    }

    const next = await likeProject(slug);
    if (next === null) {
      setCount((c) => Math.max(0, (c ?? 1) - 1));
      setLiked(false);
    } else {
      setCount(next);
    }
    setPending(false);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={liked || pending}
      aria-label={liked ? 'You found this interesting' : 'Mark this as interesting'}
      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted transition-colors hover:border-line-2 hover:text-fg disabled:cursor-default disabled:hover:border-line"
    >
      <Heart size={14} className={liked ? 'fill-accent text-accent' : ''} aria-hidden="true" />
      <span className="font-mono text-xs tabular-nums">{count}</span>
    </button>
  );
}
