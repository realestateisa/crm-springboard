import { AccountType } from "./enums"

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
  profile_image_url: string | null
  account_type: AccountType | null
  timezone: string | null
  date_created: string | null
  date_updated: string | null
}

export interface ProfileInsert extends Omit<Profile, "id"> {
  id: string
}

export interface ProfileUpdate extends Partial<Profile> {}