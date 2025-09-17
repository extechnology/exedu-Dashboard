import { useState, useEffect } from "react";
import axiosInstance from "@/api/axiosInstance";

export interface Tutor {
  id: number;
  name: string;
}

export default function useTutorOptions() {
  const [tutorOptions, setTutorOptions] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axiosInstance.get("/tutor/");
        setTutorOptions(response.data);
      } catch (err) {
        console.error("Failed to fetch tutors", err);
        setError("Unable to load tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return { tutorOptions, loading, error };
}
