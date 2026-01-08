import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import { colors } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { User, UserRole } from '../../types/auth'; // Ensure this type exists or define locally

interface AdminUser extends User {
    _id: string; // The API returns _id
    isDeleted?: boolean;
    created_at?: string;
}

const UsersScreen = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const fetchUsers = useCallback(async (pageNum: number, shouldRefresh = false) => {
        try {
            if (pageNum === 1) setLoading(true);

            const params = new URLSearchParams({
                search,
                role: roleFilter,
                page: pageNum.toString(),
                limit: limit.toString(),
            });

            const response = await api.get(`/api/admin/users?${params.toString()}`);

            if (response.data.users) {
                if (shouldRefresh || pageNum === 1) {
                    setUsers(response.data.users);
                } else {
                    setUsers((prev) => [...prev, ...response.data.users]);
                }

                // If we got fewer items than limit, no more pages
                if (response.data.users.length < limit) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [search, roleFilter, limit]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsers(1, true);
        }, 500); // Debounce
        return () => clearTimeout(timer);
    }, [search, roleFilter, fetchUsers]);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchUsers(1, true);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchUsers(nextPage);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: boolean, name: string) => {
        Alert.alert(
            'Confirm Action',
            `Are you sure you want to ${currentStatus ? 'restore' : 'deactivate'} ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await api.patch('/api/admin/users', {
                                userId,
                                isDeleted: !currentStatus,
                            });

                            if (response.status === 200) {
                                setUsers((prev) =>
                                    prev.map((u) =>
                                        u._id === userId ? { ...u, isDeleted: !currentStatus } : u
                                    )
                                );
                            }
                        } catch (error) {
                            Alert.alert('Error', 'Failed to update user status');
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: AdminUser }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.full_name || 'N/A'}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.badges}>
                    <View style={[styles.badge, getRoleBadgeStyle(item.role)]}>
                        <Text style={styles.badgeText}>{item.role}</Text>
                    </View>
                    {item.isDeleted ? (
                        <View style={[styles.badge, styles.badgeInactive]}>
                            <Text style={[styles.badgeText, styles.textRed]}>Deactivated</Text>
                        </View>
                    ) : (
                        <View style={[styles.badge, styles.badgeActive]}>
                            <Text style={[styles.badgeText, styles.textGreen]}>Active</Text>
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.actionButton, item.isDeleted ? styles.restoreBtn : styles.deleteBtn]}
                onPress={() => toggleUserStatus(item._id, !!item.isDeleted, item.full_name)}
            >
                <Feather
                    name={item.isDeleted ? 'refresh-cw' : 'trash-2'}
                    size={18}
                    color={item.isDeleted ? '#059669' : '#DC2626'}
                />
            </TouchableOpacity>
        </View>
    );

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'admin': return { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' };
            case 'mentor': return { backgroundColor: '#E0E7FF', borderColor: '#A5B4FC' };
            case 'company': return { backgroundColor: '#DBEAFE', borderColor: '#93C5FD' };
            default: return { backgroundColor: '#D1FAE5', borderColor: '#6EE7B7' };
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    placeholderTextColor={colors.text.secondary}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filter Role:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={roleFilter}
                        onValueChange={(itemValue) => setRoleFilter(itemValue)}
                        style={styles.picker}
                        dropdownIconColor={colors.text.primaryLight}
                    >
                        <Picker.Item label="All Roles" value="all" />
                        <Picker.Item label="Mentee" value="mentee" />
                        <Picker.Item label="Mentor" value="mentor" />
                        <Picker.Item label="Company" value="company" />
                        <Picker.Item label="Admin" value="admin" />
                    </Picker>
                </View>
            </View>

            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No users found</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
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
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    filterLabel: {
        fontSize: 14,
        color: '#374151',
        marginRight: 8,
    },
    pickerWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        overflow: 'hidden',
        height: 48,
        justifyContent: 'center'
    },
    picker: {
        width: '100%',
        color: '#111827',
    },
    listContent: {
        padding: 16,
    },
    userCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    badges: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        borderWidth: 1,
    },
    badgeActive: {
        backgroundColor: '#ECFDF5',
        borderColor: '#6EE7B7'
    },
    badgeInactive: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5'
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        textTransform: 'capitalize'
    },
    textGreen: {
        color: '#059669'
    },
    textRed: {
        color: '#DC2626'
    },
    actionButton: {
        padding: 10,
        borderRadius: 8,
        marginLeft: 12,
        borderWidth: 1,
    },
    deleteBtn: {
        backgroundColor: '#FEF2F2',
        borderColor: '#FCA5A5'
    },
    restoreBtn: {
        backgroundColor: '#ECFDF5',
        borderColor: '#6EE7B7'
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center'
    },
    emptyText: {
        color: '#6B7280',
        fontSize: 16
    }
});

export default UsersScreen;
