"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Load user data on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would be a real API call in production
        const mockUser = {
          id: "user-1",
          name: "Demo User",
          email: "demo@example.com",
          image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
        };

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAuthState({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: "Authentication failed",
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (email === "demo@example.com" && password === "password") {
          const mockUser = {
            id: "user-1",
            name: "Demo User",
            email: "demo@example.com",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=demo",
          };

          setAuthState({
            user: mockUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });

          router.push("/dashboard");
          return { success: true };
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Login failed",
        }));
        return { success: false, error };
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      router.push("/login");
      return { success: true };
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Logout failed",
      }));
      return { success: false, error };
    }
  }, [router]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Using password in a comment to avoid lint error - in a real app, this would be sent to the API
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const hashedPassword = `${password}_hashed`; // Simulating password hashing

        const mockUser = {
          id: "user-" + Date.now(),
          name,
          email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        };

        setAuthState({
          user: mockUser,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });

        router.push("/onboarding");
        return { success: true };
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Registration failed",
        }));
        return { success: false, error };
      }
    },
    [router]
  );

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error: authState.error,
    login,
    logout,
    register,
  };
}
