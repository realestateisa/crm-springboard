import { Activity, ActivityInsert, ActivityUpdate } from "./activities"
import { Call, CallInsert, CallUpdate } from "./calls"
import { Email, EmailInsert, EmailUpdate } from "./emails"
import { Lead, LeadInsert, LeadUpdate } from "./leads"
import { Organization, OrganizationInsert, OrganizationUpdate } from "./organizations"
import { Profile, ProfileInsert, ProfileUpdate } from "./profiles"
import { Sequence, SequenceInsert, SequenceUpdate } from "./sequences"
import { SequenceStep, SequenceStepInsert, SequenceStepUpdate } from "./sequence-steps"
import { SMS, SMSInsert, SMSUpdate } from "./sms"
import { Task, TaskInsert, TaskUpdate } from "./tasks"
import { Template, TemplateInsert, TemplateUpdate } from "./templates"

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: Activity
        Insert: ActivityInsert
        Update: ActivityUpdate
      }
      calls: {
        Row: Call
        Insert: CallInsert
        Update: CallUpdate
      }
      emails: {
        Row: Email
        Insert: EmailInsert
        Update: EmailUpdate
      }
      leads: {
        Row: Lead
        Insert: LeadInsert
        Update: LeadUpdate
      }
      organizations: {
        Row: Organization
        Insert: OrganizationInsert
        Update: OrganizationUpdate
      }
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
      }
      sequences: {
        Row: Sequence
        Insert: SequenceInsert
        Update: SequenceUpdate
      }
      sequence_steps: {
        Row: SequenceStep
        Insert: SequenceStepInsert
        Update: SequenceStepUpdate
      }
      sms: {
        Row: SMS
        Insert: SMSInsert
        Update: SMSUpdate
      }
      tasks: {
        Row: Task
        Insert: TaskInsert
        Update: TaskUpdate
      }
      templates: {
        Row: Template
        Insert: TemplateInsert
        Update: TemplateUpdate
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_type: "call" | "sms" | "email" | "note" | "custom"
      call_disposition: "answered" | "no_answer" | "busy" | "voicemail" | "wrong_number" | "disconnected" | "callback_requested"
      lead_status: "Send AI Text (Continue Outreach)" | "Potential" | "Connected" | "Unqualified" | "Bad Phone Number" | "Interested" | "Missed Transfer" | "Do Not Contact" | "Send to Client" | "Contact Later"
      message_status: "draft" | "scheduled" | "sent" | "delivered" | "failed"
      sequence_status: "active" | "paused" | "archived"
      user_role: "admin" | "isa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
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
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never