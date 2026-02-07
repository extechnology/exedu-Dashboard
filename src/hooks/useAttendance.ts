"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { toast } from "sonner";

type UIStatus = "Present" | "Absent" | "Late" | "Pending";
type ApiStatus = "present" | "absent" | "late" | "pending";

export type AttendanceRecord = {
  id?: number;
  student: number; // local student id (for dropdowns, UI, etc.)
  student_name?: string;
  student_course: number;
  status: UIStatus;
  region: number;
  date: string;
};

export type AttendanceUpdate = {
  student: string; // UUID (Profile.unique_id) for API
  status: ApiStatus; // lowercase for API
};

export type BulkAttendancePayload = {
  date: string;
  course: number;
  region: number;
  records: AttendanceUpdate[];
};

export type AttendanceItem = {
  id: number;
  student: string;
  student_name: string;
  student_course: number;
  date: string;
  status: ApiStatus;
  attended_at: string | null;
  marked_by: number | null;
  marked_by_student: boolean;
  region: number;
};

export default function useAttendance(date: Date, courseId?: number) {
  const [records, setRecords] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const regionId = localStorage.getItem("region_id");

  const formattedDate = date.toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/attendance/", {
          params: {
            date: formattedDate,
            course: courseId,
            region: Number(regionId),
          },
        });
        setRecords(res.data as AttendanceItem[]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch attendance");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchAttendance();
  }, [formattedDate, courseId]);

  const saveAttendance = async (updates: AttendanceUpdate[]) => {
    try {
      const res = await axiosInstance.post("/attendance/bulk/", {
        date: formattedDate,
        course: courseId,
        records: updates,
        region: Number(regionId),
      });

      setRecords(res.data.records as AttendanceItem[]);
      toast.success("Attendance saved successfully");
    } catch (err: any) {
      setError(err.message || "Failed to save attendance");
      console.error(err);
      toast.error(err.message || "Failed to save attendance");
    }
  };

  return { records, setRecords, saveAttendance, loading, error };
}
