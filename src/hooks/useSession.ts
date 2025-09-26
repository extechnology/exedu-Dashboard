import getSession from "@/api/getSession";
import { useState, useEffect } from "react";
import { Session } from "@/types";

const useSession = () => {
  const [session, setSession] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getSession()
      .then((data) => {
        setSession(data);
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
  return { session, loading, error };
};

export default useSession;
