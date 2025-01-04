import { Json } from "./json"

export interface Task {
  id: string
  lead_id: string | null
  assigned_to: string | null
  text: string
  type: string
  is_complete: boolean | null
  is_dateless: boolean | null
  date: string | null
  due_date: string | null
  object_id: string | null
  object_type: string | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
  custom_fields: Json | null
}

export interface TaskInsert extends Omit<Task, "id" | "text" | "type"> {
  id?: string
  text: string
  type: string
}

export interface TaskUpdate extends Partial<Task> {}