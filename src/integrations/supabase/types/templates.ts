import { ActivityType } from "./enums"

export interface Template {
  id: string
  name: string
  type: ActivityType
  subject: string | null
  content: string
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface TemplateInsert extends Omit<Template, "id" | "name" | "type" | "content"> {
  id?: string
  name: string
  type: ActivityType
  content: string
}

export interface TemplateUpdate extends Partial<Template> {}