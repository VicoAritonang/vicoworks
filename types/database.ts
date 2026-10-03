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
          resume_url: string | null
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
          resume_url?: string | null
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
          resume_url?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      guestbook: {
        Row: {
          id: string
          name: string
          message: string
          created_at: string
          hidden: boolean
        }
        Insert: {
          id?: string
          name: string
          message: string
          ip_hash?: string | null
          created_at?: string
          hidden?: boolean
        }
        Update: {
          name?: string
          message?: string
          hidden?: boolean
        }
        Relationships: []
      }
      statistics: {
        Row: {
          id: string
          visitor_count: number | null
          project_count: number | null
          system_in_production: number | null
        }
        Insert: {
          id?: string
          visitor_count?: number | null
          project_count?: number | null
          system_in_production?: number | null
        }
        Update: {
          id?: string
          visitor_count?: number | null
          project_count?: number | null
          system_in_production?: number | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

