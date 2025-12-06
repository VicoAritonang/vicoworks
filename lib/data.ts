import { supabase } from './supabase';
import { Database } from '@/types/database';

export type HomeViewData = Database['public']['Tables']['home_view']['Row'];
export type StatisticsData = Database['public']['Tables']['statistics']['Row'];
export type ProjectData = Database['public']['Tables']['projects']['Row'];

export async function getHomeView(): Promise<HomeViewData | null> {
  try {
    const { data, error } = await supabase
      .from('home_view')
      .select('*')
      .single();
    
    if (error) {
      // During build time, this is expected if env vars are not set
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn('Supabase URL not set during build, returning null');
        return null;
      }
      console.error('Error fetching home_view:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error in getHomeView:', error);
    return null;
  }
}

export async function getStatistics(): Promise<StatisticsData | null> {
  try {
    const { data, error } = await supabase
      .from('statistics')
      .select('*')
      .single();

    if (error) {
      // During build time, this is expected if env vars are not set
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn('Supabase URL not set during build, returning null');
        return null;
      }
      console.error('Error fetching statistics:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Unexpected error in getStatistics:', error);
    return null;
  }
}

export async function getProjects(): Promise<ProjectData[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('like_count', { ascending: false });

    if (error) {
      // During build time, this is expected if env vars are not set
      if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        console.warn('Supabase URL not set during build, returning empty array');
        return [];
      }
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Unexpected error in getProjects:', error);
    return [];
  }
}
