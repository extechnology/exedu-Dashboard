// src/hooks/useTutorAttendance.ts
import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";

interface TutorAttendance {
  id: number;
  tutor: number;
  session: number;
  date: string;
  status: "present" | "absent";
  tutor_name: string;
  session_title: string;
}

export const useTutorAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<TutorAttendance[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // mark attendance
  const markAttendance = async (
    tutorId: number,
    sessionId: number,
    date: string,
    status: "present" | "absent"
  ) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/tutor-attendance/`, {
        tutor: tutorId,
        session: sessionId,
        date,
        status,
      });

      setAttendanceRecords((prev) => {
        const existing = prev.find(
          (a) =>
            a.tutor === tutorId && a.session === sessionId && a.date === date
        );

        if (existing) {
          return prev.map((a) =>
            a.id === existing.id ? { ...a, status: res.data.status } : a
          );
        }
        return [res.data, ...prev];
      });

      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  return {
    markAttendance,
    loading,
    error,
    attendanceRecords,
  };
};
