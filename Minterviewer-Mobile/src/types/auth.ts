export type UserRole = 'mentee' | 'mentor' | 'company' | 'admin';

export interface User {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    profile_photo?: string;
    menteeId?: string;
    mentorId?: string;
    companyId?: string;
    isVerified?: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginResponse {
    ok: boolean;
    message: string;
    token: string;
    user: User;
    redirectUrl: string;
}
