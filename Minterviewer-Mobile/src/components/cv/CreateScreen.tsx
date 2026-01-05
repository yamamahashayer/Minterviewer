import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { menteeService, type MenteeProfile } from '../../services/menteeService';
import { cvService, CVService, type DocumentFile, type CVCreateResponse } from '../../services/cvService';
import type { 
  CVData, 
  CvType, 
  StepKey, 
  StepMeta, 
  Experience, 
  Education, 
  Skills, 
  Project, 
  Personal 
} from './types';

// Import step components
import TypeStep from './steps/TypeStep';
import TargetStep from './steps/TargetStep';
import PersonalStep from './steps/PersonalStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationStep from './steps/EducationStep';
import SkillsStep from './steps/SkillsStep';
import ProjectsStep from './steps/ProjectsStep';
import SummaryStep from './steps/SummaryStep';
import PreviewStep from './steps/PreviewStep';

interface Props {
  onBack: () => void;
  onSuccess: (data: any) => void;
}

export default function CreateScreen({ onBack, onSuccess }: Props) {
  const { isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [prefilledOnce, setPrefilledOnce] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState<'pdf' | 'docx' | null>(null);
  const [lastResumeId, setLastResumeId] = useState<string | null>(null);
  const personalDataRef = React.useRef<Personal | null>(null);

  // CV Data State
  const [cvType, setCvType] = useState<CvType>('general');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [cvData, setCvData] = useState<CVData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      linkedin: '',
      github: '',
    },
    experience: [
      {
        id: 1,
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ],
    education: [
      {
        id: 1,
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: '',
      },
    ],
    skills: {
      technical: '',
      soft: '',
      languages: '',
    },
    projects: [
      {
        id: 1,
        name: '',
        description: '',
        github: '',
        link: '',
      },
    ],
  });

  // Navigation State
  const [activeStep, setActiveStep] = useState<number>(0);

  // Steps Configuration
  const allSteps: StepMeta[] = [
    { key: 'type', title: 'CV Type', icon: 'flag' },
    { key: 'target', title: 'Targeting', icon: 'flag' },
    { key: 'personal', title: 'Personal', icon: 'person' },
    { key: 'experience', title: 'Experience', icon: 'briefcase' },
    { key: 'education', title: 'Education', icon: 'school' },
    { key: 'skills', title: 'Skills', icon: 'code' },
    { key: 'projects', title: 'Projects', icon: 'folder' },
    { key: 'summary', title: 'Summary', icon: 'document-text' },
    { key: 'preview', title: 'Preview', icon: 'eye' },
  ];

  const visibleSteps: StepKey[] = (() => {
    const base: StepKey[] = ['type'];
    if (cvType !== 'general') base.push('target');
    return [
      ...base,
      'personal',
      'experience',
      'education',
      'skills',
      'projects',
      'summary',
      'preview',
    ];
  })();

  // Update active step if it becomes invalid
  useEffect(() => {
    if (activeStep >= visibleSteps.length) {
      setActiveStep(visibleSteps.length - 1);
    }
  }, [visibleSteps, activeStep]);

  // Update ref when cvData changes
  useEffect(() => {
    personalDataRef.current = cvData.personal;
  }, [cvData.personal]);

  // Pre-fill mentee data from AuthContext and MenteeService
  useEffect(() => {
    if (!isAuthenticated || !user || prefilledOnce) return;

    const prefillData = async () => {
      try {
        // First, pre-fill from AuthContext user data
        const safeSet = (key: keyof Personal, value?: string | null) => {
          if (!value) return;
          const current = personalDataRef.current?.[key] || '';
          if (!current.trim()) {
            setCvData(prev => {
              const updated = {
                ...prev,
                personal: { ...prev.personal, [key]: value }
              };
              personalDataRef.current = updated.personal;
              return updated;
            });
          }
        };

        safeSet("fullName", user.full_name);
        safeSet("email", user.email);

        // Then get detailed mentee profile
        if (user.menteeId) {
          try {
            const { mentee } = await menteeService.getProfile(user.menteeId);
            
            // Pre-fill additional fields from mentee profile
            safeSet("phone", mentee.phoneNumber || mentee.phone);
            safeSet("location", mentee.Country || mentee.location);
            safeSet("linkedin", mentee.linkedin_url);
            safeSet("github", mentee.github);
            safeSet("summary", mentee.short_bio);

            // Pre-fill skills if available
            if (mentee.skills && mentee.skills.length > 0) {
              const technicalSkills = mentee.skills
                .filter(skill => skill.level >= 3) // Only include skills with level 3+
                .map(skill => skill.name)
                .join(', ');
              
              if (technicalSkills) {
                setCvData(prev => ({
                  ...prev,
                  skills: { ...prev.skills, technical: technicalSkills }
                }));
              }
            }

            // Pre-fill education if available
            if (mentee.education) {
              setCvData(prev => ({
                ...prev,
                education: [{
                  ...prev.education[0],
                  degree: mentee.education || '',
                  institution: '',
                  location: '',
                  graduationDate: '',
                  gpa: '',
                }]
              }));
            }

          } catch (profileError) {
            console.log('Could not fetch mentee profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Error pre-filling data:', error);
      } finally {
        setPrefilledOnce(true);
      }
    };

    prefillData();
  }, [isAuthenticated, user, prefilledOnce]);

  // Validation - Match Web CV validation exactly
  const canProceed = (): boolean => {
    const currentKey = visibleSteps[activeStep];

    switch (currentKey) {
      case 'type':
        return !!cvType;
      case 'target':
        if (cvType === 'role') return !!targetRole.trim();
        if (cvType === 'job') return !!jobDescription.trim();
        return true;
      case 'personal': {
        const p = cvData.personal;
        // Only required fields from Web version
        return !!(p.fullName && p.email && p.phone && p.location);
      }
      // All other steps are optional in Web version
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      Alert.alert('Validation Error', 'Please complete all required fields before proceeding.');
      return;
    }

    if (activeStep < visibleSteps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user?.menteeId) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    setLoading(true);
    try {
      // Mock submission - in real implementation this would call the API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        menteeId: user.menteeId,
        resumeId: `cv-${Date.now()}`,
        analysis: {
          score: 88,
          atsScore: 92,
          improvements: [
            'Add more quantifiable achievements',
            'Include specific technologies for each experience',
            'Strengthen summary with career objectives'
          ],
          categories: {
            formatting: { score: 9, insights: ['Professional layout', 'Clear sections'] },
            content: { score: 8, insights: ['Strong experience descriptions'] },
            keywords: { score: 9, insights: ['Good keyword density'] },
            experience: { score: 9, insights: ['Detailed impact statements'] },
          },
        },
      };

      onSuccess(mockResponse);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit CV');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    const currentKey = visibleSteps[activeStep];

    switch (currentKey) {
      case 'type':
        return (
          <TypeStep
            cvType={cvType}
            setCvType={setCvType}
          />
        );

      case 'target':
        return (
          <TargetStep
            cvType={cvType}
            setCvType={setCvType}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        );

      case 'personal':
        return (
          <PersonalStep
            value={cvData.personal}
            onChange={(key, value) => 
              setCvData(prev => ({ 
                ...prev, 
                personal: { ...prev.personal, [key]: value } 
              }))
            }
          />
        );

      case 'experience':
        return (
          <ExperienceStep
            items={cvData.experience}
            setItems={setExperienceItems}
          />
        );

      case 'education':
        return (
          <EducationStep
            items={cvData.education}
            setItems={setEducationItems}
          />
        );

      case 'skills':
        return (
          <SkillsStep
            skills={cvData.skills}
            update={(category, value) => 
              setCvData(prev => ({ 
                ...prev, 
                skills: { ...prev.skills, [category]: value } 
              }))
            }
            menteeId={user?.menteeId}
            cvType={cvType}
            cvData={cvData}
            targetRole={targetRole}
            jobDescription={jobDescription}
          />
        );

      case 'projects':
        return (
          <ProjectsStep
            projects={cvData.projects}
            setProjects={setProjects}
          />
        );

      case 'summary':
        return (
          <SummaryStep
            value={cvData.personal.summary}
            onChange={(value) => 
              setCvData(prev => ({ 
                ...prev, 
                personal: { ...prev.personal, summary: value } 
              }))
            }
            menteeId={user?.menteeId}
            activeKey={currentKey}
            cvType={cvType}
            cvData={cvData}
            targetRole={targetRole}
            jobDescription={jobDescription}
          />
        );

      case 'preview':
        return (
          <PreviewStep
            cvType={cvType}
            data={cvData}
            menteeId={user?.menteeId}
            onSave={handleSaveCV}
            onExportPDF={() => handleExportCV('pdf')}
            onExportDOCX={() => handleExportCV('docx')}
            saveLoading={saveLoading}
            exportLoading={exportLoading}
          />
        );

      default:
        return null;
    }
  };

  // Helper functions for dynamic sections
  const setExperienceItems = (updater: Experience[] | ((prev: Experience[]) => Experience[])) => {
    setCvData(prev => ({ ...prev, experience: typeof updater === 'function' ? updater(prev.experience) : updater }));
  };

  const setEducationItems = (updater: Education[] | ((prev: Education[]) => Education[])) => {
    setCvData(prev => ({ ...prev, education: typeof updater === 'function' ? updater(prev.education) : updater }));
  };

  const setProjects = (updater: Project[] | ((prev: Project[]) => Project[])) => {
    setCvData(prev => ({ ...prev, projects: typeof updater === 'function' ? updater(prev.projects) : updater }));
  };

  // CV Upload and Processing
  const handleCVUpload = async () => {
    if (!user?.menteeId) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    try {
      setCvLoading(true);

      // For now, use a mock file since expo-document-picker may not be available
      // In a real implementation, this would use DocumentPicker.getDocumentAsync()
      const mockFile: DocumentFile = {
        uri: 'mock-cv-file.pdf',
        name: 'resume.pdf',
        mimeType: 'application/pdf',
      };

      // Process CV through the full pipeline
      const analysisResult = await cvService.processCV(user.menteeId, mockFile);

      // Convert Affinda data to CV structure and merge with existing data
      const parsedData = CVService.convertAffindaToCVData(analysisResult.analysis);
      
      // Merge parsed data with existing CV data
      setCvData(prev => ({
        personal: {
          ...prev.personal,
          ...parsedData.personal,
        },
        experience: (parsedData.experience && parsedData.experience.length > 0) ? parsedData.experience : prev.experience,
        education: (parsedData.education && parsedData.education.length > 0) ? parsedData.education : prev.education,
        skills: {
          ...prev.skills,
          ...parsedData.skills,
        },
        projects: (parsedData.projects && parsedData.projects.length > 0) ? parsedData.projects : prev.projects,
      }));

      Alert.alert('Success', 'CV uploaded and analyzed successfully! Your experience, education, and skills have been auto-filled.');

    } catch (error: any) {
      console.error('CV upload error:', error);
      Alert.alert('Upload Error', error.message || 'Failed to upload and analyze CV');
    } finally {
      setCvLoading(false);
    }
  };

  // Save CV to database
  const handleSaveCV = async (): Promise<string | null> => {
    if (!user?.menteeId) {
      Alert.alert('Error', 'User session not found');
      return null;
    }

    setSaveLoading(true);
    try {
      const html = CVService.buildResumeHtml(cvData);
      
      const response: CVCreateResponse = await cvService.saveCV(user.menteeId, html, {});
      
      if (response.ok && response.resume._id) {
        setLastResumeId(response.resume._id);
        Alert.alert('Success', 'CV saved successfully!');
        return response.resume._id;
      } else {
        throw new Error('Failed to save CV');
      }
    } catch (error: any) {
      console.error('Save CV error:', error);
      Alert.alert('Save Error', error.message || 'Failed to save CV');
      return null;
    } finally {
      setSaveLoading(false);
    }
  };

  // Export CV as PDF or DOCX
  const handleExportCV = async (format: 'pdf' | 'docx') => {
    if (!user?.menteeId) {
      Alert.alert('Error', 'User session not found');
      return;
    }

    setExportLoading(format);
    try {
      let resumeId = lastResumeId;
      
      // If not saved yet, save first
      if (!resumeId) {
        resumeId = await handleSaveCV();
        if (!resumeId) return;
      }

      const blob = await cvService.exportCV(user.menteeId, resumeId, format);
      
      // For mobile, we would need to handle the blob differently
      // For now, just show success message
      Alert.alert('Export Started', `Your CV is being exported as ${format.toUpperCase()}. The file will be downloaded shortly.`);
      
    } catch (error: any) {
      console.error('Export CV error:', error);
      Alert.alert('Export Error', error.message || 'Failed to export CV');
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0a0f1e' : '#f5f3ff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#2e1065' }]}>
            CV Builder 📝
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#99a1af' : '#6b21a8' }]}>
            Create your professional resume step-by-step
          </Text>
        </View>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={handleCVUpload}
            disabled={cvLoading}
            style={[
              styles.uploadButton,
              {
                backgroundColor: isDark ? 'rgba(94,234,212,0.1)' : 'rgba(124,58,237,0.1)',
                borderColor: isDark ? 'rgba(94,234,212,0.3)' : '#ddd6fe',
                opacity: cvLoading ? 0.6 : 1,
              }
            ]}
          >
            {cvLoading ? (
              <>
                <Ionicons name="refresh" size={16} color={isDark ? '#5eead4' : '#7c3aed'} />
                <Text style={[styles.uploadButtonText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
                  Processing...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={16} color={isDark ? '#5eead4' : '#7c3aed'} />
                <Text style={[styles.uploadButtonText, { color: isDark ? '#5eead4' : '#7c3aed' }]}>
                  Upload CV
                </Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)' }
            ]}
          >
            <Ionicons name="arrow-back" size={16} color={isDark ? '#fff' : '#7c3aed'} />
            <Text style={[styles.backButtonText, { color: isDark ? '#fff' : '#7c3aed' }]}>
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Steps Header */}
      <View style={styles.stepsHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.stepsContainer}>
            {allSteps
              .filter(step => visibleSteps.includes(step.key))
              .map((step, index) => {
                const isActive = visibleSteps[activeStep] === step.key;
                const isCompleted = visibleSteps.indexOf(step.key) < activeStep;
                
                return (
                  <TouchableOpacity
                    key={step.key}
                    style={[
                      styles.stepIndicator,
                      {
                        backgroundColor: isActive
                          ? isDark ? '#5eead4' : '#7c3aed'
                          : isCompleted
                          ? isDark ? 'rgba(94,234,212,0.2)' : 'rgba(124,58,237,0.2)'
                          : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)',
                      }
                    ]}
                  >
                    <Ionicons
                      name={step.icon as any}
                      size={16}
                      color={isActive
                        ? isDark ? '#0a0f1e' : '#fff'
                        : isDark ? '#fff' : '#7c3aed'
                      }
                    />
                    <Text style={[
                      styles.stepIndicatorText,
                      {
                        color: isActive
                          ? isDark ? '#0a0f1e' : '#fff'
                          : isDark ? '#fff' : '#7c3aed'
                      }
                    ]}>
                      {step.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </ScrollView>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {renderStep()}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={activeStep === 0}
          style={[
            styles.navButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)',
              opacity: activeStep === 0 ? 0.4 : 1,
            }
          ]}
        >
          <Ionicons name="arrow-back" size={16} color={isDark ? '#fff' : '#7c3aed'} />
          <Text style={[styles.navButtonText, { color: isDark ? '#fff' : '#7c3aed' }]}>
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed() || loading}
          style={[
            styles.navButton,
            {
              backgroundColor: canProceed() && !loading
                ? isDark ? '#5eead4' : '#7c3aed'
                : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(124,58,237,0.1)',
              opacity: canProceed() && !loading ? 1 : 0.4,
            }
          ]}
        >
          {loading ? (
            <>
              <Ionicons name="refresh" size={16} color={isDark ? '#0a0f1e' : '#fff'} />
              <Text style={[styles.navButtonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
                Processing...
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.navButtonText, { color: isDark ? '#0a0f1e' : '#fff' }]}>
                {activeStep === visibleSteps.length - 1 ? 'Complete CV' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={isDark ? '#0a0f1e' : '#fff'} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
    paddingBottom: 16,
  },
  headerButtons: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '500',
  },
  stepsHeader: {
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  stepIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 32,
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 32,
    paddingTop: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
