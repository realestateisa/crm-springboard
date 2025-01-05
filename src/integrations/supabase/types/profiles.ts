import { UserRole } from "./enums"

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  profile_image_url: string | null
  timezone: string | null
  date_created: string | null
  date_updated: string | null
  role: UserRole | null
  is_active: boolean | null
}

export interface ProfileInsert extends Omit<Profile, "id"> {
  id: string
}

export interface ProfileUpdate extends Partial<Profile> {}