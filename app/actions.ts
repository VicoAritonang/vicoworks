'use server';

import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/* =========================================================================
   COUNTERS
   -------------------------------------------------------------------------
   The only thing Supabase still does. Page content comes from `content/`, so
   nothing here can stop a page from rendering: every function swallows its
   errors and returns null, and every caller treats null as "no number today".

   Deliberately no revalidatePath() — the pages are static now, and busting
   that cache on every page view was what made the site slow.

   Likes are keyed by the project slug rather than a database id, because the
   slug is the identifier that exists in the repo. That needs a table:

     create table if not exists project_likes (
       slug  text primary key,
       count integer not null default 0
     );
     alter table project_likes enable row level security;
     create policy "read"   on project_likes for select using (true);
     create policy "update" on project_likes for update using (true);
     create policy "insert" on project_likes for insert with check (true);

   Until it exists, the button degrades to a local-only count.
   ========================================================================= */

function client(): SupabaseClient {
  return (supabaseAdmin || supabase) as SupabaseClient;
}

export async function incrementVisitorCount(): Promise<number | null> {
  try {
    const db = client();

    const read = await db.from('statistics').select('id, visitor_count').single();
    if (read.error || !read.data) return null;

    const row = read.data as { id: string; visitor_count: number | null };
    const next = (row.visitor_count ?? 0) + 1;

    const write = await db.from('statistics').update({ visitor_count: next }).eq('id', row.id);
    if (write.error) return null;

    return next;
  } catch {
    return null;
  }
}

export async function getProjectLikes(slug: string): Promise<number | null> {
  try {
    const read = await client().from('project_likes').select('count').eq('slug', slug).maybeSingle();
    if (read.error) return null;
    return ((read.data as { count: number | null } | null)?.count ?? 0) as number;
  } catch {
    return null;
  }
}

export async function likeProject(slug: string): Promise<number | null> {
  try {
    const db = client();

    const read = await db.from('project_likes').select('count').eq('slug', slug).maybeSingle();
    if (read.error) return null;

    const current = (read.data as { count: number | null } | null)?.count ?? null;
    const next = (current ?? 0) + 1;

    const write =
      current === null
        ? await db.from('project_likes').insert({ slug, count: next })
        : await db.from('project_likes').update({ count: next }).eq('slug', slug);

    if (write.error) return null;
    return next;
  } catch {
    return null;
  }
}
