import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import MenteeLayout from '../../layouts/MenteeLayout';

export default function OverviewScreen() {
  const { user, signOut } = useAuth();

  return (
    <MenteeLayout>
      <View style={{ alignItems: 'center', marginTop: 40 }}>
        <Text style={{ fontSize: 22, fontWeight: '700' }}>
          Welcome 👋
        </Text>

        <Text style={{ marginTop: 8 }}>
          {user?.full_name}
        </Text>

        <TouchableOpacity
          onPress={signOut}
          style={{
            marginTop: 24,
            paddingVertical: 10,
            paddingHorizontal: 24,
            backgroundColor: '#ef4444',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </MenteeLayout>
  );
}
