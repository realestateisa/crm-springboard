import { Activity, ActivityInsert, ActivityUpdate } from "./activities";
import { Call, CallInsert, CallUpdate } from "./calls";
import { Email, EmailInsert, EmailUpdate } from "./emails";
import { Organization, OrganizationInsert, OrganizationUpdate } from "./organizations";
import { Profile, ProfileInsert, ProfileUpdate } from "./profiles";
import { Sequence, SequenceInsert, SequenceUpdate } from "./sequences";
import { SequenceStep, SequenceStepInsert, SequenceStepUpdate } from "./sequence-steps";
import { SMS, SMSInsert, SMSUpdate } from "./sms";
import { Task, TaskInsert, TaskUpdate } from "./tasks";
import { Template, TemplateInsert, TemplateUpdate } from "./templates";

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
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          phone_formatted: string | null;
          description: string | null;
          client: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          location: string;
          source: string | null;
          timezone: string | null;
          script: string | null;
          phone_status: string | null;
          phone_type: string | null;
          api_url: string | null;
          date_created: string | null;
          date_updated: string | null;
          created_by: string | null;
          updated_by: string | null;
          custom_fields: any | null;
          first_name: string;
          last_name: string | null;
          transfer_ext: string | null;
          lead_type: string | null;
          crm_id: string | null;
        }
        Insert: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          phone_formatted?: string | null;
          description?: string | null;
          client?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          location: string;
          source?: string | null;
          timezone?: string | null;
          script?: string | null;
          phone_status?: string | null;
          phone_type?: string | null;
          api_url?: string | null;
          date_created?: string | null;
          date_updated?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          custom_fields?: any | null;
          first_name: string;
          last_name?: string | null;
          transfer_ext?: string | null;
          lead_type?: string | null;
          crm_id?: string | null;
        }
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          phone_formatted?: string | null;
          description?: string | null;
          client?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          location?: string;
          source?: string | null;
          timezone?: string | null;
          script?: string | null;
          phone_status?: string | null;
          phone_type?: string | null;
          api_url?: string | null;
          date_created?: string | null;
          date_updated?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          custom_fields?: any | null;
          first_name?: string;
          last_name?: string | null;
          transfer_ext?: string | null;
          lead_type?: string | null;
          crm_id?: string | null;
        }
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