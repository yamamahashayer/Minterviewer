import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import api from '../../services/api';
import { colors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
    redirectTo?: string;
    firebaseId?: string;
}

const NotificationsScreen = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const navigation = useNavigation();

    const fetchNotifications = async () => {
        try {
            const userId = user?.id || (user as any)?._id;
            if (!userId) return;
            const response = await api.get(`/api/notifications?userId=${userId}`);
            if (response.data.ok) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user?.id, (user as any)?._id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const markAsRead = async (id: string, firebaseId?: string) => {
        try {
            const targetId = firebaseId || id;
            if (!targetId) return;

            // Optimistic update
            setNotifications(prev => prev.map(n =>
                (n._id === id || n.firebaseId === firebaseId) ? { ...n, read: true } : n
            ));

            await api.put('/api/notifications', { id: targetId, read: true });
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.card, !item.read && styles.unreadCard]}
            onPress={() => !item.read && markAsRead(item._id, item.firebaseId)}
        >
            <View style={styles.iconContainer}>
                <Feather
                    name={item.type === 'system' ? 'info' : 'bell'}
                    size={24}
                    color={!item.read ? colors.primary : '#9CA3AF'}
                />
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            {!item.read && <View style={styles.dot} />}
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="bell-off" size={48} color={colors.text.secondary} />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: '#EFF6FF',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2
    },
    content: {
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4
    },
    unreadText: {
        color: '#111827',
        fontWeight: 'bold'
    },
    message: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20
    },
    date: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 8
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginLeft: 8,
        marginTop: 6
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    emptyText: {
        marginTop: 12,
        color: '#6B7280',
        fontSize: 16,
    },
});

export default NotificationsScreen;
