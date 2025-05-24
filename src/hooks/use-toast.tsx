"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

// Types for toasts
export type ToastType = "default" | "destructive" | "success" | "warning" | "info";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastType;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastType;
  duration?: number;
}

const TOAST_DURATION = 5000; // 5 seconds

// Context value interface
interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Create context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      action,
      variant = "default",
      duration = TOAST_DURATION,
    }: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = { id, title, description, action, variant, duration };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Auto-dismiss toasts after duration
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) => setTimeout(() => dismiss(t.id), t.duration));
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook to consume toasts
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
