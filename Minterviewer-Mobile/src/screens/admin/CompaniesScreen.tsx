import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    ScrollView,
    RefreshControl,
} from 'react-native';
import api from '../../services/api';
import { colors } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { User } from '../../types/auth';
import AdminLayout from '../../layouts/AdminLayout';
import { useTheme } from '../../context/ThemeContext';

interface Company {
    _id: string;
    name: string;
    workEmail: string;
    industry: string;
    location: string;
    isVerified: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    rejectionReason?: string;
    createdAt: string;
    user?: {
        full_name: string;
    }
}

const CompaniesScreen = () => {
    const { isDark } = useTheme();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [searchTerm, setSearchTerm] = useState('');

    // Rejection Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                status: activeTab,
                search: searchTerm,
            });

            const response = await api.get(`/api/admin/companies?${params.toString()}`);
            if (response.data.companies) {
                setCompanies(response.data.companies);
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab, searchTerm]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchCompanies();
    };

    const handleApprove = async (companyId: string) => {
        Alert.alert(
            'Confirm Approval',
            'Are you sure you want to approve this company?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Approve',
                    onPress: async () => {
                        try {
                            const response = await api.patch(`/api/admin/companies/${companyId}/approve`);
                            if (response.status === 200) {
                                Alert.alert('Success', 'Company approved successfully');
                                fetchCompanies();
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to approve company');
                        }
                    },
                },
            ]
        );
    };

    const handleRejectPress = (companyId: string) => {
        setSelectedCompanyId(companyId);
        setRejectionReason('');
        setModalVisible(true);
    };

    const submitRejection = async () => {
        if (!selectedCompanyId || !rejectionReason.trim()) {
            Alert.alert('Error', 'Please provide a reason');
            return;
        }

        try {
            const response = await api.patch(`/api/admin/companies/${selectedCompanyId}/reject`, {
                reason: rejectionReason,
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Company rejected');
                setModalVisible(false);
                fetchCompanies();
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to reject company');
        }
    };

    const renderItem = ({ item }: { item: Company }) => (
        <View style={[styles.card, { backgroundColor: isDark ? colors.background.headerDark : 'white', borderColor: isDark ? colors.border.dark : 'transparent' }]}>
            <View style={styles.row}>
                <View style={styles.info}>
                    <Text style={[styles.companyName, { color: isDark ? '#ffffff' : '#111827' }]}>{item.name}</Text>
                    <Text style={[styles.detailText, { color: isDark ? colors.text.secondaryDark : '#4B5563' }]}>📧 {item.workEmail}</Text>
                    <Text style={[styles.detailText, { color: isDark ? colors.text.secondaryDark : '#4B5563' }]}>🏭 {item.industry || 'N/A'}</Text>
                    <Text style={[styles.detailText, { color: isDark ? colors.text.secondaryDark : '#4B5563' }]}>📍 {item.location || 'N/A'}</Text>
                    {item.user?.full_name && (
                        <Text style={[styles.detailText, { color: isDark ? colors.text.secondaryDark : '#4B5563' }]}>👤 {item.user.full_name}</Text>
                    )}

                    <Text style={[styles.dateText, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>
                        Registered: {new Date(item.createdAt).toLocaleDateString()}
                    </Text>

                    {item.approvalStatus === 'rejected' && item.rejectionReason && (
                        <Text style={[styles.rejectionReason, { color: '#DC2626' }]}>Reason: {item.rejectionReason}</Text>
                    )}
                </View>

                {activeTab === 'pending' && (
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.approveBtn]}
                            onPress={() => handleApprove(item._id)}
                        >
                            <Feather name="check" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => handleRejectPress(item._id)}
                        >
                            <Feather name="x" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <AdminLayout>
            <ScrollView
                style={[styles.container, { backgroundColor: isDark ? colors.background.dark : '#F3F4F6' }]}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor={isDark ? colors.text.secondaryDark : colors.text.secondary}
                        colors={[isDark ? colors.text.secondaryDark : colors.text.secondary]}
                    />
                }
            >
                <View style={[styles.header, { backgroundColor: isDark ? colors.background.headerDark : 'white', borderBottomColor: isDark ? colors.border.dark : '#E5E7EB' }]}>
                    <TextInput
                        style={[styles.searchInput, { backgroundColor: isDark ? '#1e293b' : '#F9FAFB', borderColor: isDark ? colors.border.dark : '#E5E7EB', color: isDark ? '#ffffff' : '#111827' }]}
                        placeholder="Search companies..."
                        placeholderTextColor={isDark ? colors.text.secondaryDark : colors.text.secondary}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={() => fetchCompanies()}
                    />

                    <View style={[styles.tabs, { backgroundColor: isDark ? '#1e293b' : '#F3F4F6' }]}>
                    {(['pending', 'approved', 'rejected'] as const).map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.activeTab, activeTab === tab && { backgroundColor: isDark ? '#0f172a' : 'white' }]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, { color: isDark ? colors.text.secondaryDark : '#6B7280' }, activeTab === tab && styles.activeTabText]}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                </View>

                <FlatList
                    data={companies}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={[styles.emptyText, { color: isDark ? colors.text.secondaryDark : '#6B7280' }]}>No companies found</Text>
                            </View>
                        ) : null
                    }
                    scrollEnabled={false}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { backgroundColor: isDark ? colors.background.headerDark : 'white' }]}>
                            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Reject Company</Text>
                            <Text style={[styles.modalSubtitle, { color: isDark ? colors.text.secondaryDark : '#6B7280' }]}>Please provide a reason for rejection:</Text>

                            <TextInput
                                style={[styles.textArea, { backgroundColor: isDark ? '#1e293b' : 'white', borderColor: isDark ? colors.border.dark : '#D1D5DB', color: isDark ? '#ffffff' : '#111827' }]}
                                multiline
                                numberOfLines={4}
                                placeholder="Rejection reason..."
                                placeholderTextColor={isDark ? colors.text.secondaryDark : '#6B7280'}
                                value={rejectionReason}
                                onChangeText={setRejectionReason}
                            />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={[styles.cancelBtnText, { color: isDark ? '#e5e7eb' : '#374151' }]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmRejectBtn]}
                                onPress={submitRejection}
                            >
                                <Text style={styles.confirmRejectBtnText}>Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                </Modal>
            </ScrollView>
        </AdminLayout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    searchInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#111827',
        marginBottom: 12,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 1,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
    },
    info: {
        flex: 1,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
    },
    rejectionReason: {
        color: '#DC2626',
        fontSize: 12,
        marginTop: 4,
        fontStyle: 'italic'
    },
    actions: {
        justifyContent: 'center',
        gap: 8,
        marginLeft: 12
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    approveBtn: {
        backgroundColor: '#059669',
    },
    rejectBtn: {
        backgroundColor: '#DC2626',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#111827'
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
        fontSize: 16
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },
    modalBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    cancelBtn: {
        backgroundColor: '#F3F4F6'
    },
    confirmRejectBtn: {
        backgroundColor: '#DC2626'
    },
    cancelBtnText: {
        color: '#374151',
        fontWeight: '600'
    },
    confirmRejectBtnText: {
        color: 'white',
        fontWeight: '600'
    }
});

export default CompaniesScreen;
