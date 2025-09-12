import { useState, useEffect } from "react";
import { getNotification } from "@/api/getNotification";
import type { Notification } from "@/types";

const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotification()
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return { notifications, loading };
};

export default useNotification;
