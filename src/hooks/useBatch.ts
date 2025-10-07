import { useEffect, useState, useCallback } from "react";
import getBatch from "@/api/getBatch";
import type { Batch } from "@/types";

const useBatches = () => {
  const [batch, setBatch] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBatch();
      setBatch(data);
      setError(null);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  return { batch, loading, error, fetchBatches };
};

export default useBatches;
