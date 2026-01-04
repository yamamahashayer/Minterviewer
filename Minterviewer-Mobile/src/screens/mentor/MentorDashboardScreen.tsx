import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const MentorDashboardScreen = () => {
    const { signOut, user } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Mentor</Text>
            <Text style={styles.subtitle}>{user?.full_name}</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 10,
    },
});

export default MentorDashboardScreen;
