import React from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import useStudentProfile from "@/hooks/useStudentProfile";
import type { Course } from "@/types";
import AttendanceTracker from "@/components/ui/AttendanceTracker";

interface StudentPersonalDetailsProps {
  studentId?: string;
}

const StudentPersonalDetails: React.FC<StudentPersonalDetailsProps> = ({
  studentId,
}) => {
  const { studentProfile } = useStudentProfile();

  const student = studentProfile?.find((s) => s.unique_id === studentId);
  console.log(student, "studentDetails");
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading student details...
      </div>
    );
  }

  const {
    name,
    email,
    phone_number,
    career_objective,
    experience,
    interests,
    secondary_school,
    secondary_year,
    university,
    university_major,
    university_year,
    batch_number,
    created_at,
    progress,
    payment_completed,
    paid_amount,
    paid_at,
    can_access_profile,
    is_public,
    course_name,
    course_details,
  } = student;

  const course: Course = course_details as Course;
  const tutor = course?.tutor_name || "N/A";

  console.log(course, "course object");
  console.log(tutor, "tutorName");

  const getPaymentStatusIcon = () => {
    if (payment_completed)
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    if (!payment_completed && paid_amount)
      return <Clock className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-rose-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ---------- HEADER CARD ---------- */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex flex-wrap justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 flex items-center justify-center rounded-2xl border-2 border-white/30">
                <User className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1 capitalize">{name}</h1>
                <p className="text-indigo-100">Batch #{batch_number}</p>
                <p className="text-indigo-100">
                  Joined: {new Date(created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 rounded-xl px-4 py-2 border border-white/30">
                <p className="text-sm text-indigo-100">Course Progress</p>
                <p className="text-3xl font-bold">{progress || 0}%</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{phone_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {is_public ? (
                <Eye className="w-5 h-5 text-emerald-600" />
              ) : (
                <EyeOff className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <p className="text-sm text-gray-500">Profile Visibility</p>
                <p className="font-medium">
                  {is_public ? "Public" : "Private"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- COURSE DETAILS ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 ">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Course Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="content-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">
                {course?.title_display || course_name}
              </h3>
              <p className="text-md text-gray-500 mb-4">
                Duration: {course?.duration || "N/A"}
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  Tutor: <span className="font-medium text-md">{tutor}</span>
                </p>
                <p>
                  Price:{" "}
                  <span className="font-medium text-md">
                    ₹{Number(course?.price).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <AttendanceTracker
                profileId={student?.unique_id || ""}
                courseId={course?.id || 0}
                studentCreatedAt={student?.created_at || ""}
              />
            </div>
          </div>
        </div>

        {/* ---------- EDUCATION ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Education</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="font-semibold">Secondary School</p>
              <p>{secondary_school || "—"}</p>
              <p className="text-sm text-gray-500">
                Year: {secondary_year || "—"}
              </p>
            </div>
            <div>
              <p className="font-semibold">University</p>
              <p>{university || "—"}</p>
              <p className="text-sm text-gray-500">
                Major: {university_major || "—"}
              </p>
              <p className="text-sm text-gray-500">
                Year: {university_year || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- PERSONAL INFO ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Personal Info</h2>
          </div>

          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">Career Objective: </span>
              {career_objective || "—"}
            </p>
            <p>
              <span className="font-semibold">Experience: </span>
              {experience || "—"}
            </p>
            <p>
              <span className="font-semibold">Interests: </span>
              {interests || "—"}
            </p>
          </div>
        </div>

        {/* ---------- PAYMENT ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Payment Details
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-3 text-gray-700">
              {getPaymentStatusIcon()}
              <div>
                <p className="font-semibold">
                  {payment_completed ? "Payment Completed" : "Pending Payment"}
                </p>
                <p className="text-sm text-gray-500">
                  {paid_at
                    ? `Paid on ${new Date(paid_at).toLocaleDateString()}`
                    : "No payment date available"}
                </p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 text-right">
              <p className="text-gray-600 text-sm">Amount</p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹{paid_amount ? Number(paid_amount).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* ---------- ACCESS STATUS ---------- */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Access & Profile
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-gray-700">
            <p>
              <span className="font-semibold">Can Access Profile: </span>
              {can_access_profile ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">Public Profile: </span>
              {is_public ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalDetails;
