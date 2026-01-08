import React from 'react';
import { View } from 'react-native';
import MenteeLayout from '../../layouts/MenteeLayout';
import { InterviewPlaceholderScreen } from '../../components/interview';

export default function InterviewPracticeScreen() {
  return (
    <MenteeLayout>
      <View style={{ flex: 1 }}>
        <InterviewPlaceholderScreen 
          onBack={() => {
            // Handle back navigation if needed
            // For now, this is handled by the tab navigator
          }} 
        />
      </View>
    </MenteeLayout>
  );
}
