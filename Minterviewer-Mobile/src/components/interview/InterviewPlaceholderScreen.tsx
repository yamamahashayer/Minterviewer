import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  onBack: () => void;
}

export default function InterviewPlaceholderScreen({ onBack }: Props) {
  const { isDark } = useTheme();

  const handleWebRedirect = () => {
    // Open the web platform in browser
    Linking.openURL('https://your-web-platform-url.com/interview');
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDark ? '#0a0f1e' : '#f5f3ff' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)' }
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={isDark ? '#fff' : '#7c3aed'} />
          <Text style={[styles.backButtonText, { color: isDark ? '#fff' : '#7c3aed' }]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon */}
        <View style={[
          styles.iconContainer,
          { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
        ]}>
          <Ionicons 
            name="videocam" 
            size={64} 
            color={isDark ? '#5eead4' : '#7c3aed'} 
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: isDark ? '#fff' : '#2e1065' }]}>
          AI Interview Practice
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
          Professional interview preparation with AI-powered feedback
        </Text>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={[
              styles.featureIcon,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Ionicons 
                name="chatbubble" 
                size={24} 
                color={isDark ? '#5eead4' : '#7c3aed'} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                AI-Powered Questions
              </Text>
              <Text style={[styles.featureDescription, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
                Get asked relevant questions based on your role and experience
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[
              styles.featureIcon,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Ionicons 
                name="analytics" 
                size={24} 
                color={isDark ? '#5eead4' : '#7c3aed'} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                Real-time Scoring
              </Text>
              <Text style={[styles.featureDescription, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
                Receive instant feedback on your answers and performance
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[
              styles.featureIcon,
              { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}>
              <Ionicons 
                name="trophy" 
                size={24} 
                color={isDark ? '#5eead4' : '#7c3aed'} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: isDark ? '#fff' : '#2e1065' }]}>
                Detailed Reports
              </Text>
              <Text style={[styles.featureDescription, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
                Comprehensive analysis with strengths and improvement areas
              </Text>
            </View>
          </View>
        </View>

        {/* Web CTA */}
        <View style={[
          styles.ctaContainer,
          { backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)' }
        ]}>
          <Ionicons 
            name="desktop" 
            size={32} 
            color={isDark ? '#5eead4' : '#7c3aed'} 
          />
          <Text style={[styles.ctaTitle, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
            Continue on Web Platform
          </Text>
          <Text style={[styles.ctaDescription, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
            Please continue this step on the Web to complete the full interview experience with video recording, advanced AI analysis, and comprehensive feedback.
          </Text>
          
          <TouchableOpacity
            onPress={handleWebRedirect}
            style={[
              styles.ctaButton,
              { backgroundColor: isDark ? '#5eead4' : '#7c3aed' }
            ]}
          >
            <Ionicons 
              name="open" 
              size={20} 
              color={isDark ? '#0a0f1e' : '#fff'} 
            />
            <Text style={[styles.ctaButtonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
              Open Web Platform
            </Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Ionicons 
            name="information-circle" 
            size={16} 
            color={isDark ? '#99a1af' : '#6b21a8'} 
          />
          <Text style={[styles.noteText, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
            The interview experience is optimized for desktop to provide the best video quality and comprehensive AI analysis.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaContainer: {
    width: '100%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
  },
  noteText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
});
