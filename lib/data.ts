import { supabase } from './supabase';
import { Database } from '@/types/database';

export type HomeViewData = Database['public']['Tables']['home_view']['Row'];
export type StatisticsData = Database['public']['Tables']['statistics']['Row'];
export type ProjectData = Database['public']['Tables']['projects']['Row'];

export async function getHomeView(): Promise<HomeViewData | null> {
  const { data, error } = await supabase
    .from('home_view')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching home_view:', error);
    return null;
  }
  return data;
}

export async function getStatistics(): Promise<StatisticsData | null> {
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching statistics:', error);
    return null;
  }
  return data;
}

export async function getProjects(): Promise<ProjectData[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('like_count', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
}
