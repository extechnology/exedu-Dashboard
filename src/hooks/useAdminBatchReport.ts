// hooks/useAdminBatchReport.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

export interface AdminStudent {
  name: string;
  email: string;
  paid_amount: number | null;
  payment_completed: boolean;
  course_fee: number | null;
}

export interface AdminBatchReport {
  batch_number: string;
  course_name: string;
  total_students: number;
  total_earnings: number;
  pending_fees: number;
  students: AdminStudent[];
}

interface UseAdminBatchReportReturn {
  data: AdminBatchReport[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAdminBatchReport = (): UseAdminBatchReportReturn => {
  const [data, setData] = useState<AdminBatchReport[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<AdminBatchReport[]>(
        "/admin/batch-report/"
      );
      setData(response.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchReport,
  };
};
