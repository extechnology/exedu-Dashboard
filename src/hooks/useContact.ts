import { useEffect, useState } from "react";
import getContact from "@/api/getContact";
import type { Contact } from "@/types";

const useContact = () => {
  const [contact, setContact] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getContact()
      .then((data) => {
        setContact(data);
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

  return { contact, loading, error };
};

export default useContact;
