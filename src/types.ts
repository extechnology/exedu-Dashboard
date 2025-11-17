export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}



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
  region?: string;
  experience: string;
  course_name: string | null;
  interests: string;
  created_at: string;
  course_id: number | null;
  is_public: boolean;
  can_access_profile: boolean;
  course: string | null;
  course_details: Course;
  enrolled_at: string | null;
  bach_number: string | null;
  payment_completed: boolean;
  paid_amount: number | null;
  paid_at: string | null;
  attendance_list: AttendanceUpdate[];
  user: number;
  progress: number;
  is_paid: boolean;
  region_name: string | null;
}


export interface Course {
  id: number;
  title: string;
  sub_title?: string;
  title_display?: string;
  description: string;
  image: string | File | null;
  tutor?: string | null;
  instructor?: string;
  price?: string;
  region?: number;
  region_name: string | null;
  duration?: string;
  students?: number;
  tutor_id: number | "";
  course_id: number | "";
  tutor_name: string;
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
  region_name: string;
}


export interface Tutor {
  id: number;
  name: string;
  region?: number;
  region_name?: string;
  email?: string;
  phone_number?: string;
  profile_image?: string;
};

export interface Batch {
  id: number;
  batch_number: string;
  course: number;
  tutor: Tutor;
  date: string;
  region?: string;
  time_start: string;
  end_date: string;
  course_name: string;
  created_at: string;
  region_name: string;
}


type TutorDetails = {
  id: number;
  name?: string;
  region?: string;  
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
  course_details: Course;
  students: StudentProfile[];
  student_details: StudentDetails;
  tutor_details: TutorDetails;
  tutor: Tutor;
  region?: string;
  course: number;
  course_id: number;
  created_at: string;
  region_name: string;
}

export type Status = "Present" | "Absent" | "Late";

export interface AttendanceUpdate {
  student: string;
  status: Status;
  marked_by_student:boolean;
  session_id: string;
  date: string;
  region?: string
}

export interface Region {
  region: string;
  image: string;
  created_at: string;
  phone: string;
  id: number;
}


export interface TutorAttendance {
  id: number;
  tutor: number;
  session: number;
  date: string;
  status: "present" | "absent";
}