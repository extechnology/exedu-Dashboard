import { useState, useEffect } from "react";
import { getStudentProfile } from "@/api/getStudentProfile";
import type { StudentProfile } from "@/types";

const useStudentProfile = () => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data: StudentProfile[] = await getStudentProfile();
        setStudentProfile(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return { studentProfile, loading, error };
};

export default useStudentProfile;
