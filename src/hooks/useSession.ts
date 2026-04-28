import { useState, useEffect, useCallback } from "react";
import getSession from "@/api/getSession";
import { Session } from "@/types";

const useSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSession();
      setSessions(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // 👇 mutation helpers (THIS fixes your page)
  const addSession = (newSession: Session) => {
    setSessions((prev) => [newSession, ...prev]);
  };

  const updateSession = (updated: Session) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const removeSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    sessions,
    loading,
    error,
    refetch: fetchSessions,
    addSession,
    updateSession,
    removeSession,
  };
};

export default useSession;
