import { useState, useEffect, useCallback } from "react";
import { getCourse } from "@/api/getCourse";
import type { Course } from "@/types";

const useCourse = () => {
  const [course, setCourse] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourse();
      setCourse(Array.isArray(data) ? data : []); // safety check
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { course, loading, error, fetchCourses };
};

export default useCourse;
