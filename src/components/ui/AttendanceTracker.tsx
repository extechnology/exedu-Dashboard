"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import useStudentProfile from "@/hooks/useStudentProfile";

export type AttendanceItem = {
  id: number;
  student: string; // UUID
  student_name: string;
  student_course: number;
  date: string;
  status: "present" | "absent" | "late" | "pending";
};


interface AttendanceTrackerProps {
  profileId: string; // student UUID
  courseId: number;
  studentCreatedAt: string;
}

const AttendanceTracker = ({
  profileId,
  courseId,
  studentCreatedAt,
}: AttendanceTrackerProps) => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { studentProfile } = useStudentProfile();

  console.log(profileId, "profileId in attendance tracker");
  const selectedStudent = studentProfile?.find(
    (s) => s.unique_id === profileId || s.unique_id === profileId
  );
  console.log(selectedStudent, "selectedStudent in attendance tracker");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get("/attendance/", {
          params: { course: courseId, student: profileId },
        });
        setAttendance(res.data as AttendanceItem[]);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [courseId, profileId]);

  if (loading) return <p>Loading attendance...</p>;

  // map attendance by date
  const attendanceMap: Record<string, "Present" | "Absent"> = {};
  attendance.forEach((rec) => {
    attendanceMap[rec.date] =
      rec.status === "present" || rec.status === "pending"
        ? "Present"
        : "Absent";
  });

  // generate date grid
 const startDate = new Date(selectedStudent?.created_at);
 const durationStr = selectedStudent?.course_details?.duration || "3 months"; // fallback
 const allDates: Date[] = [];

 // Parse duration string
 let endDate = new Date(startDate);
 const durationMatch = durationStr.match(/(\d+)\s*(week|month)/i);
 if (durationMatch) {
   const value = parseInt(durationMatch[1], 10);
   const unit = durationMatch[2].toLowerCase();

   if (unit.startsWith("week")) {
     endDate.setDate(endDate.getDate() + value * 7);
   } else if (unit.startsWith("month")) {
     endDate.setMonth(endDate.getMonth() + value);
   }
 } else {
   // fallback to 3 months if parsing fails
   endDate.setMonth(endDate.getMonth() + 3);
 }

 // Generate all dates between startDate and endDate
 const current = new Date(startDate);
 while (current <= endDate) {
   allDates.push(new Date(current));
   current.setDate(current.getDate() + 1);
 }

 // Split into weeks
 const weeks: {
   weekStart: Date;
   days: { date: Date; status: "Present" | "Absent" }[];
 }[] = [];
 let currentWeek: any[] = [];
 let weekStart = allDates[0];

 allDates.forEach((date) => {
   const iso = date.toISOString().split("T")[0];
   currentWeek.push({ date, status: attendanceMap[iso] || "Absent" });

   if (date.getDay() === 6) {
     weeks.push({ weekStart, days: currentWeek });
     currentWeek = [];
     weekStart = new Date(date);
     weekStart.setDate(weekStart.getDate() + 1);
   }
 });

 if (currentWeek.length > 0) weeks.push({ weekStart, days: currentWeek });


  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg max-w-full sm:max-w-lg mx-auto">
      {/* Legend */}
      <div className="flex flex-wrap justify-end gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-300"></div>
          <span className="text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-green-500"></div>
          <span className="text-sm">Present</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex space-x-1 mb-2 relative left-14">
        {weeks.map((week, idx) => {
          const month = week.weekStart.toLocaleString("default", {
            month: "short",
          });
          const prevMonth =
            idx > 0
              ? weeks[idx - 1].weekStart.toLocaleString("default", {
                  month: "short",
                })
              : null;
          return (
            <div key={idx} className="w-6 text-xs text-center">
              {month !== prevMonth ? month : ""}
            </div>
          );
        })}
      </div>

      <div className="flex overflow-x-auto">
        {/* Day labels */}
        <div className="flex flex-col items-center justify-center gap-1 pr-2 text-xs text-gray-500">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="h-6">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex space-x-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col space-y-1">
              {week.days.map((day, di) => (
                <div
                  key={di}
                  className={`w-6 h-6 rounded-sm ${
                    day.status === "Present" ? "bg-green-500" : "bg-gray-300"
                  }`}
                  title={day.date.toDateString()}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
