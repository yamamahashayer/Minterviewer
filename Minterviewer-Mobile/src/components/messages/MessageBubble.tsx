import React from "react";
import { View, Text } from "react-native";

export default function MessageBubble({ message }: any) {
  const isMe = message.fromSelf;

  return (
    <View
      style={{
        alignSelf: isMe ? "flex-end" : "flex-start",
        backgroundColor: isMe ? "#7c3aed" : "#e5e7eb",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginBottom: 8,
        maxWidth: "75%",
      }}
    >
      <Text
        style={{
          color: isMe ? "#ffffff" : "#000000",
          fontSize: 14,
        }}
      >
        {message.text}
      </Text>
    </View>
  );
}
