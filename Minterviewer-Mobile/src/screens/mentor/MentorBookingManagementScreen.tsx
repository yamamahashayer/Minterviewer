import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MentorLayout from '../../layouts/MentorLayout';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme';

const { width } = Dimensions.get('window');

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  sessionOffering: string;
  notes?: string;
  status: 'available' | 'booked' | 'blocked';
  session?: {
    status: string;
    topic: string;
    sessionType: string;
  };
}

interface SessionOffering {
  id: string;
  title: string;
  topic: string;
  sessionType: string;
  duration: number;
  price: number;
  description: string;
  active: boolean;
}

export default function MentorBookingManagementScreen() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'timeslots' | 'offerings'>('timeslots');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [offerings, setOfferings] = useState<SessionOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [showOfferingForm, setShowOfferingForm] = useState(false);
  const [editingOffering, setEditingOffering] = useState<SessionOffering | null>(null);

  // Time slot form state
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedOffering, setSelectedOffering] = useState('');
  const [notes, setNotes] = useState('');

  // Offering form state
  const [offeringForm, setOfferingForm] = useState({
    title: '',
    topic: '',
    sessionType: '',
    duration: 60,
    price: 0,
    description: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Simulate API calls
      setTimeout(() => {
        setTimeSlots([
          {
            id: '1',
            startTime: '09:00',
            endTime: '10:00',
            duration: 60,
            sessionOffering: 'React Development',
            status: 'available',
            notes: 'Available for mentoring',
          },
          {
            id: '2',
            startTime: '14:00',
            endTime: '15:00',
            duration: 60,
            sessionOffering: 'Node.js Development',
            status: 'booked',
            session: {
              status: 'confirmed',
              topic: 'Node.js Basics',
              sessionType: 'mentoring',
            },
          },
        ]);

        setOfferings([
          {
            id: '1',
            title: 'React Development Session',
            topic: 'React Development',
            sessionType: 'mentoring',
            duration: 60,
            price: 50,
            description: 'Learn React fundamentals and best practices',
            active: true,
          },
          {
            id: '2',
            title: 'Node.js Development',
            topic: 'Node.js Development',
            sessionType: 'code-review',
            duration: 45,
            price: 40,
            description: 'Review and improve your Node.js code',
            active: true,
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const createTimeSlot = () => {
    Alert.alert('Success', 'Time slot created successfully!');
    setShowTimeSlotForm(false);
    resetTimeSlotForm();
  };

  const resetTimeSlotForm = () => {
    setSelectedDate('');
    setStartTime('');
    setEndTime('');
    setSelectedOffering('');
    setNotes('');
  };

  const saveOffering = () => {
    if (editingOffering) {
      Alert.alert('Success', 'Session offering updated successfully!');
    } else {
      Alert.alert('Success', 'Session offering created successfully!');
    }
    setShowOfferingForm(false);
    setEditingOffering(null);
    resetOfferingForm();
  };

  const resetOfferingForm = () => {
    setOfferingForm({
      title: '',
      topic: '',
      sessionType: '',
      duration: 60,
      price: 0,
      description: '',
    });
  };

  const editOffering = (offering: SessionOffering) => {
    setEditingOffering(offering);
    setOfferingForm({
      title: offering.title,
      topic: offering.topic,
      sessionType: offering.sessionType,
      duration: offering.duration,
      price: offering.price,
      description: offering.description,
    });
    setShowOfferingForm(true);
  };

  const deleteOffering = (id: string) => {
    Alert.alert(
      'Delete Offering',
      'Are you sure you want to delete this session offering?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setOfferings(offerings.filter(o => o.id !== id));
            Alert.alert('Success', 'Session offering deleted successfully!');
          },
        },
      ]
    );
  };

  const deleteTimeSlot = (id: string) => {
    Alert.alert(
      'Delete Time Slot',
      'Are you sure you want to delete this time slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimeSlots(timeSlots.filter(t => t.id !== id));
            Alert.alert('Success', 'Time slot deleted successfully!');
          },
        },
      ]
    );
  };

  const renderTimeSlotCard = (timeSlot: TimeSlot) => (
    <View key={timeSlot.id} style={[styles.card, {
      backgroundColor: isDark ? colors.background.cardDark : 'white',
      borderColor: isDark ? colors.border.dark : colors.border.light,
    }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.statusDot, {
            backgroundColor: timeSlot.status === 'available' ? '#10b981' : 
                           timeSlot.status === 'booked' ? '#f59e0b' : '#ef4444'
          }]} />
          <Text style={[styles.status, {
            color: timeSlot.status === 'available' ? '#10b981' : 
                   timeSlot.status === 'booked' ? '#f59e0b' : '#ef4444'
          }]}>
            {timeSlot.status.charAt(0).toUpperCase() + timeSlot.status.slice(1)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: colors.danger + '20' }]}
          onPress={() => deleteTimeSlot(timeSlot.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
          <Text style={[styles.timeText, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            {timeSlot.startTime} - {timeSlot.endTime}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="book-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
          <Text style={[styles.infoText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            {timeSlot.sessionOffering}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="hourglass-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
          <Text style={[styles.infoText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            {timeSlot.duration} minutes
          </Text>
        </View>

        {timeSlot.notes && (
          <Text style={[styles.notes, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            {timeSlot.notes}
          </Text>
        )}

        {timeSlot.session && (
          <View style={[styles.sessionInfo, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.sessionText, { color: colors.primary }]}>
              Session: {timeSlot.session.topic}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderOfferingCard = (offering: SessionOffering) => (
    <View key={offering.id} style={[styles.card, {
      backgroundColor: isDark ? colors.background.cardDark : 'white',
      borderColor: isDark ? colors.border.dark : colors.border.light,
    }]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.statusDot, {
            backgroundColor: offering.active ? '#10b981' : '#6b7280'
          }]} />
          <Text style={[styles.status, {
            color: offering.active ? '#10b981' : '#6b7280'
          }]}>
            {offering.active ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => editOffering(offering)}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.danger + '20' }]}
            onPress={() => deleteOffering(offering.id)}
          >
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.offeringTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
          {offering.title}
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
          <Text style={[styles.infoText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            ${offering.price} / {offering.duration}min
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="book-outline" size={16} color={isDark ? colors.text.secondary : colors.text.muted} />
          <Text style={[styles.infoText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            {offering.sessionType}
          </Text>
        </View>

        <Text style={[styles.description, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
          {offering.description}
        </Text>
      </View>
    </View>
  );

  return (
    <MentorLayout>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
            Booking Management
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
            Manage your time slots and session offerings
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, {
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          borderColor: isDark ? colors.border.dark : colors.border.light,
        }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'timeslots' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => setActiveTab('timeslots')}
          >
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={activeTab === 'timeslots' ? colors.primary : (isDark ? colors.text.secondary : colors.text.muted)} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'timeslots' ? colors.primary : (isDark ? colors.text.secondary : colors.text.muted) }
            ]}>
              Time Slots
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'offerings' && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => setActiveTab('offerings')}
          >
            <Ionicons 
              name="cash-outline" 
              size={20} 
              color={activeTab === 'offerings' ? colors.primary : (isDark ? colors.text.secondary : colors.text.muted)} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'offerings' ? colors.primary : (isDark ? colors.text.secondary : colors.text.muted) }
            ]}>
              Offerings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
              Loading...
            </Text>
          </View>
        ) : (
          <>
            {activeTab === 'timeslots' ? (
              <View>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowTimeSlotForm(true)}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Add Time Slot</Text>
                </TouchableOpacity>

                {timeSlots.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="calendar-outline" size={48} color={isDark ? colors.text.secondary : colors.text.muted} />
                    <Text style={[styles.emptyText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                      No time slots available
                    </Text>
                  </View>
                ) : (
                  timeSlots.map(renderTimeSlotCard)
                )}
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowOfferingForm(true)}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.addButtonText}>Add Offering</Text>
                </TouchableOpacity>

                {offerings.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="cash-outline" size={48} color={isDark ? colors.text.secondary : colors.text.muted} />
                    <Text style={[styles.emptyText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                      No session offerings available
                    </Text>
                  </View>
                ) : (
                  offerings.map(renderOfferingCard)
                )}
              </View>
            )}
          </>
        )}

        {/* Time Slot Form Modal */}
        <Modal
          visible={showTimeSlotForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, {
            backgroundColor: isDark ? colors.background.dark : 'white',
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                Add Time Slot
              </Text>
              <TouchableOpacity onPress={() => setShowTimeSlotForm(false)}>
                <Ionicons name="close" size={24} color={isDark ? colors.text.secondary : colors.text.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Date
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Select date"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Start Time
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="09:00"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  End Time
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="10:00"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Session Offering
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Select offering"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={selectedOffering}
                  onChangeText={setSelectedOffering}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Notes (optional)
                </Text>
                <TextInput
                  style={[styles.textArea, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Add notes..."
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }]}
                onPress={() => setShowTimeSlotForm(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={createTimeSlot}
              >
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Offering Form Modal */}
        <Modal
          visible={showOfferingForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.modalContainer, {
            backgroundColor: isDark ? colors.background.dark : 'white',
          }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? colors.text.primaryDark : colors.text.primaryLight }]}>
                {editingOffering ? 'Edit Offering' : 'Add Offering'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowOfferingForm(false);
                setEditingOffering(null);
                resetOfferingForm();
              }}>
                <Ionicons name="close" size={24} color={isDark ? colors.text.secondary : colors.text.muted} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Title
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Session title"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={offeringForm.title}
                  onChangeText={(text) => setOfferingForm({...offeringForm, title: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Topic
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Session topic"
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={offeringForm.topic}
                  onChangeText={(text) => setOfferingForm({...offeringForm, topic: text})}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Session Type
                </Text>
                <TextInput
                  style={[styles.input, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="mentoring, code-review, etc."
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={offeringForm.sessionType}
                  onChangeText={(text) => setOfferingForm({...offeringForm, sessionType: text})}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                    Duration (min)
                  </Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                      borderColor: isDark ? colors.border.dark : colors.border.light,
                    }]}
                    placeholder="60"
                    placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                    value={offeringForm.duration.toString()}
                    onChangeText={(text) => setOfferingForm({...offeringForm, duration: parseInt(text) || 0})}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                    Price ($)
                  </Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                      borderColor: isDark ? colors.border.dark : colors.border.light,
                    }]}
                    placeholder="50"
                    placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                    value={offeringForm.price.toString()}
                    onChangeText={(text) => setOfferingForm({...offeringForm, price: parseFloat(text) || 0})}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Description
                </Text>
                <TextInput
                  style={[styles.textArea, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                    color: isDark ? colors.text.primaryDark : colors.text.primaryLight,
                    borderColor: isDark ? colors.border.dark : colors.border.light,
                  }]}
                  placeholder="Describe your session..."
                  placeholderTextColor={isDark ? colors.text.secondary : colors.text.muted}
                  value={offeringForm.description}
                  onChangeText={(text) => setOfferingForm({...offeringForm, description: text})}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.cancelButton, {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }]}
                onPress={() => {
                  setShowOfferingForm(false);
                  setEditingOffering(null);
                  resetOfferingForm();
                }}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? colors.text.secondary : colors.text.muted }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={saveOffering}
              >
                <Text style={styles.saveButtonText}>
                  {editingOffering ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </MentorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  sessionInfo: {
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  offeringTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
