export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      global_notifications: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          link: string | null
          link_names: string | null
          message: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          link_names?: string | null
          message: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          link_names?: string | null
          message?: string
          title?: string
        }
        Relationships: []
      }
      huggingface_api_keys: {
        Row: {
          api_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
        }
        Insert: {
          api_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
        }
        Update: {
          api_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
        }
        Relationships: []
      }
      model_configs: {
        Row: {
          api_url: string
          category: string
          created_at: string | null
          default_step: number
          id: string
          inference_steps: number[]
          is_premium: boolean | null
          key: string
          name: string
          no_style_suffix: boolean | null
          prompt_suffix: string | null
          quality_limits: string[] | null
          updated_at: string | null
        }
        Insert: {
          api_url: string
          category: string
          created_at?: string | null
          default_step: number
          id?: string
          inference_steps: number[]
          is_premium?: boolean | null
          key: string
          name: string
          no_style_suffix?: boolean | null
          prompt_suffix?: string | null
          quality_limits?: string[] | null
          updated_at?: string | null
        }
        Update: {
          api_url?: string
          category?: string
          created_at?: string | null
          default_step?: number
          id?: string
          inference_steps?: number[]
          is_premium?: boolean | null
          key?: string
          name?: string
          no_style_suffix?: boolean | null
          prompt_suffix?: string | null
          quality_limits?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notification_groups: {
        Row: {
          count: number | null
          created_at: string | null
          group_type: string
          id: string
          last_updated: string | null
          preview_data: Json | null
          recipient_id: string | null
        }
        Insert: {
          count?: number | null
          created_at?: string | null
          group_type: string
          id?: string
          last_updated?: string | null
          preview_data?: Json | null
          recipient_id?: string | null
        }
        Update: {
          count?: number | null
          created_at?: string | null
          group_type?: string
          id?: string
          last_updated?: string | null
          preview_data?: Json | null
          recipient_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action: string | null
          actor_id: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          group_key: string | null
          id: string
          image_url: string | null
          is_read: boolean | null
          link: string | null
          link_names: string | null
          message: string
          metadata: Json | null
          title: string
          user_id: string | null
        }
        Insert: {
          action?: string | null
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          group_key?: string | null
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          link?: string | null
          link_names?: string | null
          message: string
          metadata?: Json | null
          title: string
          user_id?: string | null
        }
        Update: {
          action?: string | null
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          group_key?: string | null
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          link?: string | null
          link_names?: string | null
          message?: string
          metadata?: Json | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bonus_credits: number
          credit_count: number
          display_name: string | null
          hidden_global_notifications: string | null
          id: string
          is_admin: boolean | null
          is_pro: boolean | null
          is_pro_request: boolean | null
          last_refill_time: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bonus_credits?: number
          credit_count?: number
          display_name?: string | null
          hidden_global_notifications?: string | null
          id: string
          is_admin?: boolean | null
          is_pro?: boolean | null
          is_pro_request?: boolean | null
          last_refill_time?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bonus_credits?: number
          credit_count?: number
          display_name?: string | null
          hidden_global_notifications?: string | null
          id?: string
          is_admin?: boolean | null
          is_pro?: boolean | null
          is_pro_request?: boolean | null
          last_refill_time?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      style_configs: {
        Row: {
          created_at: string | null
          id: string
          is_premium: boolean | null
          key: string
          name: string
          suffix: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          key: string
          name: string
          suffix: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_premium?: boolean | null
          key?: string
          name?: string
          suffix?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      user_image_likes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          image_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_image_likes_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "user_images"
            referencedColumns: ["id"]
          },
        ]
      }
      user_images: {
        Row: {
          aspect_ratio: string
          created_at: string | null
          height: number
          id: string
          is_hot: boolean | null
          is_private: boolean | null
          is_trending: boolean | null
          model: string
          prompt: string
          quality: string
          seed: number
          storage_path: string
          style: string | null
          user_id: string | null
          width: number
        }
        Insert: {
          aspect_ratio: string
          created_at?: string | null
          height: number
          id?: string
          is_hot?: boolean | null
          is_private?: boolean | null
          is_trending?: boolean | null
          model: string
          prompt: string
          quality: string
          seed: number
          storage_path: string
          style?: string | null
          user_id?: string | null
          width: number
        }
        Update: {
          aspect_ratio?: string
          created_at?: string | null
          height?: number
          id?: string
          is_hot?: boolean | null
          is_private?: boolean | null
          is_trending?: boolean | null
          model?: string
          prompt?: string
          quality?: string
          seed?: number
          storage_path?: string
          style?: string | null
          user_id?: string | null
          width?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      refill_user_credits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_trending_and_hot_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
