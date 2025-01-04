import { SequenceStatus } from "./enums"

export interface Sequence {
  id: string
  name: string
  description: string | null
  status: SequenceStatus | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface SequenceInsert extends Omit<Sequence, "id" | "name"> {
  id?: string
  name: string
}

export interface SequenceUpdate extends Partial<Sequence> {}