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
  image: string;
  tutor?: string;
  instructor?: string;
  duration?: string;
  students?: number;
  startDate?: string;
  status?: "Active" | "Upcoming" | "Completed" | "Draft";
}
