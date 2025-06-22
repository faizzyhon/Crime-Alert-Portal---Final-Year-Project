export interface User {
  id: string
  name: string
  cnic: string
  phone: string
  email?: string
  created_at: string
}

export interface SignUpData {
  name: string
  cnic: string
  phone: string
  email?: string
  password: string
}

export interface LoginData {
  cnic: string
  password: string
}

export interface CrimeReport {
  id: string
  user_id: string
  crime_type: string
  location?: string
  description: string
  image_url?: string
  video_link?: string
  is_anonymous: boolean
  status: "pending" | "in_progress" | "resolved"
  created_at: string
  updated_at: string
  user?: {
    name: string
    cnic: string
    phone: string
    email?: string
  }
  admin_responses?: AdminResponse[]
}

export interface AdminResponse {
  id: string
  report_id: string
  response: string
  created_at: string
}
