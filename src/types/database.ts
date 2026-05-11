// Database types for Supabase schema
// These types match the database schema created in database/schema.sql

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          profile_image_url: string
          location?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          phone?: string
          bio?: string
          profile_image_url?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          first_name?: string
          last_name?: string
          phone?: string
          bio?: string
          profile_image_url?: string
          location?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          url: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          platform?: string
          url?: string
          display_name?: string
          description?: string
          icon_url?: string
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          user_id: string
          platform: string
          url: string
          icon_url?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: string
          url: string
          icon_url?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          platform?: string
          url?: string
          icon_url?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          id: string
          public_student_id: string | null
          name: string
          email: string
          phone: string
          course: string
          reg_date: string
          reg_time: string | null
          payment_plan: string
          amount_paid: number
          balance_remaining: number
          status: string
          timestamp: string
          gender: string
          state_of_residence: string
          learning_track: string
          how_did_you_hear: string
          has_laptop_and_internet: string
          current_employment_status: string
          wants_scholarship: string
          why_learn_this_skill: string
          last_progress: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          public_student_id?: string | null
          name: string
          email: string
          phone: string
          course: string
          reg_date: string
          reg_time?: string
          payment_plan: string
          amount_paid?: number
          balance_remaining?: number
          status?: string
          timestamp: string
          gender: string
          state_of_residence: string
          learning_track: string
          how_did_you_hear: string
          has_laptop_and_internet: string
          current_employment_status: string
          wants_scholarship: string
          why_learn_this_skill: string
          last_progress?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          public_student_id?: string | null
          email?: string
          phone?: string
          course?: string
          reg_date?: string
          reg_time?: string
          payment_plan?: string
          amount_paid?: number
          balance_remaining?: number
          status?: string
          timestamp?: string
          gender?: string
          state_of_residence?: string
          learning_track?: string
          how_did_you_hear?: string
          has_laptop_and_internet?: string
          current_employment_status?: string
          wants_scholarship?: string
          why_learn_this_skill?: string
          last_progress?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_followups: {
        Row: {
          id: string
          student_id: string
          subject: string
          message: string
          sent_at: string
          status: string
          email_provider: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject: string
          message: string
          sent_at?: string
          status?: string
          email_provider?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          subject?: string
          message?: string
          sent_at?: string
          status?: string
          email_provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          id: string
          student_id: string
          name: string
          email: string
          phone: string
          amount: number
          payment_date: string
          image_url: string
          status: string
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          name: string
          email: string
          phone: string
          amount: number
          payment_date: string
          image_url: string
          status?: string
          submitted_at: string
          reviewed_at?: string
          reviewed_by?: string
          rejection_reason?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          amount?: number
          payment_date?: string
          image_url?: string
          status?: string
          submitted_at?: string
          reviewed_at?: string
          reviewed_by?: string
          rejection_reason?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_receipts: {
        Row: {
          id: string
          student_name: string
          email: string
          phone?: string
          amount: number
          payment_date: string
          payment_type: string
          status: string
          cloudinary_public_id?: string
          cloudinary_url?: string
          original_filename?: string
          submitted_at: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_name: string
          email: string
          phone?: string
          amount: number
          payment_date: string
          payment_type?: string
          status?: string
          cloudinary_public_id?: string
          cloudinary_url?: string
          original_filename?: string
          submitted_at?: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          student_name?: string
          email?: string
          phone?: string
          amount?: number
          payment_date?: string
          payment_type?: string
          status?: string
          cloudinary_public_id?: string
          cloudinary_url?: string
          original_filename?: string
          reviewed_at?: string
          reviewed_by?: string
          notes?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_new_user: () => void
      update_updated_at_column: () => void
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type aliases for commonly used types
export type User = Database['public']['Tables']['users']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type BusinessLink = Database['public']['Tables']['business_links']['Row']
export type SocialLink = Database['public']['Tables']['social_links']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type EmailFollowup = Database['public']['Tables']['email_followups']['Row']
export type PaymentRequest = Database['public']['Tables']['payment_requests']['Row']
export type PaymentReceipt = Database['public']['Tables']['payment_receipts']['Row']

export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']
export type BusinessLinkInsert = Database['public']['Tables']['business_links']['Insert']
export type BusinessLinkUpdate = Database['public']['Tables']['business_links']['Update']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']
export type EmailFollowupInsert = Database['public']['Tables']['email_followups']['Insert']
export type EmailFollowupUpdate = Database['public']['Tables']['email_followups']['Update']
export type PaymentRequestInsert = Database['public']['Tables']['payment_requests']['Insert']
export type PaymentRequestUpdate = Database['public']['Tables']['payment_requests']['Update']
export type PaymentReceiptInsert = Database['public']['Tables']['payment_receipts']['Insert']
export type PaymentReceiptUpdate = Database['public']['Tables']['payment_receipts']['Update']

// Extended types for application use
export interface UserWithProfile extends User {
  profile: UserProfile | null
  business_links: BusinessLink[]
  social_links: SocialLink[]
}

export interface Platform {
  id: string
  name: string
  icon: string
  color?: string
}

export const BUSINESS_PLATFORMS: Platform[] = [
  { id: 'meta_business', name: 'Meta Business', icon: '/icons/facebook.png', color: '#1877F2' },
  { id: 'whatsapp', name: 'WhatsApp Group', icon: '/icons/whatsappi.png', color: '#25D366' }
]

export const SOCIAL_PLATFORMS: Platform[] = [
  { id: 'facebook', name: 'Facebook', icon: '/icons/facebook.png', color: '#1877F2' },
  { id: 'twitter', name: 'Twitter/X', icon: '/icons/twitter.png', color: '#000000' },
  { id: 'instagram', name: 'Instagram', icon: '/icons/instagram.png', color: '#E4405F' }
]
