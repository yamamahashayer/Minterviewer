import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from '../lib/firebase';
import { useAuth } from "./AuthContext";

/* ================= TYPES ================= */

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'session' | 'message' | 'payment' | 'system' | 'review' | 'achievement';
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
  const [loading, setLoading] = useState(true); // Start with loading = true
  const [error, setError] = useState<string | null>(null);

  const userId = (user as any)?._id || (user as any)?.id;

  /* ================= REAL-TIME FIRESTORE ================= */
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toMillis?.() || Date.now(),
      }));

      setNotifications(notifications);
      setUnreadCount(notifications ? notifications.filter((n) => !n.read).length : 0);
      setLoading(false);
      setError(null);
    });

    return () => unsubscribe;
  }, [isAuthenticated, userId]);

  /* ================= ACTIONS ================= */
  const markAsRead = async (id: string) => {
    try {
      // Update Firestore
      const notificationRef = doc(db, "notifications", id);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date(),
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      setUnreadCount((prev) => Math.max(0, prev.filter(n => !n.read).length - 1));
    } catch (err: any) {
      console.error("markAsRead error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);
      
      // Update all unread notifications in Firestore
      await Promise.all(
        unread.map((notification) => {
          const notificationRef = doc(db, "notifications", notification.id);
          return updateDoc(notificationRef, {
            read: true,
            readAt: new Date(),
          });
        })
      );
      
      // Update local state
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
      // Delete from Firestore
      const notificationRef = doc(db, "notifications", id);
      await deleteDoc(notificationRef);
      
      setNotifications((prev) => prev.filter((n) => n.id !== id));
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
        refreshNotifications: () => Promise.resolve(), // dummy function
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
