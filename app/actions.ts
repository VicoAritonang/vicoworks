'use server';

import { supabaseAdmin, supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Helper to get a typed client
function getClient(): SupabaseClient<Database> {
  return (supabaseAdmin || supabase) as SupabaseClient<Database>;
}

export async function incrementVisitorCount() {
  try {
    const client = getClient();
    
    // 1. Fetch current count
    const result: any = await client
      .from('statistics')
      .select('id, visitor_count')
      .single();

    if (result.error || !result.data) {
      console.error('Error fetching stats for increment:', result.error);
      return;
    }

    const currentStats = result.data as { id: string; visitor_count: number | null };

    // 2. Increment
    const visitorCount = currentStats.visitor_count ?? 0;
    const newCount = visitorCount + 1;
    
    // Use type assertion to bypass TypeScript's strict checking for update
    const updateResult: any = await (client as any)
      .from('statistics')
      .update({ visitor_count: newCount })
      .eq('id', currentStats.id);

    if (updateResult.error) {
      console.error('Error updating visitor count:', updateResult.error);
    } else {
      revalidatePath('/');
    }
  } catch (error) {
    console.error('Unexpected error incrementing visitor count:', error);
  }
}

export async function incrementProjectLike(projectId: string) {
  try {
    const client = getClient();

    const result: any = await client
      .from('projects')
      .select('like_count')
      .eq('id', projectId)
      .single();

    if (result.error || !result.data) {
      console.error('Error fetching project for like:', result.error);
      return null;
    }

    const project = result.data as { like_count: number | null };
    const likeCount = project.like_count ?? 0;
    const newCount = likeCount + 1;

    // Use type assertion to bypass TypeScript's strict checking for update
    const updateResult: any = await (client as any)
      .from('projects')
      .update({ like_count: newCount })
      .eq('id', projectId);

    if (updateResult.error) {
      console.error('Error updating like count:', updateResult.error);
      return null;
    }

    revalidatePath('/projects');
    return newCount;
  } catch (error) {
    console.error('Unexpected error incrementing like count:', error);
    return null;
  }
}
