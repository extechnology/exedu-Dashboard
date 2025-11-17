import { useEffect, useState } from "react";
import getTutorAttendance from "@/api/getTutorAttendance";
import type { TutorAttendance } from "@/types";

const useTutorData = (tutorId?: number) => {
  const [tutorAttendance, setTutorAttendance] = useState<TutorAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const data = await getTutorAttendance(tutorId);
      setTutorAttendance(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [tutorId]); 

  return {
    tutorAttendance,
    loading,
    error,
    refetchAttendance: fetchAttendance, 
  };
};

export default useTutorData;
