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
      admin_settings: {
        Row: {
          auto_approve_client: boolean | null
          auto_approve_delivery: boolean | null
          auto_approve_restaurant: boolean | null
          created_at: string | null
          default_delivery_fee: number | null
          delivery_zone: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          auto_approve_client?: boolean | null
          auto_approve_delivery?: boolean | null
          auto_approve_restaurant?: boolean | null
          created_at?: string | null
          default_delivery_fee?: number | null
          delivery_zone?: string | null
          id?: number
          updated_at?: string | null
        }
        Update: {
          auto_approve_client?: boolean | null
          auto_approve_delivery?: boolean | null
          auto_approve_restaurant?: boolean | null
          created_at?: string | null
          default_delivery_fee?: number | null
          delivery_zone?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          signature_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          signature_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          signature_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          participant_ids: string[]
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          participant_ids: string[]
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          participant_ids?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          comments: string | null
          created_at: string | null
          date: string | null
          id: string
          invoice_id: string
          number: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_id: string
          number?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_id?: string
          number?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_profiles: {
        Row: {
          created_at: string | null
          current_location: string | null
          id: string
          is_available: boolean | null
          license_number: string | null
          rating: number | null
          total_deliveries: number | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          current_location?: string | null
          id: string
          is_available?: boolean | null
          license_number?: string | null
          rating?: number | null
          total_deliveries?: number | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          current_location?: string | null
          id?: string
          is_available?: boolean | null
          license_number?: string | null
          rating?: number | null
          total_deliveries?: number | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          current_latitude: number | null
          current_longitude: number | null
          id: string
          insurance_expiry: string | null
          insurance_number: string | null
          is_online: boolean | null
          last_location_update: string | null
          license_expiry: string | null
          license_number: string | null
          rating: number | null
          updated_at: string | null
          user_id: string
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_year: number | null
        }
        Insert: {
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          insurance_expiry?: string | null
          insurance_number?: string | null
          is_online?: boolean | null
          last_location_update?: string | null
          license_expiry?: string | null
          license_number?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
        }
        Update: {
          created_at?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          id?: string
          insurance_expiry?: string | null
          insurance_number?: string | null
          is_online?: boolean | null
          last_location_update?: string | null
          license_expiry?: string | null
          license_number?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          invoice_id: string
          product_id: string | null
          quantity: number
          total: number
          tva: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_id: string
          product_id?: string | null
          quantity: number
          total: number
          tva?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          invoice_id?: string
          product_id?: string | null
          quantity?: number
          total?: number
          tva?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string
          comments: string | null
          company_id: string
          created_at: string | null
          date: string
          id: string
          number: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          total_amount: number
          tva_total: number
          user_id: string
        }
        Insert: {
          client_id: string
          comments?: string | null
          company_id: string
          created_at?: string | null
          date?: string
          id?: string
          number?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          total_amount?: number
          tva_total?: number
          user_id: string
        }
        Update: {
          client_id?: string
          comments?: string | null
          company_id?: string
          created_at?: string | null
          date?: string
          id?: string
          number?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          total_amount?: number
          tva_total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string | null
          created_at: string | null
          file_url: string | null
          id: string
          is_read: boolean | null
          message_type: string | null
          sender_id: string | null
        }
        Insert: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          is_read?: boolean | null
          message_type?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          id: string
          location: string | null
          notes: string | null
          order_id: string | null
          status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_id?: string | null
          status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          order_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          client_id: string | null
          client_location: string | null
          created_at: string | null
          delivery_address: string | null
          delivery_id: string | null
          estimated_delivery_time: string | null
          id: string
          items: Json | null
          restaurant_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          client_location?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          items?: Json | null
          restaurant_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          client_location?: string | null
          created_at?: string | null
          delivery_address?: string | null
          delivery_id?: string | null
          estimated_delivery_time?: string | null
          id?: string
          items?: Json | null
          restaurant_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_id_fkey"
            columns: ["delivery_id"]
            isOneToOne: false
            referencedRelation: "delivery_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurant_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          tva: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          tva?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          tva?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          comments: string | null
          created_at: string | null
          date: string | null
          id: string
          invoice_id: string
          number: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_id: string
          number?: string | null
          total_amount?: number
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          invoice_id?: string
          number?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_profiles: {
        Row: {
          business_type: string | null
          created_at: string | null
          description: string | null
          id: string
          is_approved: boolean | null
          logo_url: string | null
          rating: number | null
          restaurant_name: string
          total_orders: number | null
        }
        Insert: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          id: string
          is_approved?: boolean | null
          logo_url?: string | null
          rating?: number | null
          restaurant_name: string
          total_orders?: number | null
        }
        Update: {
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_approved?: boolean | null
          logo_url?: string | null
          rating?: number | null
          restaurant_name?: string
          total_orders?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          service_type: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          service_type: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          service_type?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          neighborhood: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          neighborhood?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          neighborhood?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      invoice_status: "proforma" | "validated" | "final" | "paid" | "cancelled"
      user_role: "client" | "delivery" | "restaurant" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      invoice_status: ["proforma", "validated", "final", "paid", "cancelled"],
      user_role: ["client", "delivery", "restaurant", "admin"],
    },
  },
} as const
