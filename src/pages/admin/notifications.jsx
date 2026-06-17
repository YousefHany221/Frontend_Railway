import { useEffect, useState } from "react";
import AdminLayout from "../../components/adminLayout";
import { adminService } from "../../api/admin";

const levelClasses = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  success: "bg-green-100 text-green-700",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminService.getNotifications({ per_page: 50 });
      setNotifications(response.data ?? []);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to load notifications.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await adminService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, is_read: true, read_at: item.read_at ?? new Date().toISOString() }))
      );
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to update notifications.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-400 text-sm mt-1">System alerts and security updates.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-10 text-center text-gray-400">Loading notifications...</div>
        ) : error ? (
          <div className="px-6 py-10 text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">No notifications yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div key={notification.id} className="px-6 py-4 flex items-start gap-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    levelClasses[notification.level] ?? levelClasses.info
                  }`}
                >
                  {notification.level}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${notification.is_read ? "text-gray-500" : "text-gray-800"}`}>
                    {notification.title}
                  </p>
                  <p className={`text-sm mt-1 ${notification.is_read ? "text-gray-400" : "text-gray-600"}`}>
                    {notification.message}
                  </p>
                </div>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
