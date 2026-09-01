export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_branding: {
        Row: {
          accent_color: string
          app_name: string
          created_at: string
          custom_domain: string | null
          electron_enabled: boolean
          favicon_url: string | null
          id: string
          logo_url: string | null
          primary_color: string
          secondary_color: string
          singleton: boolean
          support_email: string | null
          support_phone: string | null
          tagline: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          app_name?: string
          created_at?: string
          custom_domain?: string | null
          electron_enabled?: boolean
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          singleton?: boolean
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          app_name?: string
          created_at?: string
          custom_domain?: string | null
          electron_enabled?: boolean
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string
          secondary_color?: string
          singleton?: boolean
          support_email?: string | null
          support_phone?: string | null
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean | null
          message: string
          sender_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          message: string
          sender_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean | null
          message?: string
          sender_name?: string
          user_id?: string
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
          nif: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          nif?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          nif?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          brand_app_name: string | null
          brand_primary: string | null
          brand_secondary: string | null
          created_at: string | null
          currency: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          nif: string | null
          phone: string | null
          rccm: string | null
          signature_url: string | null
          stamp_url: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          brand_app_name?: string | null
          brand_primary?: string | null
          brand_secondary?: string | null
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          nif?: string | null
          phone?: string | null
          rccm?: string | null
          signature_url?: string | null
          stamp_url?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          brand_app_name?: string | null
          brand_primary?: string | null
          brand_secondary?: string | null
          created_at?: string | null
          currency?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          nif?: string | null
          phone?: string | null
          rccm?: string | null
          signature_url?: string | null
          stamp_url?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
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
      invoice_reminders: {
        Row: {
          channel: string
          created_at: string
          id: string
          invoice_id: string
          level: string
          message: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          invoice_id: string
          level?: string
          message?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          invoice_id?: string
          level?: string
          message?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_reminders_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          color_scheme: Json | null
          created_at: string
          custom_css: string | null
          description: string | null
          font_family: string | null
          id: string
          is_default: boolean | null
          layout_type: string | null
          logo_position: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color_scheme?: Json | null
          created_at?: string
          custom_css?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_default?: boolean | null
          layout_type?: string | null
          logo_position?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color_scheme?: Json | null
          created_at?: string
          custom_css?: string | null
          description?: string | null
          font_family?: string | null
          id?: string
          is_default?: boolean | null
          layout_type?: string | null
          logo_position?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          allow_partial_payment: boolean
          amount_paid: number
          client_id: string
          comments: string | null
          company_id: string
          created_at: string | null
          custom_styling: Json | null
          date: string
          due_date: string | null
          id: string
          number: string | null
          public_token: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          template_id: string | null
          total_amount: number
          ttc_amount: number | null
          tva_total: number
          user_id: string
        }
        Insert: {
          allow_partial_payment?: boolean
          amount_paid?: number
          client_id: string
          comments?: string | null
          company_id: string
          created_at?: string | null
          custom_styling?: Json | null
          date?: string
          due_date?: string | null
          id?: string
          number?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          template_id?: string | null
          total_amount?: number
          ttc_amount?: number | null
          tva_total?: number
          user_id: string
        }
        Update: {
          allow_partial_payment?: boolean
          amount_paid?: number
          client_id?: string
          comments?: string | null
          company_id?: string
          created_at?: string | null
          custom_styling?: Json | null
          date?: string
          due_date?: string | null
          id?: string
          number?: string | null
          public_token?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          template_id?: string | null
          total_amount?: number
          ttc_amount?: number | null
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
          {
            foreignKeyName: "invoices_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      keep_alive: {
        Row: {
          last_ping: string | null
        }
        Insert: {
          last_ping?: string | null
        }
        Update: {
          last_ping?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          invoice_id: string
          notes: string | null
          paid_at: string
          payment_method: string
          payment_reference: string | null
          provider: string | null
          provider_transaction_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id: string
          notes?: string | null
          paid_at?: string
          payment_method?: string
          payment_reference?: string | null
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          paid_at?: string
          payment_method?: string
          payment_reference?: string | null
          provider?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
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
          product_type: string
          tva: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          product_type?: string
          tva?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          product_type?: string
          tva?: number | null
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          comments: string | null
          converted_invoice_id: string | null
          created_at: string | null
          date: string | null
          expires_at: string | null
          id: string
          invoice_id: string
          number: string | null
          status: string
          total_amount: number
          user_id: string
        }
        Insert: {
          comments?: string | null
          converted_invoice_id?: string | null
          created_at?: string | null
          date?: string | null
          expires_at?: string | null
          id?: string
          invoice_id: string
          number?: string | null
          status?: string
          total_amount?: number
          user_id: string
        }
        Update: {
          comments?: string | null
          converted_invoice_id?: string | null
          created_at?: string | null
          date?: string | null
          expires_at?: string | null
          id?: string
          invoice_id?: string
          number?: string | null
          status?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_converted_invoice_id_fkey"
            columns: ["converted_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          number: string | null
          payment_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          number?: string | null
          payment_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          number?: string | null
          payment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receipts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
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
      user_subscriptions: {
        Row: {
          activated_at: string | null
          created_at: string
          expires_at: string | null
          id: string
          payment_method: string | null
          payment_proof_url: string | null
          subscription_status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          subscription_status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          subscription_status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_invoice: { Args: { _token: string }; Returns: Json }
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      invoice_status:
        | "proforma"
        | "validated"
        | "final"
        | "paid"
        | "cancelled"
        | "sent"
        | "partially_paid"
        | "overdue"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      invoice_status: [
        "proforma",
        "validated",
        "final",
        "paid",
        "cancelled",
        "sent",
        "partially_paid",
        "overdue",
      ],
    },
  },
} as const
