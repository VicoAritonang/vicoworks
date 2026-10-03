'use server';

import { createHash } from 'node:crypto';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { enDash } from '@/lib/text';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export interface SignState {
  ok: boolean;
  error?: string;
}

const client = () => supabaseAdmin ?? supabase;

/** Visible entries, newest first. `unavailable` when the table is missing or Supabase is down. */
export async function getGuestbookEntries(): Promise<{ entries: GuestbookEntry[]; unavailable: boolean }> {
  try {
    const { data, error } = await client()
      .from('guestbook')
      .select('id, name, message, created_at')
      .eq('hidden', false)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return { entries: [], unavailable: true };
    return { entries: enDash((data ?? []) as GuestbookEntry[]), unavailable: false };
  } catch {
    return { entries: [], unavailable: true };
  }
}

const clean = (v: FormDataEntryValue | null) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export async function signGuestbook(_prev: SignState, form: FormData): Promise<SignState> {
  /* Honeypot: a field humans never see. Pretend it worked. */
  if (clean(form.get('website'))) return { ok: true };

  /* Bots submit instantly; people take a few seconds to type. */
  const startedAt = Number(form.get('t'));
  if (!startedAt || Date.now() - startedAt < 2500) return { ok: false, error: 'That was quick – give it a second and try again.' };

  const name = clean(form.get('name'));
  const message = clean(form.get('message'));
  if (name.length < 1 || name.length > 40) return { ok: false, error: 'Name should be 1–40 characters.' };
  if (message.length < 2 || message.length > 280) return { ok: false, error: 'Message should be 2–280 characters.' };
  if (/https?:\/\/|www\./i.test(message + name)) return { ok: false, error: 'Links are not allowed in the guestbook.' };

  const h = await headers();
  const ip = (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip') || 'unknown';
  const ipHash = createHash('sha256')
    .update(`${process.env.GUESTBOOK_SALT ?? 'vicoworks-guestbook'}:${ip}`)
    .digest('hex');

  try {
    const { error } = await client().from('guestbook').insert({ name, message, ip_hash: ipHash });
    if (error) {
      if (error.message.includes('rate_limited')) return { ok: false, error: 'You have signed a few times already – try again in a few minutes.' };
      return { ok: false, error: 'The guestbook is unavailable right now. Please try again later.' };
    }
  } catch {
    return { ok: false, error: 'The guestbook is unavailable right now. Please try again later.' };
  }

  revalidatePath('/guestbook');
  return { ok: true };
}
