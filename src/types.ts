export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface StudentProfile {
  unique_id: string;
  name: string;
  email: string;
  phone_number: string;
  user: number;
  id: number;
  title: string;
  secondary_school: string;
  secondary_year: string;
  university: string;
  university_year: string;
  university_major: string;
  course: string;
  enrolled_at: string;
  batch_number: string;
  payment_completed: boolean;
  paid_amount: number;
  paid_at: string;
  can_access_profile: boolean;
  is_public: boolean;
  created_at: string;
  interests: string[];
  experience: string[];
  skills: string[];
  career_objective: string[];
  profile_image: string;
}


export interface Course {
  id: number;
  title: string;
  sub_title?: string;
  description: string;
  image: string | File | null;
  tutor?: string | null;
  instructor?: string;
  price?: string;
  duration?: string;
  students?: number;
  startDate?: string;
  status?: "Active" | "Upcoming" | "Completed" | "Draft";
}


export interface Notification {
  id: string;
  title: string;
  message: string;
  type: " LOGIN" | "PROFILE" | "ENQUIRY" | "ADMISSION";
  related_id: number;
  is_read: boolean;
  created_at: string;
  related_model: string;
}