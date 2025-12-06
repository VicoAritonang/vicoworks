'use server';

import { supabaseAdmin, supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function incrementVisitorCount() {
  // Use admin client if available to bypass RLS, otherwise normal client
  const client = supabaseAdmin || supabase;
  
  try {
    // 1. Fetch current count
    const { data: currentStats, error: fetchError } = await client
      .from('statistics')
      .select('id, visitor_count')
      .single();

    if (fetchError || !currentStats) {
      console.error('Error fetching stats for increment:', fetchError);
      return;
    }

    // 2. Increment
    const newCount = (currentStats.visitor_count || 0) + 1;
    
    const { error: updateError } = await client
      .from('statistics')
      .update({ visitor_count: newCount })
      .eq('id', currentStats.id);

    if (updateError) {
      console.error('Error updating visitor count:', updateError);
    } else {
      revalidatePath('/');
    }
  } catch (error) {
    console.error('Unexpected error incrementing visitor count:', error);
  }
}

export async function incrementProjectLike(projectId: string) {
  const client = supabaseAdmin || supabase;

  try {
    const { data: project, error: fetchError } = await client
      .from('projects')
      .select('like_count')
      .eq('id', projectId)
      .single();

    if (fetchError || !project) {
      console.error('Error fetching project for like:', fetchError);
      return null;
    }

    const newCount = (project.like_count || 0) + 1;

    const { error: updateError } = await client
      .from('projects')
      .update({ like_count: newCount })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating like count:', updateError);
      return null;
    }

    revalidatePath('/projects');
    return newCount;
  } catch (error) {
    console.error('Unexpected error incrementing like count:', error);
    return null;
  }
}
