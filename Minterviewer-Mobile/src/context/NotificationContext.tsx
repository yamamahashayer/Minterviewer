import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  createdAt?: any;
  redirectTo?: string;
};

type NotificationContextType = {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
};

/* ================= CONTEXT ================= */

const NotificationContext = createContext<NotificationContextType>(
  {} as NotificationContextType
);

/* ================= PROVIDER ================= */

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = (user as any)?._id || (user as any)?.id;

  /* ================= LOAD NOTIFICATIONS ================= */

  const refreshNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/api/notifications?userId=${userId}`);
      
      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter((n: NotificationItem) => !n.read).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (err: any) {
      console.error("refreshNotifications error", err);
      
      // Handle 401 errors specifically
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(`Failed to load notifications: ${err.message || 'Unknown error'}`);
      }
      
      // Set empty state on error
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    if (isAuthenticated && userId) {
      refreshNotifications();
    } else if (!isAuthenticated) {
      // Reset state when not authenticated
      setNotifications([]);
      setUnreadCount(0);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  /* ================= ACTIONS ================= */

  const markAsRead = async (id: string) => {
    try {
      // Update backend
      await api.put("/api/notifications", { id, read: true });
      
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read: true,
              }
            : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error("markAsRead error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);
      await Promise.all(
        unread.map((n) => api.put("/api/notifications", { id: n.id, read: true }))
      );
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error("markAllAsRead error", err);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await api.delete("/api/notifications", { data: { id } });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      const notification = notifications.find((n) => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      console.error("removeNotification error", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* ================= HOOK ================= */

export function useNotifications() {
  return useContext(NotificationContext);
}
