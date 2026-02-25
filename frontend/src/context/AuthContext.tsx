'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser, getCurrentUser } from '@/lib/api';

interface User {
    username: string;
    email: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        if (savedToken) {
            setToken(savedToken);
            // Validate token by fetching user info
            getCurrentUser(savedToken)
                .then((userData) => {
                    setUser(userData);
                })
                .catch(() => {
                    // Token expired or invalid
                    localStorage.removeItem('auth_token');
                    setToken(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (username: string, password: string, rememberMe: boolean) => {
        const response = await loginUser(username, password, rememberMe);
        setToken(response.token);
        setUser({ username: response.username, email: response.email });
        localStorage.setItem('auth_token', response.token);
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        const response = await registerUser(username, email, password);
        setToken(response.token);
        setUser({ username: response.username, email: response.email });
        localStorage.setItem('auth_token', response.token);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            isLoading,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
