export interface Organization {
  id: string
  name: string
  description: string | null
  date_created: string | null
  date_updated: string | null
  created_by: string | null
  updated_by: string | null
}

export interface OrganizationInsert extends Omit<Organization, "id" | "name"> {
  id?: string
  name: string
}

export interface OrganizationUpdate extends Partial<Organization> {}