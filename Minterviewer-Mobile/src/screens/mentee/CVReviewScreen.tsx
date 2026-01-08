import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import MenteeLayout from '../../layouts/MenteeLayout';
import ChoiceScreen from '../../components/cv/ChoiceScreen';
import UploadScreen from '../../components/cv/UploadScreen';
import CreateScreen from '../../components/cv/CreateScreen';
import ReportScreen from '../../components/cv/ReportScreen';

type CVMode = 'choice' | 'upload' | 'create' | 'report';

interface AnalysisData {
  menteeId?: string;
  resumeId?: string;
  analysis?: any;
}

export default function CVReviewScreen() {
  const [mode, setMode] = useState<CVMode>('choice');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const handleUploadSuccess = (data: AnalysisData) => {
    setAnalysisData(data);
    setMode('report');
  };

  const handleCreateSuccess = (data: AnalysisData) => {
    setAnalysisData(data);
    setMode('report');
  };

  const handleBackToChoice = () => {
    setMode('choice');
    setAnalysisData(null);
  };

  const renderContent = () => {
    switch (mode) {
      case 'choice':
        return (
          <ChoiceScreen
            onUpload={() => setMode('upload')}
            onCreate={() => setMode('create')}
          />
        );
      
      case 'upload':
        return (
          <UploadScreen
            onBack={handleBackToChoice}
            onSuccess={handleUploadSuccess}
          />
        );
      
      case 'create':
        return (
          <CreateScreen
            onBack={handleBackToChoice}
            onSuccess={handleCreateSuccess}
          />
        );
      
      case 'report':
        return (
          <ReportScreen
            data={analysisData?.analysis}
            menteeId={analysisData?.menteeId}
            resumeId={analysisData?.resumeId}
            onBack={handleBackToChoice}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <MenteeLayout>
      <ScrollView className="flex-1">
        {renderContent()}
      </ScrollView>
    </MenteeLayout>
  );
}
