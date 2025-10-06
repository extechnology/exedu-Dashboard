export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

// export interface StudentProfile {
//   unique_id: string;
//   name: string;
//   email: string;
//   phone_number: string;
//   user: number;
//   id: number;
//   title: string;
//   course_name: string;
//   secondary_school: string;
//   secondary_year: string;
//   university: string;
//   university_year: string;
//   university_major: string;
//   course: string;
//   enrolled_at: string;
//   batch_number: string;
//   payment_completed: boolean;
//   paid_amount: number;
//   paid_at: string;
//   can_access_profile: boolean;
//   is_public: boolean;
//   created_at: string;
//   interests: string;
//   experience: string;
//   skills: string;
//   career_objective: string;
//   profile_image: string;
//   batch: number;
// }


export interface StudentProfile {
  id: number;
  unique_id: string;
  profile_image: File | null;
  name: string;
  email: string;
  batch: number | null;
  batch_number: string | null;
  phone_number: string | null;
  secondary_school: string | null;
  secondary_year: string | null;
  university: string | null;
  university_major: string | null;
  university_year: string | null;
  career_objective: string;
  skills: string;
  experience: string;
  course_name: string | null;
  interests: string;
  created_at: string;
  course_id: number | null;
  is_public: boolean;
  can_access_profile: boolean;
  course: string | null;
  enrolled_at: string | null;
  bach_number: string | null;
  payment_completed: boolean;
  paid_amount: number | null;
  paid_at: string | null;
  user: number;
  progress: number;
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
  tutor_id: number | "";
  course_id: number | "";
  tutor_name:string;
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


export interface Contact {
  id: number;
  name: string;
  email: string;
  number: string;
  course: string;
  submitted_at: string;}


export interface Enquire {
  id : number;
  name: string;
  email: string;
  phone: string;
  title: string;
  created_at: string;
}


export interface CourseOptions {
  id: number;
  value: string;
  label: string;
  title: string;
}


export interface Tutor  {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  profile_image:string;
};

export interface Batch {
  id: number;
  batch_number: string;
  course: number;
  tutor: Tutor;
  date: string;
  time_start: string;
  end_date: string;
  course_name: string;
}


type TutorDetails = {
  id: number;
  name?: string;
  profile_image?: string | File | null;
} | null; 


type StudentDetails = {
  id: number;
  name?: string;
  profile_image?: string | File | null;
  course:number;
}[];


export interface Session {
  title: string;
  id: number;
  start_time: string;
  duration: string;
  course_details:Course;
  students: StudentProfile[];
  student_details: StudentDetails;
  tutor_details: TutorDetails;
  tutor: Tutor;
  course:number;
  course_id: number;
  created_at: string;
}

export type Status = "Present" | "Absent" | "Late";

export interface AttendanceUpdate {
  student: string;
  status: Status; 
  session_id: string;
  date: string;
}