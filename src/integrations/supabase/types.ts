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
      calendar_events: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          end_time: string
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          end_time: string
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      daily_activity_summary: {
        Row: {
          created_at: string
          date: string
          expected_work_minutes: number | null
          first_login_time: string | null
          id: string
          last_activity_time: string | null
          performance_status: string | null
          total_active_minutes: number | null
          total_sessions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          expected_work_minutes?: number | null
          first_login_time?: string | null
          id?: string
          last_activity_time?: string | null
          performance_status?: string | null
          total_active_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          expected_work_minutes?: number | null
          first_login_time?: string | null
          id?: string
          last_activity_time?: string | null
          performance_status?: string | null
          total_active_minutes?: number | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          adresse: string | null
          contact: string | null
          created_at: string
          created_by: string | null
          date_adhesion: string | null
          email: string | null
          id: string
          nom: string
          statut: string
          telephone: string | null
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          date_adhesion?: string | null
          email?: string | null
          id?: string
          nom: string
          statut: string
          telephone?: string | null
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          adresse?: string | null
          contact?: string | null
          created_at?: string
          created_by?: string | null
          date_adhesion?: string | null
          email?: string | null
          id?: string
          nom?: string
          statut?: string
          telephone?: string | null
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      international_subscribers: {
        Row: {
          adresse: string | null
          code_postal: string | null
          created_at: string
          created_by: string | null
          date_debut: string
          date_fin: string
          devise: string | null
          email: string
          id: string
          montant: number
          nom: string
          pays: string
          prenom: string
          statut: string
          telephone: string | null
          type_abonnement_id: string | null
          updated_at: string
          updated_by: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          created_by?: string | null
          date_debut: string
          date_fin: string
          devise?: string | null
          email: string
          id?: string
          montant: number
          nom: string
          pays: string
          prenom: string
          statut: string
          telephone?: string | null
          type_abonnement_id?: string | null
          updated_at?: string
          updated_by?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          created_by?: string | null
          date_debut?: string
          date_fin?: string
          devise?: string | null
          email?: string
          id?: string
          montant?: number
          nom?: string
          pays?: string
          prenom?: string
          statut?: string
          telephone?: string | null
          type_abonnement_id?: string | null
          updated_at?: string
          updated_by?: string | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "international_subscribers_type_abonnement_id_fkey"
            columns: ["type_abonnement_id"]
            isOneToOne: false
            referencedRelation: "subscription_types"
            referencedColumns: ["id"]
          },
        ]
      }
      local_subscribers: {
        Row: {
          adresse: string | null
          code_postal: string | null
          created_at: string
          created_by: string | null
          date_debut: string
          date_fin: string
          email: string
          id: string
          montant: number
          nom: string
          prenom: string
          statut: string
          telephone: string | null
          type_abonnement_id: string | null
          updated_at: string
          updated_by: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          created_by?: string | null
          date_debut: string
          date_fin: string
          email: string
          id?: string
          montant: number
          nom: string
          prenom: string
          statut: string
          telephone?: string | null
          type_abonnement_id?: string | null
          updated_at?: string
          updated_by?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          code_postal?: string | null
          created_at?: string
          created_by?: string | null
          date_debut?: string
          date_fin?: string
          email?: string
          id?: string
          montant?: number
          nom?: string
          prenom?: string
          statut?: string
          telephone?: string | null
          type_abonnement_id?: string | null
          updated_at?: string
          updated_by?: string | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "local_subscribers_type_abonnement_id_fkey"
            columns: ["type_abonnement_id"]
            isOneToOne: false
            referencedRelation: "subscription_types"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string
          description: string
          id: string
          key: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          key: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          key?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      prospection: {
        Row: {
          contact_name: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          notes: string | null
          phone: string | null
          result: string | null
          time: string
          type: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_name: string
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          notes?: string | null
          phone?: string | null
          result?: string | null
          time: string
          type: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_name?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          notes?: string | null
          phone?: string | null
          result?: string | null
          time?: string
          type?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscription_types: {
        Row: {
          actif: boolean | null
          created_at: string
          created_by: string | null
          description: string | null
          duree: number
          id: string
          nom: string
          prix: number
          type_lecteur: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          actif?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duree: number
          id?: string
          nom: string
          prix: number
          type_lecteur: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          actif?: boolean | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duree?: number
          id?: string
          nom?: string
          prix?: number
          type_lecteur?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tracking_settings: {
        Row: {
          created_at: string
          email_notifications_enabled: boolean
          id: string
          inactivity_threshold_minutes: number
          notification_threshold_minutes: number
          updated_at: string
          warning_duration_minutes: number
        }
        Insert: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          inactivity_threshold_minutes?: number
          notification_threshold_minutes?: number
          updated_at?: string
          warning_duration_minutes?: number
        }
        Update: {
          created_at?: string
          email_notifications_enabled?: boolean
          id?: string
          inactivity_threshold_minutes?: number
          notification_threshold_minutes?: number
          updated_at?: string
          warning_duration_minutes?: number
        }
        Relationships: []
      }
      user_inactivity: {
        Row: {
          created_at: string
          duration_minutes: number | null
          end_idle: string | null
          id: string
          session_id: string
          start_idle: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          end_idle?: string | null
          id?: string
          session_id: string
          start_idle: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          end_idle?: string | null
          id?: string
          session_id?: string
          start_idle?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inactivity_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string
          device: string | null
          id: string
          ip_address: string | null
          login_time: string
          logout_time: string | null
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string
          logout_time?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device?: string | null
          id?: string
          ip_address?: string | null
          login_time?: string
          logout_time?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ventes: {
        Row: {
          client: string
          created_at: string
          created_by: string | null
          date: string
          id: string
          mode_paiement: string
          montant: number
          numero: string
          quantite: number
          statut: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          client: string
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          mode_paiement: string
          montant: number
          numero: string
          quantite: number
          statut: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          client?: string
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          mode_paiement?: string
          montant?: number
          numero?: string
          quantite?: number
          statut?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      weekly_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          day_index: number
          end_time: string
          id: string
          location: string | null
          start_time: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          day_index: number
          end_time: string
          id?: string
          location?: string | null
          start_time: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          day_index?: number
          end_time?: string
          id?: string
          location?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_active_time: {
        Args: { p_session_id: string }
        Returns: number
      }
      calculate_performance_status: {
        Args: { active_minutes: number; expected_minutes?: number }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      has_permission: {
        Args: { user_id: string; permission_key: string }
        Returns: boolean
      }
      update_daily_summary: {
        Args: {
          p_user_id: string
          p_date: string
          p_login_time?: string
          p_activity_time?: string
          p_active_minutes?: number
          p_session_count?: number
        }
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
    Enums: {},
  },
} as const
