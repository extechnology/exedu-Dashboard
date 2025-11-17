"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type AttendanceItem = {
  id: number;
  student: string;
  student_name: string;
  student_course: number;
  date: string;
  status: "present" | "absent" | "late" | "pending";
};

interface AttendanceTrackerProps {
  profileId: string;
  courseId: number;
  studentCreatedAt: string;
  duration: string;
}

export default function AttendanceTracker({
  profileId,
  courseId,
  studentCreatedAt,
  duration,
}: AttendanceTrackerProps) {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const initialMonth = useMemo(() => {
    const now = new Date();
    if (now < new Date(studentCreatedAt)) {
      return new Date(studentCreatedAt);
    }

    const end = new Date(studentCreatedAt);
    const durationMatch = duration.match(/(\d+)\s*(week|month)/i);
    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2].toLowerCase();

      if (unit.startsWith("week")) {
        end.setDate(end.getDate() + value * 7);
      } else if (unit.startsWith("month")) {
        end.setMonth(end.getMonth() + value);
      }
    } else {
      end.setMonth(end.getMonth() + 3);
    }

    if (now > end) {
      // After course end → show last valid month
      return end;
    }

    // Within range → show current month
    return now;
  }, [studentCreatedAt, duration]);

  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const { startDate, endDate } = useMemo(() => {
    const start = new Date(studentCreatedAt);
    const end = new Date(start);
    const durationMatch = duration.match(/(\d+)\s*(week|month)/i);

    if (durationMatch) {
      const value = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2].toLowerCase();

      if (unit.startsWith("week")) {
        end.setDate(end.getDate() + value * 7);
      } else if (unit.startsWith("month")) {
        end.setMonth(end.getMonth() + value);
      }
    } else {
      // fallback 3 months
      end.setMonth(end.getMonth() + 3);
    }

    return { startDate: start, endDate: end };
  }, [studentCreatedAt, duration]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axiosInstance.get("/attendance/", {
          params: { course: courseId, student: profileId },
        });

        const filtered = (res.data as AttendanceItem[]).filter((att) => {
          const attDate = new Date(att.date);
          return attDate >= startDate && attDate <= endDate;
        });

        setAttendance(filtered);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [courseId, profileId, startDate, endDate]);

  if (loading) return <p>Loading attendance...</p>;

  // 🧩 Quick lookup map
  const attendanceMap: Record<string, AttendanceItem> = {};
  attendance.forEach((rec) => {
    attendanceMap[rec.date] = rec;
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();
  const offset = (startDay + 6) % 7; 

  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < offset; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(year, month, i);
    if (dateObj >= startDate && dateObj <= endDate) {
      calendarDays.push(dateObj);
    } else {
      calendarDays.push(null);
    }
  }

  // 🎨 Color logic
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "present":
        return "bg-green-500 text-white";
      case "absent":
        return "bg-red-400 text-white";
      case "late":
        return "bg-yellow-400 text-white";
      case "pending":
        return "bg-blue-400 text-white";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // ⏮ / ⏭ Month navigation with boundary restriction
  const prevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    if (newMonth >= startDate) setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    if (newMonth <= endDate) setCurrentMonth(newMonth);
  };

  const disablePrev = currentMonth <= startDate;
  const disableNext = currentMonth >= endDate;

  // 📅 UI
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-4xl mx-auto">
      {/* Header */}
      
      <div className="flex justify-between items-center mb-4">
        <button
          title="Previous Month"
          onClick={prevMonth}
          disabled={disablePrev}
          className={`p-2 rounded-lg transition ${
            disablePrev ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          title="Next Month"
          onClick={nextMonth}
          disabled={disableNext}
          className={`p-2 rounded-lg transition ${
            disableNext ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500 mb-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((date, idx) => {
          if (!date) return <div key={idx} className="bg-transparent"></div>;

          const isoDate = formatDate(date);
          const record = attendanceMap[isoDate];
          const status = record?.status;

          return (
            <div
              key={idx}
              className={`p-2 flex flex-col items-center justify-between rounded-md border transition hover:shadow-sm ${getStatusColor(
                status
              )}`}
              title={`${date.toDateString()} - ${
                status
                  ? status.charAt(0).toUpperCase() + status.slice(1)
                  : "No Record"
              }`}
            >
              <span className="text-sm font-semibold">{date.getDate()}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-5 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-sm"></div> Present
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded-sm"></div> Absent
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded-sm"></div> Late
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded-sm"></div> Pending
        </div>
      </div>
    </div>
  );
}
