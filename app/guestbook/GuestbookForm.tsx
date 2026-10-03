'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { signGuestbook, type SignState } from './actions';

export function GuestbookForm() {
  const [state, action, pending] = useActionState<SignState, FormData>(signGuestbook, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt] = useState(() => Date.now());
  const [count, setCount] = useState(0);

  /* Clear the form after a successful signature; onReset zeroes the counter. */
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const input =
    'w-full rounded-xl border border-black/10 bg-white/70 px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-indigo-400 dark:border-white/10 dark:bg-white/5';

  return (
    <form ref={formRef} action={action} onReset={() => setCount(0)} className="flex flex-col gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line sm:p-5">
      <input type="hidden" name="t" value={startedAt} />
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="sr-only" htmlFor="gb-name">
        Name
      </label>
      <input id="gb-name" name="name" required maxLength={40} placeholder="Your name" autoComplete="name" className={input} />
      <label className="sr-only" htmlFor="gb-message">
        Message
      </label>
      <div className="relative">
        <textarea
          id="gb-message"
          name="message"
          required
          minLength={2}
          maxLength={280}
          rows={3}
          placeholder="Say hi, leave a note, share a thought…"
          onChange={(e) => setCount(e.target.value.length)}
          className={`${input} resize-none pb-7`}
        />
        <span className="pointer-events-none absolute right-3 bottom-2.5 font-mono text-[10px] text-neutral-400">{count}/280</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <AnimatePresence mode="wait">
          {state.error ? (
            <motion.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-rose-500" role="alert">
              {state.error}
            </motion.p>
          ) : state.ok ? (
            <motion.p key="ok" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-sm text-emerald-600 dark:text-emerald-400" role="status">
              Thanks for signing! ✦
            </motion.p>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-muted">
              Be kind. Links are not allowed.
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-transform active:scale-95 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-black"
        >
          {pending ? 'Signing…' : 'Sign the guestbook'}
          <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </form>
  );
}
