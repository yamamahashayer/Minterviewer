import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";

export default function NotificationsScreen() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications();

  useEffect(() => {
    markAllAsRead();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
        Notifications
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (!item.read) markAsRead(item.id);
            }}
            style={{
              padding: 14,
              marginBottom: 10,
              borderRadius: 12,
              backgroundColor: item.read ? "#eee" : "#ddd",
            }}
          >
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text>{item.message}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
