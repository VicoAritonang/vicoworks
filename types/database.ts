export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      home_view: {
        Row: {
          id: string
          overview: string | null
          image_url: string | null
          core: string | null
          skill: string | null
          whatsapp: string | null
          gmail: string | null
          linkedIn: string | null
          Github: string | null
        }
        Insert: {
          id?: string
          overview?: string | null
          image_url?: string | null
          core?: string | null
          skill?: string | null
          whatsapp?: string | null
          gmail?: string | null
          linkedIn?: string | null
          Github?: string | null
        }
        Update: {
          id?: string
          overview?: string | null
          image_url?: string | null
          core?: string | null
          skill?: string | null
          whatsapp?: string | null
          gmail?: string | null
          linkedIn?: string | null
          Github?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          projectName: string | null
          startedAt: string | null
          finishedAt: string | null
          status: string | null
          description: string | null
          video_url: string | null
          category: string | null
          skill: string | null
          like_count: number | null
          project_url: string | null
        }
        Insert: {
          id?: string
          projectName?: string | null
          startedAt?: string | null
          finishedAt?: string | null
          status?: string | null
          description?: string | null
          video_url?: string | null
          category?: string | null
          skill?: string | null
          like_count?: number | null
          project_url?: string | null
        }
        Update: {
          id?: string
          projectName?: string | null
          startedAt?: string | null
          finishedAt?: string | null
          status?: string | null
          description?: string | null
          video_url?: string | null
          category?: string | null
          skill?: string | null
          like_count?: number | null
          project_url?: string | null
        }
      }
      statistics: {
        Row: {
          id: string
          visitor_count: number | null
          project_count: number | null
        }
        Insert: {
          id?: string
          visitor_count?: number | null
          project_count?: number | null
        }
        Update: {
          id?: string
          visitor_count?: number | null
          project_count?: number | null
        }
      }
    }
  }
}

