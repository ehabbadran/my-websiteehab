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
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          category: string
          published_date: string
          read_time: number
          featured_image_url: string | null
          is_featured: boolean
          view_count: number
          external_url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          category: string
          published_date: string
          read_time?: number
          featured_image_url?: string | null
          is_featured?: boolean
          view_count?: number
          external_url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          category?: string
          published_date?: string
          read_time?: number
          featured_image_url?: string | null
          is_featured?: boolean
          view_count?: number
          external_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      newsletters: {
        Row: {
          id: string
          title: string
          published_date: string
          preview_content: string
          external_url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          published_date: string
          preview_content: string
          external_url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          published_date?: string
          preview_content?: string
          external_url?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          gumroad_url: string
          is_bestseller: boolean
          category: string
          display_order: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          gumroad_url: string
          is_bestseller?: boolean
          category?: string
          display_order?: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          gumroad_url?: string
          is_bestseller?: boolean
          category?: string
          display_order?: number
          image_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
