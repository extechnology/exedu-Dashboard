import { useState, useEffect } from "react";
import { getStudentProfile } from "@/api/getStudentProfile";
import type { StudentProfile } from "@/types";

const useStudentProfile = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getStudentProfile()
      .then((data) => {
        setStudentProfile(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { studentProfile, loading, error };
};


export default useStudentProfile