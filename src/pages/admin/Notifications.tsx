import React from "react";
import {
  Bell,
  Check,
  X,
  Info,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import useNotification from "@/hooks/useNotification";
import axiosInstance from "@/api/axiosInstance";

const NotificationsPage: React.FC = () => {
  const { notifications: originalNotifications, loading } = useNotification();
  const [notifications, setNotifications] = React.useState(
    originalNotifications
  );


  React.useEffect(() => {
    setNotifications(originalNotifications);
  }, [originalNotifications]);



const markAsRead = async (id: string) => {
  try {
    // Update backend
    await axiosInstance.patch(`/notification/${id}/mark-read/`);

    // Update frontend state
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, is_read: true } : notif
      )
    );
  } catch (error) {
    console.error("Failed to mark notification as read", error);
  }
};



  const markAllAsRead = async () => {
    try {
      // Update backend
      await axiosInstance.patch(`/notification/mark-all-read/`);

      // Update frontend state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };


  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };


  const getIcon = (type: string) => {
    switch (type) {
      case "ENQUIRY":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "ADMISSION":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "LOGIN":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "PROFILE":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const ts = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - ts.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return ts.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-10 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-500 text-sm">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              All caught up!
            </h3>
            <p className="text-gray-500">
              You have no notifications at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                  notification.is_read
                    ? "border-gray-200 opacity-75"
                    : "border-blue-200 shadow-md"
                }`}
              >
                <div className="p-6 flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          className={`text-sm font-semibold ${
                            notification.is_read
                              ? "text-gray-700"
                              : "text-gray-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p
                          className={`mt-1 text-sm ${
                            notification.is_read
                              ? "text-gray-500"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(notification.created_at)}</span>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
