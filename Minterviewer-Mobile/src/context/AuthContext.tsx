import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { AuthState, User, LoginResponse } from '../types/auth';

interface SessionResponse {
    ok: boolean;
    token: string | null;
    user: User | null;
    mentee?: { _id: string } | null;
    mentor?: any | null;
    company?: { _id: string; isVerified?: boolean } | null;
}

interface AuthContextData extends AuthState {
    signIn: (token: string, user: User) => Promise<void>;
    signOut: () => Promise<void>;
    updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AuthState>({
        user: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
    });

    useEffect(() => {
        loadStorageData();
    }, []);

    async function loadStorageData() {
        try {
            const [token, userJson] = await AsyncStorage.multiGet(['auth_token', 'user_data']);

            if (token[1]) {
                // Use session endpoint to validate token and get fresh user data
                api.defaults.headers.Authorization = `Bearer ${token[1]}`;
                
                try {
                    const response = await api.get<SessionResponse>('/api/auth/session');
                    
                    if (response.data.ok && response.data.user) {
                        const user: User = {
                            ...response.data.user,
                            menteeId: response.data.mentee?._id,
                            mentorId: response.data.mentor?._id,
                            companyId: response.data.company?._id,
                            isVerified: response.data.company?.isVerified,
                        };

                        console.log('AuthContext Session Debug:', { 
                            response: response.data, 
                            user,
                            menteeId: user.menteeId,
                            mentorId: user.mentorId,
                            companyId: user.companyId
                        });

                        // Update stored user data with fresh data
                        await AsyncStorage.setItem('user_data', JSON.stringify(user));

                        setData({
                            token: token[1],
                            user,
                            isLoading: false,
                            isAuthenticated: true,
                        });
                    } else {
                        // Token invalid, clear storage
                        await AsyncStorage.multiRemove(['auth_token', 'user_data']);
                        delete api.defaults.headers.Authorization;
                        setData((prevState) => ({ ...prevState, isLoading: false }));
                    }
                } catch (sessionError) {
                    console.error('Session validation failed:', sessionError);
                    // Session endpoint failed, clear storage
                    await AsyncStorage.multiRemove(['auth_token', 'user_data']);
                    delete api.defaults.headers.Authorization;
                    setData((prevState) => ({ ...prevState, isLoading: false }));
                }
            } else {
                setData((prevState) => ({ ...prevState, isLoading: false }));
            }
        } catch (error) {
            console.error('Failed to load auth data', error);
            setData((prevState) => ({ ...prevState, isLoading: false }));
        }
    }

    async function signIn(token: string, user: User) {
        try {
            await AsyncStorage.multiSet([
                ['auth_token', token],
                ['user_data', JSON.stringify(user)],
            ]);

            api.defaults.headers.Authorization = `Bearer ${token}`;

            setData({
                token,
                user,
                isLoading: false,
                isAuthenticated: true,
            });
        } catch (error) {
            console.error('SignIn error', error);
            throw error;
        }
    }

    async function signOut() {
        try {
            await AsyncStorage.multiRemove(['auth_token', 'user_data']);

            // Clear API header
            delete api.defaults.headers.Authorization;

            setData({
                token: null,
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        } catch (error) {
            console.error('SignOut error', error);
        }
    }

    async function updateUser(user: User) {
        try {
            await AsyncStorage.setItem('user_data', JSON.stringify(user));
            setData((prevState) => ({ ...prevState, user }));
        } catch (error) {
            console.error('UpdateUser error', error);
        }
    }

    return (
        <AuthContext.Provider value={{ ...data, signIn, signOut, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
