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

import { db } from "../lib/firebase"; // عدلي المسار إذا مختلف
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

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // نفس منطق الويب
    const userId = (user as any)._id || (user as any).id;
    if (!userId) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr: NotificationItem[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setNotifications(arr);
      setUnreadCount(arr.filter((n) => !n.read).length);
    });

    return () => unsub();
  }, [isAuthenticated, user]);

  /* ================= ACTIONS ================= */

  const markAsRead = async (id: string) => {
    try {
      // Firestore update (instant UI)
      await updateDoc(doc(db, "notifications", id), {
        read: true,
      });

      // Backend (مثل الويب)
      await api.put("/api/notifications", {
        id,
        read: true,
      });
    } catch (err) {
      console.error("markAsRead error", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);

      await Promise.all(
        unread.map((n) =>
          updateDoc(doc(db, "notifications", n.id), { read: true })
        )
      );

      await Promise.all(
        unread.map((n) =>
          api.put("/api/notifications", { id: n.id, read: true })
        )
      );
    } catch (err) {
      console.error("markAllAsRead error", err);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      // Firestore
      await deleteDoc(doc(db, "notifications", id));

      // Backend
      await api.delete("/api/notifications", {
        data: { id },
      });
    } catch (err) {
      console.error("removeNotification error", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
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
