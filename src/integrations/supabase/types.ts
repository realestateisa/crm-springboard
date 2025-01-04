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
      activities: {
        Row: {
          created_by: string | null
          custom_fields: Json | null
          date_created: string | null
          date_updated: string | null
          description: string | null
          external_id: string | null
          id: string
          lead_id: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          lead_id: string
          type: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string
          type?: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          disposition: Database["public"]["Enums"]["call_disposition"] | null
          duration: number | null
          ended_at: string | null
          external_id: string | null
          id: string
          lead_id: string | null
          notes: string | null
          recording_url: string | null
          scheduled_date: string | null
          started_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          disposition?: Database["public"]["Enums"]["call_disposition"] | null
          duration?: number | null
          ended_at?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          recording_url?: string | null
          scheduled_date?: string | null
          started_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          disposition?: Database["public"]["Enums"]["call_disposition"] | null
          duration?: number | null
          ended_at?: string | null
          external_id?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          recording_url?: string | null
          scheduled_date?: string | null
          started_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calls_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          content: string
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          external_id: string | null
          from_email: string
          id: string
          lead_id: string | null
          scheduled_date: string | null
          sent_date: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          subject: string
          template_id: string | null
          to_email: string
          updated_by: string | null
        }
        Insert: {
          content: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          external_id?: string | null
          from_email: string
          id?: string
          lead_id?: string | null
          scheduled_date?: string | null
          sent_date?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject: string
          template_id?: string | null
          to_email: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          external_id?: string | null
          from_email?: string
          id?: string
          lead_id?: string | null
          scheduled_date?: string | null
          sent_date?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          subject?: string
          template_id?: string | null
          to_email?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          api_url: string | null
          client: string | null
          created_by: string | null
          custom_fields: Json | null
          date_created: string | null
          date_updated: string | null
          description: string | null
          email: string | null
          external_id: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          phone_formatted: string | null
          phone_status: string | null
          phone_type: string | null
          script: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          timezone: string | null
          updated_by: string | null
        }
        Insert: {
          api_url?: string | null
          client?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          phone_formatted?: string | null
          phone_status?: string | null
          phone_type?: string | null
          script?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          timezone?: string | null
          updated_by?: string | null
        }
        Update: {
          api_url?: string | null
          client?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          email?: string | null
          external_id?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          phone_formatted?: string | null
          phone_status?: string | null
          phone_type?: string | null
          script?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          timezone?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          description: string | null
          id: string
          name: string
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          id?: string
          name: string
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          date_created: string | null
          date_updated: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          timezone: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          date_created?: string | null
          date_updated?: string | null
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          date_created?: string | null
          date_updated?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          timezone?: string | null
        }
        Relationships: []
      }
      sequence_steps: {
        Row: {
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          delay_hours: number | null
          id: string
          sequence_id: string | null
          step_number: number
          template_id: string | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          delay_hours?: number | null
          id?: string
          sequence_id?: string | null
          step_number: number
          template_id?: string | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          delay_hours?: number | null
          id?: string
          sequence_id?: string | null
          step_number?: number
          template_id?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_steps_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_steps_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sequences: {
        Row: {
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["sequence_status"] | null
          updated_by: string | null
        }
        Insert: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["sequence_status"] | null
          updated_by?: string | null
        }
        Update: {
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["sequence_status"] | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequences_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequences_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sms: {
        Row: {
          content: string
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          external_id: string | null
          from_phone: string
          id: string
          lead_id: string | null
          scheduled_date: string | null
          sent_date: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          template_id: string | null
          to_phone: string
          updated_by: string | null
        }
        Insert: {
          content: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          external_id?: string | null
          from_phone: string
          id?: string
          lead_id?: string | null
          scheduled_date?: string | null
          sent_date?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          template_id?: string | null
          to_phone: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          external_id?: string | null
          from_phone?: string
          id?: string
          lead_id?: string | null
          scheduled_date?: string | null
          sent_date?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          template_id?: string | null
          to_phone?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_by: string | null
          custom_fields: Json | null
          date: string | null
          date_created: string | null
          date_updated: string | null
          due_date: string | null
          id: string
          is_complete: boolean | null
          is_dateless: boolean | null
          lead_id: string | null
          object_id: string | null
          object_type: string | null
          text: string
          type: string
          updated_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          date?: string | null
          date_created?: string | null
          date_updated?: string | null
          due_date?: string | null
          id?: string
          is_complete?: boolean | null
          is_dateless?: boolean | null
          lead_id?: string | null
          object_id?: string | null
          object_type?: string | null
          text: string
          type: string
          updated_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          date?: string | null
          date_created?: string | null
          date_updated?: string | null
          due_date?: string | null
          id?: string
          is_complete?: boolean | null
          is_dateless?: boolean | null
          lead_id?: string | null
          object_id?: string | null
          object_type?: string | null
          text?: string
          type?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          content: string
          created_by: string | null
          date_created: string | null
          date_updated: string | null
          id: string
          name: string
          subject: string | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_by: string | null
        }
        Insert: {
          content: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          id?: string
          name: string
          subject?: string | null
          type: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_by?: string | null
          date_created?: string | null
          date_updated?: string | null
          id?: string
          name?: string
          subject?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "Admin" | "ISA"
      activity_type: "call" | "sms" | "email" | "note" | "custom"
      call_disposition:
        | "answered"
        | "no_answer"
        | "busy"
        | "voicemail"
        | "wrong_number"
        | "disconnected"
        | "callback_requested"
      lead_status:
        | "Send AI Text (Continue Outreach)"
        | "Potential"
        | "Connected"
        | "Unqualified"
        | "Bad Phone Number"
        | "Interested"
        | "Missed Transfer"
        | "Do Not Contact"
        | "Send to Client"
        | "Contact Later"
      message_status: "draft" | "scheduled" | "sent" | "delivered" | "failed"
      sequence_status: "active" | "paused" | "archived"
      user_role: "admin" | "isa"
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
