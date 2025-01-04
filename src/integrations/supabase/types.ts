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
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          date_created: string | null
          date_updated: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_image_url: string | null
          timezone: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          date_created?: string | null
          date_updated?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_image_url?: string | null
          timezone?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          date_created?: string | null
          date_updated?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_image_url?: string | null
          timezone?: string | null
        }
        Relationships: []
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
