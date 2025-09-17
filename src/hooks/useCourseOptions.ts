import { useState, useEffect } from "react";
import getCourseOptions from "@/api/getCourseOptoins";
import type { CourseOptions } from "@/types";

const useCourseOptions = () => {
  const [courseOptions, setCourseOptions] = useState<CourseOptions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getCourseOptions()
      .then((data) => {
        setCourseOptions(data);
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
  return { courseOptions, loading, error };
};

export default useCourseOptions;
