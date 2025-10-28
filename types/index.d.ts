export interface ThemeContextType {
    isDark: boolean;
    toggle: () => void;
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
            role?: string;
        }
    }
}