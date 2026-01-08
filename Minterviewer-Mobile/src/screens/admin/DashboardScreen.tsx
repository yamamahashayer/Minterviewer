import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { colors } from '../../theme';
import { Feather } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import AdminLayout from '../../layouts/AdminLayout';
import { useTheme } from '../../context/ThemeContext';

// Define types for the stats data
interface AdminStats {
    earnings: {
        total: number;
        chart: { date: string; amount: number }[];
    };
    users: { total: number; mentors: number; mentees: number };
    sessions: { total: number; completed: number };
    interviews: { total: number; finalized: number };
}

const DashboardScreen = () => {
    const { isDark } = useTheme();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const fetchStats = async () => {
        try {
            const response = await api.get('/api/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch admin stats:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    const StatCard = ({
        title,
        count,
        subtitle,
        icon,
        color,
        bgColor,
    }: {
        title: string;
        count: string | number;
        subtitle?: string;
        icon: string;
        color: string;
        bgColor: string;
    }) => (
        <View style={[styles.card, { backgroundColor: isDark ? colors.background.headerDark : 'white' }]}>
            <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                <Feather name={icon as any} size={24} color={color} />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? colors.text.secondaryDark : '#6B7280' }]}>{title}</Text>
                <Text style={[styles.cardCount, { color: isDark ? '#ffffff' : '#111827' }]}>{count}</Text>
                {subtitle && <Text style={[styles.cardSubtitle, { color: isDark ? '#6b7280' : '#9CA3AF' }]}>{subtitle}</Text>}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <AdminLayout>
            <ScrollView
                style={[styles.container, { backgroundColor: isDark ? colors.background.dark : '#F3F4F6' }]}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor={isDark ? colors.text.secondaryDark : colors.text.secondary}
                        colors={[isDark ? colors.text.secondaryDark : colors.text.secondary]}
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#111827' }]}>Admin Dashboard</Text>
                    <Text style={[styles.headerSubtitle, { color: isDark ? colors.text.secondaryDark : '#6B7280' }]}>
                        Platform Analytics & Insights
                    </Text>
                </View>

                <View style={styles.grid}>
                    <StatCard
                        title="Total Earnings"
                        count={stats?.earnings?.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) || '$0.00'}
                        subtitle="Total platform revenue"
                        icon="dollar-sign"
                        color="#059669"
                        bgColor="#D1FAE5"
                    />

                    <View style={[styles.chartContainer, { backgroundColor: isDark ? colors.background.headerDark : 'white' }]}>
                        <Text style={[styles.chartTitle, { color: isDark ? '#ffffff' : '#374151' }]}>Earnings Overview</Text>
                        {stats?.earnings?.chart && stats.earnings.chart.length > 0 ? (
                            <LineChart
                                data={{
                                    labels: stats.earnings.chart.map(d => d.date.slice(5)), // MM-DD
                                    datasets: [{
                                        data: stats.earnings.chart.map(d => d.amount)
                                    }]
                                }}
                                width={Dimensions.get("window").width - 32}
                                height={220}
                                yAxisLabel="$"
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundColor: "#ffffff",
                                    backgroundGradientFrom: "#ffffff",
                                    backgroundGradientTo: "#ffffff",
                                    decimalPlaces: 0,
                                    color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                    style: { borderRadius: 16 },
                                    propsForDots: {
                                        r: "6",
                                        strokeWidth: "2",
                                        stroke: "#059669"
                                    }
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16
                                }}
                            />
                        ) : (
                            <Text style={[styles.noDataText, { color: isDark ? colors.text.secondaryDark : '#9CA3AF' }]}>No chart data available</Text>
                        )}
                    </View>

                    <StatCard
                        title="Total Users"
                        count={stats?.users?.total || 0}
                        subtitle={`${stats?.users?.mentors || 0} Mentors, ${stats?.users?.mentees || 0} Mentees`}
                        icon="users"
                        color="#2563EB"
                        bgColor="#DBEAFE"
                    />

                    <StatCard
                        title="Total Sessions"
                        count={stats?.sessions?.total || 0}
                        subtitle={`${stats?.sessions?.completed || 0} Completed`}
                        icon="activity"
                        color="#4F46E5"
                        bgColor="#E0E7FF"
                    />

                    <StatCard
                        title="AI Interviews"
                        count={stats?.interviews?.total || 0}
                        subtitle={`${stats?.interviews?.finalized || 0} Finalized`}
                        icon="target"
                        color="#9333EA"
                        bgColor="#F3E8FF"
                    />
                </View>
            </ScrollView>
        </AdminLayout>
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
    scrollContent: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    grid: {
        gap: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
    },
    cardCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    chartContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
        alignSelf: 'flex-start'
    },
    noDataText: {
        color: '#9CA3AF',
        padding: 20
    }
});

export default DashboardScreen;
