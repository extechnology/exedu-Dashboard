import { useEffect, useState } from "react";
import getEnquiry from "@/api/getEnquiry";
import type { Enquire } from "@/types";

const useEnquiry = () => {
  const [enquiry, setEnquiry] = useState<Enquire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getEnquiry()
      .then((data) => {
        setEnquiry(data);
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

  return { enquiry, loading, error };
};

export default useEnquiry;
