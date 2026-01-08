import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { getToken, getMenteeId } from '../../utils/auth';

interface Props {
  onBack: () => void;
  onSuccess: (data: any) => void;
  showNotes?: boolean;
}

const MAX_MB = 5;
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function UploadScreen({ onBack, onSuccess, showNotes = true }: Props) {
  const { isDark } = useTheme();
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'ok' | 'warn' | 'err'>('ok');
  const [userNotes, setUserNotes] = useState('');
  const [menteeId, setMenteeId] = useState<string | null>(null);

  useEffect(() => {
    const loadMenteeId = async () => {
      try {
        const id = await getMenteeId();
        if (id) setMenteeId(id);
      } catch (err) {
        console.error('Failed to load menteeId:', err);
      }
    };
    loadMenteeId();
  }, []);

  const validateFile = (file: any) => {
    if (!ACCEPTED_TYPES.includes(file.mimeType)) {
      return 'Only PDF, DOC, DOCX are allowed.';
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      return `Max size is ${MAX_MB}MB.`;
    }
    return '';
  };

  const pickFile = async () => {
    // For now, show a placeholder alert
    Alert.alert(
      'File Upload',
      'File picker would open here. In a real implementation, this would open the device file picker.',
      [{ text: 'OK' }]
    );
    
    // Simulate file selection for demo
    const mockFile = {
      uri: 'mock-file-uri',
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      size: 1024 * 1024, // 1MB
    };
    
    const validationError = validateFile(mockFile);
    if (validationError) {
      setMessageType('warn');
      setMessage(validationError);
      setFile(null);
    } else {
      setMessage('');
      setFile(mockFile);
    }
  };

  const uploadAndAnalyze = async () => {
    if (isProcessing || !file || !menteeId) return;
    setIsProcessing(true);

    try {
      setLoading(true);
      setMessage('');

      // Simulate upload and analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockResponse = {
        menteeId,
        resumeId: 'mock-resume-id',
        analysis: {
          score: 85,
          atsScore: 90,
          improvements: ['Add more quantifiable achievements', 'Include technical skills section'],
          categories: {
            formatting: { score: 8, insights: ['Good structure', 'Clear headings'] },
            content: { score: 7, insights: ['Strong experience section'] },
            keywords: { score: 9, insights: ['Good keyword density'] },
            experience: { score: 8, insights: ['Detailed descriptions'] },
          },
        },
      };

      setMessage('✅ AI analysis completed successfully!');
      onSuccess?.(mockResponse);
    } catch (error: any) {
      setMessageType('err');
      setMessage(error.message || 'Upload error');
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0f1e' : '#f5f3ff' }]}>
      {/* Header */}
      {showNotes && (
        <View style={[
          styles.header,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
          }
        ]}>
          <Text style={[
            styles.headerTitle,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            Upload your CV
          </Text>

          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
            ]}
          >
            <Ionicons name="arrow-back" size={16} color={isDark ? '#0a0f1e' : '#fff'} />
            <Text style={[styles.backButtonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions */}
      {showNotes && (
        <View style={[
          styles.instructionsContainer,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e9d5ff',
          }
        ]}>
          <Text style={[
            styles.instructionsTitle,
            { color: isDark ? '#5eead4' : '#7c3aed' }
          ]}>
            How it works
          </Text>

          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)' }]}>
                <Ionicons name="document-text" size={16} color={isDark ? '#5eead4' : '#7c3aed'} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                  Upload your CV
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#a8b3cf' : '#6b21a8' }]}>
                  PDF or DOCX format
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)' }]}>
                <Ionicons name="cloud-upload" size={16} color={isDark ? '#5eead4' : '#7c3aed'} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                  Add optional notes
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#a8b3cf' : '#6b21a8' }]}>
                  Job title or focus area
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={[styles.stepIcon, { backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)' }]}>
                <Ionicons name="bulb" size={16} color={isDark ? '#5eead4' : '#7c3aed'} />
              </View>
              <View>
                <Text style={[styles.stepTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                  Get AI analysis
                </Text>
                <Text style={[styles.stepDescription, { color: isDark ? '#a8b3cf' : '#6b21a8' }]}>
                  ATS + skills insights
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Dropzone */}
      <View style={[
        styles.dropzone,
        {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
          borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#ddd6fe',
        }
      ]}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.1)',
            borderColor: isDark ? 'rgba(94,234,212,0.4)' : 'rgba(124,58,237,0.2)',
          }
        ]}>
          {loading || aiLoading ? (
            <ActivityIndicator size={36} color={isDark ? '#5eead4' : '#7c3aed'} />
          ) : (
            <Ionicons name="cloud-upload" size={36} color={isDark ? '#5eead4' : '#7c3aed'} />
          )}
        </View>

        <Text style={[styles.dropzoneTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
          Drag & drop your CV here
        </Text>
        <Text style={[styles.dropzoneSubtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
          or
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={pickFile}
            style={[
              styles.button,
              { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
            ]}
          >
            <Text style={[styles.buttonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
              Choose File
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={uploadAndAnalyze}
            disabled={!file || loading || aiLoading}
            style={[
              styles.button,
              {
                backgroundColor: isDark ? '#5eead4' : '#7c3aed',
                opacity: (!file || loading || aiLoading) ? 0.5 : 1,
              }
            ]}
          >
            {loading || aiLoading ? (
              <ActivityIndicator size={16} color={isDark ? '#0a0f1e' : '#fff'} />
            ) : (
              <Ionicons name="cloud-upload" size={16} color={isDark ? '#0a0f1e' : '#fff'} />
            )}
            <Text style={[styles.buttonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
              {loading || aiLoading ? 'Analyzing...' : 'Upload & Analyze'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected file */}
        {file && (
          <Text style={[styles.selectedFileText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
            Selected: <Text style={styles.selectedFileName}>{file.name}</Text>
          </Text>
        )}

        {/* Hint */}
        <Text style={[styles.hintText, { color: isDark ? '#6a7282' : '#7c3aed' }]}>
          Analysis usually takes 10–20 seconds
        </Text>

        {/* Notes */}
        {showNotes && (
          <View style={styles.notesContainer}>
            <View style={styles.notesHeader}>
              <Ionicons name="information-circle" size={14} color={isDark ? '#a8b3cf' : '#6b21a8'} />
              <Text style={[styles.notesTitle, { color: isDark ? '#a8b3cf' : '#6b21a8' }]}>
                Notes for AI analysis (optional)
              </Text>
            </View>

            <TextInput
              value={userNotes}
              onChangeText={setUserNotes}
              multiline
              numberOfLines={4}
              placeholder="• I'm applying for a Frontend Developer role\n• Please focus on ATS & missing skills\n• This is my first job / junior position"
              placeholderTextColor={isDark ? '#6a7282' : '#7c3aed'}
              style={[
                styles.notesInput,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff',
                  borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#ddd6fe',
                  color: isDark ? '#fff' : '#2e1065',
                }
              ]}
            />

            <Text style={[styles.notesHint, { color: isDark ? '#6a7282' : '#7c3aed' }]}>
              This won't change your CV — it only helps the AI focus better.
            </Text>
          </View>
        )}

        {/* Message */}
        {message && (
          <Text style={[
            styles.messageText,
            {
              color: messageType === 'ok' ? '#22c55e' :
                     messageType === 'warn' ? '#fbbf24' : '#ef4444'
            }
          ]}>
            {message}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  backButtonText: {
    fontWeight: '600',
  },
  instructionsContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  dropzone: {
    margin: 16,
    padding: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 24,
  },
  dropzoneTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  dropzoneSubtitle: {
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
  selectedFileText: {
    fontSize: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  selectedFileName: {
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    marginTop: 4,
  },
  notesContainer: {
    width: '100%',
    marginTop: 32,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  notesInput: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  notesHint: {
    fontSize: 12,
    marginTop: 8,
  },
  messageText: {
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
  },
});
