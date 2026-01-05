import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../../lib/firebase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

import MenteeLayout from '../../layouts/MenteeLayout';

import NotificationsHeader from '../../components/notifications/NotificationsHeader';
import NotificationsStats from '../../components/notifications/NotificationsStats';
import NotificationsTabs from '../../components/notifications/NotificationsTabs';
import NotificationsList from '../../components/notifications/NotificationsList';

export default function NotificationsScreen() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  /* ================= FIREBASE ================= */
  useEffect(() => {
    if (!user?.id) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setNotifications(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [user?.id]);

  /* ================= FILTER (MEMO) ================= */
  const filtered = useMemo(() => {
    if (activeTab === 'all') return notifications;
    if (activeTab === 'unread')
      return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === activeTab);
  }, [notifications, activeTab]);

  /* ================= HEADER ================= */
  const Header = (
    <>
      <NotificationsHeader
        notifications={notifications}
        theme={theme}
      />

      <NotificationsStats
        notifications={notifications}
        theme={theme}
      />

      <NotificationsTabs
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
      />
    </>
  );

  /* ================= UI ================= */
  return (
    <MenteeLayout>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationsList
              notifications={[item]}
              activeTab={activeTab}
              theme={theme}
            />
          )}
          ListHeaderComponent={Header}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </MenteeLayout>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },

  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
