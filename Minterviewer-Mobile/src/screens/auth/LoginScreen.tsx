import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { LoginResponse } from '../../types/auth';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<LoginResponse>('/api/auth/signin', {
        email,
        password,
      });

      if (res.data.ok) {
        await signIn(res.data.token, res.data.user);
        // RootNavigator رح يحوّل حسب الدور
      } else {
        Alert.alert('Login failed', res.data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      Alert.alert(
        'Login error',
        err.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0a192f', '#112240', '#0d3d56']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>

          <View style={styles.card}>

            {/* Brand */}
            <Text style={styles.brand}>Minterviewer</Text>

            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>
              Ready to ace your next interview?
            </Text>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <View style={styles.passwordRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('Info', 'Forgot password coming soon')
                  }
                >
                  <Text style={styles.forgot}>Forgot?</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a192f" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don’t have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.signup}> Sign up</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default LoginScreen;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: 'rgba(10,25,47,0.85)',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(0,255,178,0.2)',
  },

  brand: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#00FFB2',
    marginBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 32,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#112240',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1f2937',
  },

  passwordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  forgot: {
    fontSize: 13,
    color: '#00FFB2',
    fontWeight: '600',
  },

  button: {
    marginTop: 28,
    backgroundColor: '#00FFB2',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  buttonText: {
    color: '#0a192f',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },

  footerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  signup: {
    color: '#00FFB2',
    fontSize: 14,
    fontWeight: '700',
  },
});
