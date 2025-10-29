"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Cookies from "js-cookie";
import { User, UserRole } from "./types";
import { useGetProfile, useLogout } from "./hooks";

// Create QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

// Auth Context
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { data: profileData, isLoading: profileLoading } = useGetProfile();
    const logoutMutation = useLogout();

    const isAuthenticated = !!user && !!Cookies.get("access_token");

    useEffect(() => {
        const token = Cookies.get("access_token");
        if (token && !user) {
            // Token exists but no user data, fetch profile
            if (profileData?.user) {
                setUser(profileData.user);
            }
        } else if (!token && user) {
            // No token but user exists, clear user
            setUser(null);
        }
        setIsLoading(false);
    }, [profileData, user]);

    const login = (accessToken: string, refreshToken: string, userData: User) => {
        Cookies.set("access_token", accessToken, { expires: 7 });
        Cookies.set("refresh_token", refreshToken, { expires: 30 });
        setUser(userData);
    };

    const logout = () => {
        const refreshToken = Cookies.get("refresh_token");
        if (refreshToken) {
            logoutMutation.mutate(refreshToken);
        }
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading: isLoading || profileLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Role-based access control hook
export function useRole() {
    const { user } = useAuth();

    const hasRole = (role: UserRole) => {
        return user?.role === role;
    };

    const hasAnyRole = (roles: UserRole[]) => {
        return user?.role ? roles.includes(user.role) : false;
    };

    const isAdmin = () => hasRole(UserRole.ADMIN);
    const isCandidate = () => hasRole(UserRole.CANDIDATE);
    const isBoothManager = () => hasRole(UserRole.BOOTH_MANAGER);

    return {
        hasRole,
        hasAnyRole,
        isAdmin,
        isCandidate,
        isBoothManager,
        role: user?.role,
    };
}

// Main App Provider
interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster position="top-right" richColors />
            </AuthProvider>
        </QueryClientProvider>
    );
}
