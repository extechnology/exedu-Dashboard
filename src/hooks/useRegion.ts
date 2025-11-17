import { useEffect,useState } from "react";
import getRegion from "@/api/getRegion";
import type { Region } from "@/types";


const useRegion = () => {
    const [region,setRegion ] = useState<Region[]>([]) ;
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState<Error | null>(null);


    useEffect(() => {
        getRegion()
        .then((data) => {
            setRegion(data);
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
    return { region,loading,error };

}

export default useRegion