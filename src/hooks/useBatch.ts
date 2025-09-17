import { useEffect,useState } from "react";
import getBatch from "@/api/getBatch";
import type { Batch } from "@/types";


const useBatches = () => {
    const [batch,setBatch] = useState<Batch[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);

    useEffect(() => {
        getBatch()
        .then((data) => {
            setBatch(data);
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
    return {batch,loading,error};
}

export default useBatches