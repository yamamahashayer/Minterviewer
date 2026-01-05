import { BaseService } from './baseService';
import { User, LoginResponse } from '../types/auth';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: 'mentee' | 'mentor' | 'company';
  // Additional fields based on role
  phoneNumber?: string;
  Country?: string;
  company_name?: string;
  workEmail?: string;
  website?: string;
  industry?: string;
  location?: string;
}

export class AuthService extends BaseService {
  async signIn(credentials: SignInData): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/auth/signin', credentials);
  }

  async signUp(userData: SignUpData): Promise<LoginResponse> {
    return this.post<LoginResponse>('/api/auth/signup', userData);
  }

  async getSession(): Promise<{ ok: boolean; token: string | null; user: User | null; mentee?: any; mentor?: any; company?: any }> {
    return this.get('/api/auth/session');
  }

  async forgotPassword(email: string): Promise<{ ok: boolean; message: string }> {
    return this.post('/api/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<{ ok: boolean; message: string }> {
    return this.post('/api/auth/reset-password', { token, password });
  }
}

export const authService = new AuthService();
