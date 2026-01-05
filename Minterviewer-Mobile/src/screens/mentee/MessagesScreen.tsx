import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";

import MenteeLayout from "../../layouts/MenteeLayout";
import { useAuth } from "../../context/AuthContext";
import { useMessages } from "../../context/MessageContext";
import api from "../../services/api";

export default function MessagesScreen() {
  const { user } = useAuth();
  const { conversations, refreshConversations, markConversationAsRead } =
    useMessages();

  const userId = (user as any)?._id || (user as any)?.id;

  const [loading, setLoading] = useState(true);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  /* ================= LOAD LIST ================= */
  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshConversations();
      setLoading(false);
    })();
  }, []);

  /* ================= OPEN CHAT ================= */
  const openConversation = async (convo: any) => {
    setActiveConversation(convo);
    await markConversationAsRead(convo._id);

    const res = await api.get(`/api/chat/conversation/${convo._id}`);

    if (res.data?.ok) {
      setMessages(
        res.data.messages.map((m: any) => ({
          ...m,
          fromSelf: m.fromUser === userId,
        }))
      );
    }
  };

  /* ================= SEND ================= */
  const send = async () => {
    if (!text.trim()) return;

    await api.post("/api/chat/messages", {
      conversationId: activeConversation._id,
      text,
      fromUser: userId,
    });

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        text,
        fromSelf: true,
      },
    ]);

    setText("");
  };

  /* ================= CHAT VIEW ================= */
  if (activeConversation) {
    const other = activeConversation.participants.find(
      (p: any) => p._id !== userId
    );

    return (
      <MenteeLayout>
        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderColor: "#e5e7eb",
              marginBottom: 8,
            }}
          >
            <TouchableOpacity onPress={() => setActiveConversation(null)}>
              <Text style={{ fontSize: 20, marginRight: 12 }}>←</Text>
            </TouchableOpacity>

            <View>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#2e1065",
                }}
              >
                {other?.full_name || "User"}
              </Text>
              <Text style={{ fontSize: 12, color: "#64748b" }}>
                Online
              </Text>
            </View>
          </View>

          {/* MESSAGES */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => {
              const isMe = item.fromSelf;

              return (
                <View
                  style={{
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    maxWidth: "78%",
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: isMe
                        ? "#7c3aed"
                        : "#f1f5f9",
                      paddingVertical: 10,
                      paddingHorizontal: 14,
                      borderRadius: 18,
                      borderTopRightRadius: isMe ? 4 : 18,
                      borderTopLeftRadius: isMe ? 18 : 4,
                      elevation: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: isMe ? "#ffffff" : "#0f172a",
                        fontSize: 15,
                        lineHeight: 20,
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          {/* INPUT */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              borderTopWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message…"
              placeholderTextColor="#94a3b8"
              style={{
                flex: 1,
                backgroundColor: "#f1f5f9",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 20,
                fontSize: 15,
              }}
            />

            <TouchableOpacity
              onPress={send}
              style={{
                marginLeft: 8,
                backgroundColor: "#7c3aed",
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </MenteeLayout>
    );
  }

  /* ================= LIST VIEW ================= */
  if (loading) {
    return (
      <MenteeLayout>
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      </MenteeLayout>
    );
  }

  return (
    <MenteeLayout>
      <FlatList
        data={conversations}
        keyExtractor={(item) => String(item._id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 200 }}
        renderItem={({ item }) => {
          const other = item.participants.find(
            (p: any) => p._id !== userId
          );

          return (
            <TouchableOpacity
              onPress={() => openConversation(item)}
              style={{
                padding: 16,
                borderRadius: 18,
                marginBottom: 14,
                backgroundColor: "#ffffff",
                borderWidth: 1,
                borderColor: "#ede9fe",
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#2e1065",
                  }}
                >
                  {other?.full_name || "User"}
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#7c3aed",
                  }}
                >
                  {item.lastMessage?.createdAt
                    ? new Date(
                        item.lastMessage.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: "#64748b",
                }}
              >
                {item.lastMessage?.text || "No messages yet"}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </MenteeLayout>
  );
}
