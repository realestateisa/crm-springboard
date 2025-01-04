import { ActivityType } from "./enums"

export interface SequenceStep {
  id: string
  sequence_id: string | null
  step_number: number
  type: ActivityType
  template_id: string | null
  delay_hours: number | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface SequenceStepInsert extends Omit<SequenceStep, "id" | "step_number" | "type"> {
  id?: string
  step_number: number
  type: ActivityType
}

export interface SequenceStepUpdate extends Partial<SequenceStep> {}