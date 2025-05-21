"use client";

import * as React from "react";
import { useApiRequest } from "./use-api-request";
import { useScreenReaderAnnouncement } from "./use-screen-reader-announcement";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function useAuth(): AuthState {
  const [user, setUser] = React.useState<User | null>(null);
  const { announceToScreenReader } = useScreenReaderAnnouncement();

  const {
    execute: executeLogin,
    isLoading: isLoginLoading,
    error: loginError,
  } = useApiRequest<AuthResponse>({
    url: "/api/auth/login",
    method: "POST",
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("token", data.token);
      announceToScreenReader("Successfully logged in");
    },
  });

  const {
    execute: executeLogout,
    isLoading: isLogoutLoading,
    error: logoutError,
  } = useApiRequest({
    url: "/api/auth/logout",
    method: "POST",
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem("token");
      announceToScreenReader("Successfully logged out");
    },
  });

  const {
    execute: executeRegister,
    isLoading: isRegisterLoading,
    error: registerError,
  } = useApiRequest<AuthResponse>({
    url: "/api/auth/register",
    method: "POST",
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("token", data.token);
      announceToScreenReader("Successfully registered");
    },
  });

  const {
    execute: executeResetPassword,
    isLoading: isResetPasswordLoading,
    error: resetPasswordError,
  } = useApiRequest({
    url: "/api/auth/reset-password",
    method: "POST",
    onSuccess: () => {
      announceToScreenReader("Password reset email sent");
    },
  });

  const { execute: executeValidateToken } = useApiRequest<User>({
    url: "/api/auth/me",
    method: "GET",
    onSuccess: (userData) => {
      setUser(userData);
    },
    onError: () => {
      localStorage.removeItem("token");
      setUser(null);
    },
  });

  const login = React.useCallback(
    async (email: string, password: string) => {
      await executeLogin({ body: { email, password } });
    },
    [executeLogin]
  );

  const logout = React.useCallback(async () => {
    await executeLogout();
  }, [executeLogout]);

  const register = React.useCallback(
    async (email: string, password: string, name: string) => {
      await executeRegister({ body: { email, password, name } });
    },
    [executeRegister]
  );

  const resetPassword = React.useCallback(
    async (email: string) => {
      await executeResetPassword({ body: { email } });
    },
    [executeResetPassword]
  );

  // Check for existing session on mount
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      executeValidateToken();
    }
  }, [executeValidateToken]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoginLoading || isLogoutLoading || isRegisterLoading || isResetPasswordLoading,
    error: loginError || logoutError || registerError || resetPasswordError,
    login,
    logout,
    register,
    resetPassword,
  };
}
